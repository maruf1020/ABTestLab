import debug from "debug"
import kleur from "kleur"
import prompts from "prompts"
import { Command } from "commander"

import { handleLatestTest, runSingleTest, viewTestHistory, groupTestMenu } from "../utils/startUtils.js"
import { loadHistory } from "../utils/historyUtils.js"
import { runCLI } from "../index.js";

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
        {
            title: "Run Group Tests",
            value: "group",
            submenu: [
                { title: "Create Group Test", value: "create" },
                { title: "Run from History", value: "history" },
                { title: "View Group Test History", value: "viewHistory" }
            ]
        },
        { title: "🔙 Back", value: "back" },
        { title: "❌ Exit", value: "exit" },
    ]

    if (history.length > 0) {
        initialChoices.unshift({ title: "Latest test", value: "latest" }, { title: "View Test History", value: "history" })
    }

    while (true) {
        const { action } = await prompts({
            type: "autocomplete",
            name: "action",
            message: kleur.magenta("What would you like to do?"),
            choices: initialChoices,
        })

        switch (action) {
            case "latest":
                await handleLatestTest(history[0], () => mainMenu())
                return
            case "history":
                await viewTestHistory(history, "allTest", () => mainMenu())
                return
            case "single":
                await runSingleTest(options, () => mainMenu())
                return
            case "group":
                await groupTestMenu(history, () => mainMenu())
                return
            case "back":
                runCLI();
                return null;
            case "exit":
                console.log(kleur.blue("See you soon!"))
                process.exit(0)
        }
    }
}