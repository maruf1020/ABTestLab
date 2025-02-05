import { Command } from "commander"
import prompts from "prompts"
import kleur from "kleur"
import path from "path"
import fs from "fs-extra"
import { ROOT_DIR } from "../config.js"
import { listWebsites, listTests } from "../utils/fileUtils.js"
import { startTestServer } from "../utils/testServer.js"
import debug from "debug"

const log = debug("ab-testing-cli:start")

export const startCommand = new Command("start")
    .description("Start a test")
    .option("-w, --website <name>", "Specify the website name")
    .option("-t, --test <name>", "Specify the test name")
    .action(async (options) => {
        try {
            let website = options.website
            let test = options.test

            if (!website) {
                const websites = await listWebsites()
                if (websites.length === 0) {
                    console.log(kleur.yellow("No websites found. Please create a website first."))
                    return
                }

                const websiteResponse = await prompts({
                    type: "select",
                    name: "website",
                    message: "Select a website:",
                    choices: websites.map((w) => ({ title: w, value: w })),
                })
                website = websiteResponse.website
            }

            if (!test) {
                const tests = await listTests(website)
                if (tests.length === 0) {
                    console.log(kleur.yellow(`No tests found for website "${website}". Please create a test first.`))
                    return
                }

                const testResponse = await prompts({
                    type: "select",
                    name: "test",
                    message: "Select a test:",
                    choices: tests.map((t) => ({ title: t, value: t })),
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

