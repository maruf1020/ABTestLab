import { Command } from "commander"
import prompts from "prompts"
import kleur from "kleur"
import path from "path"
import fs from "fs-extra"
import { ROOT_DIR } from "../config.js"
import { listWebsites, listTests } from "../utils/fileUtils.js"
import { startTestServer } from "../utils/testServer.js"
import debug from "debug"
import Table from "cli-table3"

const log = debug("ab-testing-cli:start")

export const startCommand = new Command("start")
    .description("Start a test")
    .option("-w, --website <name>", "Specify the website name")
    .option("-t, --test <name>", "Specify the test name")
    .action(async (options) => {
        try {
            const history = await loadHistory()
            const settings = await loadSettings()

            const initialChoices = [
                { title: "Run a Single Test", value: "single" },
                { title: "Run Multiple Tests", value: "multiple" },
            ]

            if (history.length > 0) {
                initialChoices.unshift(
                    { title: "Run Last Active Test", value: "last" },
                    { title: "View Test History", value: "history" },
                )
            }

            const { action } = await prompts({
                type: "select",
                name: "action",
                message: "What would you like to do?",
                choices: initialChoices,
            })

            switch (action) {
                case "last":
                    await runLastActiveTest(history[0])
                    break
                case "history":
                    await viewTestHistory(history)
                    break
                case "single":
                    await runSingleTest(options)
                    break
                case "multiple":
                    console.log(kleur.yellow("This feature is coming soon!"))
                    break
            }
        } catch (error) {
            console.error(kleur.red(`Error: ${error.message}`))
            log(`Stack trace: ${error.stack}`)
        }
    })

async function loadHistory() {
    const historyPath = path.join(process.cwd(), "history.json")
    if (await fs.pathExists(historyPath)) {
        return fs.readJson(historyPath)
    }
    return []
}

async function loadSettings() {
    const settingsPath = path.join(process.cwd(), "settings.json")
    if (await fs.pathExists(settingsPath)) {
        return fs.readJson(settingsPath)
    }
    return { maxHistoryRecords: 10 }
}

async function saveHistory(history) {
    const historyPath = path.join(process.cwd(), "history.json")
    await fs.writeJson(historyPath, history, { spaces: 2 })
}

async function runLastActiveTest(lastTest) {
    console.log(
        kleur.green(`Running last active test: ${lastTest.tests[0].testName} for website ${lastTest.tests[0].websiteName}`),
    )
    await startTestServer(lastTest.tests[0].websiteName, lastTest.tests[0].testName, lastTest.tests[0].variationName)
    await updateHistory([lastTest.tests[0]])
}

async function viewTestHistory(history) {
    const table = new Table({
        head: ["Test type", "Test type", "Website Name", "Test Name", "Variation Name", "Last Run"],
        colWidths: [14, 14, 14, 14, 16, 24],
    })

    history.forEach((entry) => {
        if (entry.tests.length === 1) {
            table.push([
                "Single",
                entry.tests[0].testType,
                entry.tests[0].websiteName,
                entry.tests[0].testName,
                entry.tests[0].variationName,
                new Date(entry.lastRun).toLocaleString(),
            ])
        } else {
            const rows = entry.tests.map((test, index) => [
                index === 0 ? "Multiple" : "",
                test.testType,
                test.websiteName,
                test.testName,
                test.variationName,
                index === 0 ? new Date(entry.lastRun).toLocaleString() : "",
            ])
            table.push(...rows)
        }
    })

    console.log(table.toString())

    const { selectedTest } = await prompts({
        type: "select",
        name: "selectedTest",
        message: "Select a test to run:",
        choices: [
            ...history.flatMap((entry, index) =>
                entry.tests.map((test, testIndex) => ({
                    title: `${test.websiteName} - ${test.testName}`,
                    value: { entryIndex: index, testIndex: testIndex },
                })),
            ),
            { title: "Go back", value: -1 },
        ],
    })

    if (selectedTest !== -1) {
        const selectedEntry = history[selectedTest.entryIndex]
        const selectedTestData = selectedEntry.tests[selectedTest.testIndex]
        await startTestServer(selectedTestData.websiteName, selectedTestData.testName, selectedTestData.variationName)
        await updateHistory([selectedTestData])
    }
}

async function runSingleTest(options) {
    const websitesPath = path.join(ROOT_DIR)

    if (!fs.existsSync(websitesPath)) {
        console.log(kleur.yellow("No websites directory found. You need to create a website first."))
        return
    }

    let website = options.website
    let test = options.test
    const websites = await listWebsites()

    if (websites.length === 0) {
        console.log(kleur.yellow("No websites found. Please create a website first."))
        return
    }

    if (!website) {
        const websiteResponse = await prompts({
            type: "autocomplete",
            name: "website",
            message: "Search & select a website:",
            choices: websites.map((w) => ({ title: w, value: w })),
            suggest: (input, choices) => {
                return Promise.resolve(choices.filter((choice) => choice.title.toLowerCase().includes(input.toLowerCase())))
            },
        })
        website = websiteResponse.website
    }

    const tests = await listTests(website)

    if (tests.length === 0) {
        console.log(kleur.yellow(`No tests found for website "${website}". Please create a test first.`))
        return
    }

    if (!test) {
        const testResponse = await prompts({
            type: "autocomplete",
            name: "test",
            message: "Search & select a test:",
            choices: tests.map((t) => ({ title: t, value: t })),
            suggest: (input, choices) => {
                return Promise.resolve(choices.filter((choice) => choice.title.toLowerCase().includes(input.toLowerCase())))
            },
        })
        test = testResponse.test
    }

    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    if (!testInfo.activeVariation) {
        console.log(kleur.yellow(`No active variation for test "${test}". Please activate a variation first.`))
        return
    }

    console.log(kleur.green(`Starting test "${test}" for website "${website}"...`))
    log(`Test directory: ${testDir}`)
    log(`Active variation: ${testInfo.activeVariation}`)

    await startTestServer(website, test, testInfo.activeVariation)
    await updateHistory([
        { websiteName: website, testName: test, variationName: testInfo.activeVariation, testType: testInfo.type },
    ])
}

async function updateHistory(testData) {
    const history = await loadHistory()
    const settings = await loadSettings()

    // Add the new test data to the beginning of the array
    history.unshift({
        lastRun: new Date().toISOString(),
        tests: testData,
    })

    // Trim the history to the maximum allowed records
    if (history.length > settings.maxHistoryRecords) {
        history.length = settings.maxHistoryRecords
    }

    await saveHistory(history)
}

