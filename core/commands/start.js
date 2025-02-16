import { Command } from "commander"
import prompts from "prompts"
import kleur from "kleur"
import path from "path"
import fs from "fs-extra"
import { ROOT_DIR } from "../config.js"
import { listWebsites, listTests } from "../utils/fileUtils.js"
import { startTestServer } from "../utils/testServer.js"
import { updateHistory, loadHistory } from "../utils/historyUtils.js"
import debug from "debug"
import Table from "cli-table3"

const log = debug("ab-testing-cli:start")

export const startCommand = new Command("start")
    .description("Start a test")
    .option("-w, --website <name>", "Specify the website name")
    .option("-t, --test <name>", "Specify the test name")
    .action(async (options) => {
        try {
            await mainMenu(options)
        } catch (error) {
            console.error(kleur.red(`Error: ${error.message}`))
            log(`Stack trace: ${error.stack}`)
        }
    })

async function mainMenu(options) {
    const history = await loadHistory()

    const initialChoices = [
        { title: "Run a Single Test", value: "single" },
        { title: "Run Multiple Tests", value: "multiple" },
        { title: "Exit", value: "exit" },
    ]

    if (history.length > 0) {
        initialChoices.unshift({ title: "Latest test", value: "latest" }, { title: "View Test History", value: "history" })
    }

    while (true) {
        const { action } = await prompts({
            type: "select",
            name: "action",
            message: kleur.magenta("What would you like to do?"),
            choices: initialChoices,
        })

        switch (action) {
            case "latest":
                await handleLatestTest(history[0])
                return
            case "history":
                await viewTestHistory(history)
                return
            case "single":
                await runSingleTest(options)
                return
            case "multiple":
                await runMultipleTests()
                return
            case "exit":
                console.log(kleur.blue("See you soon!"))
                process.exit(0)
        }
    }
}

async function handleLatestTest(lastTest) {
    if (lastTest.tests.length === 1) {
        const { action } = await prompts({
            type: "select",
            name: "action",
            message: "What would you like to do with the latest test?",
            choices: [
                { title: "Run Latest test", value: "run" },
                { title: "Change variation", value: "changeVariation" },
                { title: "Change test", value: "changeTest" },
            ],
        })

        const testData = lastTest.tests[0]

        switch (action) {
            case "run":
                await startTest(testData.websiteName, testData.testName, testData.variationName, testData.testType)
                break
            case "changeVariation":
                await changeVariation(testData.websiteName, testData.testName, testData.testType)
                break
            case "changeTest":
                await changeTest(testData.websiteName)
                break
        }
    } else {
        console.log(kleur.yellow("Running last active tests..."))
        for (const testData of lastTest.tests) {
            await startTest(testData.websiteName, testData.testName, testData.variationName, testData.testType)
        }
    }
}

async function changeVariation(website, test, testType) {
    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    const { variation } = await prompts({
        type: "select",
        name: "variation",
        message: "Select a new variation to run:",
        choices: testInfo.variations.map((v) => ({ title: v, value: v })),
    })

    await startTest(website, test, variation, testType)
}

async function changeTest(website) {
    const tests = await listTests(website)

    const { test } = await prompts({
        type: "autocomplete",
        name: "test",
        message: "Search & select a new test:",
        choices: tests.map((t) => ({ title: t, value: t })),
        suggest: (input, choices) => {
            return Promise.resolve(choices.filter((choice) => choice.title.toLowerCase().includes(input.toLowerCase())))
        },
    })

    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    const { variation } = await prompts({
        type: "select",
        name: "variation",
        message: "Select a variation to run:",
        choices: testInfo.variations.map((v) => ({ title: v, value: v })),
    })

    await startTest(website, test, variation, testInfo.type)
}

