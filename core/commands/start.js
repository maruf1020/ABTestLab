import { Command } from "commander"
import prompts from "prompts"
import kleur from "kleur"
import path from "path"
import fs from "fs-extra"
import { ROOT_DIR } from "../config.js"
import { listWebsites, listTests } from "../utils/fileUtils.js"
import { startTestServer } from "../utils/testServer.js"
import debug from "debug"
import { execSync } from "child_process"

const log = debug("ab-testing-cli:start")

export const startCommand = new Command("start")
    .description("Start a test")
    .option("-w, --website <name>", "Specify the website name")
    .option("-t, --test <name>", "Specify the test name")
    .action(async (options) => {
        try {
            const websitesPath = path.join(ROOT_DIR)

            if (!fs.existsSync(websitesPath)) {
                console.log(kleur.yellow("No websites directory found. You need to create a website first."));
                return;
            }

            let website = options.website
            let test = options.test
            const websites = await listWebsites()

            if (websites.length === 0) {
                console.log(kleur.yellow("No websites found. Please create a website first."))

                const createWebsiteResponse = await prompts({
                    type: "confirm",
                    name: "createWebsite",
                    message: "Would you like to create a new website?",
                    initial: true
                })

                if (createWebsiteResponse.createWebsite) {
                    execSync("node ./commands/create.js", { stdio: "inherit" })
                }
                return
            }

            if (!website) {
                const websiteResponse = await prompts({
                    type: "autocomplete",
                    name: "website",
                    message: "Search & select a website:",
                    choices: websites.map((w) => ({ title: w, value: w })),
                    suggest: (input, choices) => {
                        return Promise.resolve(
                            choices.filter(choice => choice.title.toLowerCase().includes(input.toLowerCase()))
                        )
                    }
                })
                website = websiteResponse.website
            }

            const tests = await listTests(website)

            if (tests.length === 0) {
                console.log(kleur.yellow(`No tests found for website "${website}". Please create a test first.`))

                const createTestResponse = await prompts({
                    type: "confirm",
                    name: "createTest",
                    message: `Would you like to create a new test for website "${website}"?`,
                    initial: true
                })

                if (createTestResponse.createTest) {
                    execSync("node ./commands/create.js", { stdio: "inherit" })
                }
                return
            }

            if (!test) {
                const testResponse = await prompts({
                    type: "autocomplete",
                    name: "test",
                    message: "Search & select a test:",
                    choices: tests.map((t) => ({ title: t, value: t })),
                    suggest: (input, choices) => {
                        return Promise.resolve(
                            choices.filter(choice => choice.title.toLowerCase().includes(input.toLowerCase()))
                        )
                    }
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
        } catch (error) {
            console.error(kleur.red(`Error: ${error.message}`))
            log(`Stack trace: ${error.stack}`)
        }
    })