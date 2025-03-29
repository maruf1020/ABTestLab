import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function createSettingsFile() {
    const settingsPath = path.join(process.cwd(), "settings.json")
    const defaultSettings = {
        cssReload: false,
        jsReload: true,
        displayUI: true,
        maxHistoryRecords: 10,
        bundler: {
            generatePureJS: true,
            generatePureCSS: true,
            generateMinifiedJS: true,
            generateMinifiedCSS: true,
            generateJSWithCSS: true,
            generateMinifiedJSWithCSS: true
        },
        _comments: {
            cssReload:
                "If true, the page will reload when CSS changes are detected. If false, CSS changes will be applied without reloading.",
            jsReload:
                "If true, the page will reload when CSS changes are detected. If false, CSS changes will be applied without reloading.",
            displayUI: "If true, the test helper UI will be displayed on the browser. If false, the UI will be hidden.",
            maxHistoryRecords: "The maximum number of history records to keep in the history panel.",
            bundler: {
                generatePureJS: "If true, the bundler will generate a pure JS file.",
                generatePureCSS: "If true, the bundler will generate a pure CSS file.",
                generateMinifiedJS: "If true, the bundler will generate a minified JS file.",
                generateMinifiedCSS: "If true, the bundler will generate a minified CSS file.",
                generateJSWithCSS: "If true, the bundler will generate a JS file with CSS.",
                generateMinifiedJSWithCSS: "If true, the bundler will generate a minified JS file with minified CSS."
            }
        },
    }

    try {
        await fs.writeJson(settingsPath, defaultSettings, { spaces: 4 })
        console.log(chalk.green("settings.json file created successfully!"))
    } catch (error) {
        console.error(chalk.red(`Failed to create settings.json file: ${error.message}`))
    }
}