async function viewTestHistory(history) {
    const hasMultiTouchTest = history.some((entry) => entry.tests.some((test) => test.testType === "Multi-touch"))

    const tableHeaders = [
        kleur.green("Test type"),
        kleur.green("Website Name"),
        kleur.green("Test Name"),
        kleur.green("Variation Name"),
        kleur.green("Last Run"),
    ]
    const columnWidths = [14, 14, 14, 16, 24]

    if (hasMultiTouchTest) {
        tableHeaders.splice(3, 0, kleur.green("Touch-point Name"))
        columnWidths.splice(3, 0, 18)
    }

    const table = new Table({
        head: tableHeaders,
        colWidths: columnWidths,
    })

    for (const entry of history) {
        for (const test of entry.tests) {
            if (test.testType === "Multi-touch") {
                const testDir = path.join(ROOT_DIR, test.websiteName, test.testName)
                const testInfo = await fs.readJson(path.join(testDir, "info.json"))
                const touchpoints = testInfo.touchpoints || []
                touchpoints.forEach((touchpoint, index) => {
                    const row = [
                        index === 0 ? test.testType : "",
                        index === 0 ? test.websiteName : "",
                        index === 0 ? test.testName : "",
                        touchpoint,
                        test.variationName,
                        index === 0 ? new Date(entry.lastRun).toLocaleString() : "",
                    ]
                    if (!hasMultiTouchTest) {
                        row.splice(3, 1)
                    }
                    table.push(row)
                })
            } else {
                const row = [
                    test.testType,
                    test.websiteName,
                    test.testName,
                    test.variationName,
                    new Date(entry.lastRun).toLocaleString(),
                ]
                if (hasMultiTouchTest) {
                    row.splice(3, 0, "-")
                }
                table.push(row)
            }
        }
    }

    console.log(table.toString())

    const choices = history.flatMap((entry, index) =>
        entry.tests.map((test, testIndex) => ({
            title: `${test.websiteName} - ${test.testName}`,
            value: { entryIndex: index, testIndex: testIndex },
        })),
    )

    const { selectedTest } = await prompts({
        type: "select",
        name: "selectedTest",
        message: "Select a test to run:",
        choices: choices,
    })

    const selectedEntry = history[selectedTest.entryIndex]
    const selectedTestData = selectedEntry.tests[selectedTest.testIndex]
    await startTest(
        selectedTestData.websiteName,
        selectedTestData.testName,
        selectedTestData.variationName,
        selectedTestData.testType,
    )
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

    const variationResponse = await prompts({
        type: "select",
        name: "variation",
        message: "Select a variation to run:",
        choices: testInfo.variations.map((v) => ({ title: v, value: v })),
    })

    await startTest(website, test, variationResponse.variation, testInfo.type)
}

async function runMultipleTests() {
    const selectedWebsites = await selectMultipleWebsites()
    if (selectedWebsites.length === 0) {
        console.log(kleur.yellow("No websites selected. Returning to main menu."))
        return
    }

    const selectedTests = await selectMultipleTests(selectedWebsites)
    if (selectedTests.length === 0) {
        console.log(kleur.yellow("No tests selected. Returning to main menu."))
        return
    }

    const selectedVariations = await selectMultipleVariations(selectedTests)
    if (selectedVariations.length === 0) {
        console.log(kleur.yellow("No variations selected. Returning to main menu."))
        return
    }

    await startMultipleTest(selectedVariations)
}

async function selectMultipleWebsites() {
    const websites = await listWebsites()
    if (websites.length === 0) {
        console.log(kleur.yellow("No websites found. Please create a website first."))
        return []
    }

    const { selectedWebsites } = await prompts({
        type: "multiselect",
        name: "selectedWebsites",
        message: "Select websites to run tests on:",
        choices: websites.map((website) => ({ title: website, value: website })),
        min: 1,
    })

    return selectedWebsites
}

async function selectMultipleTests(websites) {
    const allTests = []
    for (const website of websites) {
        const tests = await listTests(website)
        allTests.push(...tests.map((test) => ({ website, test })))
    }

    const { selectedTests } = await prompts({
        type: "multiselect",
        name: "selectedTests",
        message: "Select tests to run:",
        choices: allTests.map(({ website, test }) => ({ title: `${website} - ${test}`, value: { website, test } })),
        min: 1,
    })

    return selectedTests
}

