import { Command } from "commander"
import prompts from "prompts"
import kleur from "kleur"
import path from "path"
import fs from "fs-extra"
import { ROOT_DIR } from "../config.js"
import { listWebsites, listTests } from "../utils/fileUtils.js"
import { startTestServer } from "../utils/testServer.js"

export const startCommand = new Command("start").description("Start a test").action(async () => {
    try {
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

        const tests = await listTests(websiteResponse.website)
        if (tests.length === 0) {
            console.log(kleur.yellow(`No tests found for website "${websiteResponse.website}". Please create a test first.`))
            return
        }

        const testResponse = await prompts({
            type: "select",
            name: "test",
            message: "Select a test:",
            choices: tests.map((t) => ({ title: t, value: t })),
        })

        const testDir = path.join(ROOT_DIR, websiteResponse.website, testResponse.test)
        const testInfo = await fs.readJson(path.join(testDir, "info.json"))

        if (!testInfo.activeVariation) {
            console.log(
                kleur.yellow(`No active variation for test "${testResponse.test}". Please activate a variation first.`),
            )
            return
        }

        console.log(kleur.green(`Starting test "${testResponse.test}" for website "${websiteResponse.website}"...`))
        await startTestServer(websiteResponse.website, testResponse.test, testInfo.activeVariation)
    } catch (error) {
        console.error(kleur.red(`Error: ${error.message}`))
    }
})