async function selectMultipleVariations(tests) {
    const allVariations = []
    for (const { website, test } of tests) {
        const testDir = path.join(ROOT_DIR, website, test)
        const testInfo = await fs.readJson(path.join(testDir, "info.json"))
        allVariations.push(
            ...testInfo.variations.map((variation) => ({
                website,
                test,
                variation,
                testType: testInfo.type,
            })),
        )
    }

    const { selectedVariations } = await prompts({
        type: "multiselect",
        name: "selectedVariations",
        message: "Select variations to run:",
        choices: allVariations.map(({ website, test, variation, testType }) => ({
            title: `${website} - ${test} - ${variation} (${testType})`,
            value: { website, test, variation, testType },
        })),
        min: 1,
    })

    return selectedVariations
}

async function startTest(website, test, variation, testType) {
    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    const tableHeaders = [
        kleur.green("Test type"),
        kleur.green("Website Name"),
        kleur.green("Test Name"),
        kleur.green("Variation Name"),
    ]
    const columnWidths = [14, 14, 14, 16]

    if (testType === "Multi-touch") {
        tableHeaders.splice(3, 0, kleur.green("Touch-point Name"))
        columnWidths.splice(3, 0, 18)
    }

    const table = new Table({
        head: tableHeaders,
        colWidths: columnWidths,
    })

    if (testType === "Multi-touch") {
        const touchpoints = testInfo.touchpoints || []
        touchpoints.forEach((touchpoint, index) => {
            if (index === 0) {
                table.push([testType, website, test, touchpoint, variation])
            } else {
                table.push(["", "", "", touchpoint, variation])
            }
        })
    } else {
        table.push([testType, website, test, variation])
    }

    console.log(table.toString())

    console.log(kleur.green(`Starting test "${test}" for website "${website}" with variation "${variation}"...`))
    log(`Test directory: ${testDir}`)
    log(`Active variation: ${variation}`)

    await startTestServer([{ website, test, variation }])
    await updateHistory([{ websiteName: website, testName: test, variationName: variation, testType }])
}
async function startMultipleTest(selectedVariations) {
    const testDirList = selectedVariations.map((v) => path.join(ROOT_DIR, v.website, v.test))
    const testInfoList = await Promise.all(testDirList.map((testDir) => fs.readJson(path.join(testDir, "info.json"))))

    const tableHeaders = [
        kleur.green("Test type"),
        kleur.green("Website Name"),
        kleur.green("Test Name"),
        kleur.green("Variation Name"),
    ]
    const columnWidths = [14, 14, 14, 16]

    if (selectedVariations.some((v) => v.testType === "Multi-touch")) {
        tableHeaders.splice(3, 0, kleur.green("Touch-point Name"))
        columnWidths.splice(3, 0, 18)
    }

    const table = new Table({
        head: tableHeaders,
        colWidths: columnWidths,
    })

    selectedVariations.forEach((v) => {
        if (v.testType === "Multi-touch") {
            const touchpoints = testInfoList.find((t) => t.name === v.test).touchpoints || []
            touchpoints.forEach((touchpoint, index) => {
                if (index === 0) {
                    table.push([v.testType, v.website, v.test, touchpoint, v.variation])
                } else {
                    table.push(["", "", "", touchpoint, v.variation])
                }
            })
        } else {
            table.push([v.testType, v.website, v.test, "-", v.variation])
        }
    })

    console.log(table.toString())

    console.log(kleur.green(`Starting test "${selectedVariations.map((v) => "website: " + v.website + " - test: " + v.test + " - variation: " + v.variation).join(", ")}" ...`))


    log(`Test directories: ${testDirList}`)
    log(`Active variations: ${selectedVariations.map((v) => "website: " + v.website + " test: " + v.test + " variation: " + v.variation).join(", ")}`)

    await startTestServer(selectedVariations)
    await updateHistory(selectedVariations.map((v) => ({ websiteName: v.website, testName: v.test, variationName: v.variation, testType: v.testType })))
}

