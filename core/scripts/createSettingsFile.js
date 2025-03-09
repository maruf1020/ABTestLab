import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function createSettingsFile() {
    const settingsPath = path.join(process.cwd(), "settings.json")
    const defaultSettings = {
        cssReload: false,
        jsReload: true,
        maxHistoryRecords: 10,
        _comments: {
            cssReload:
                "If true, the page will reload when CSS changes are detected. If false, CSS changes will be applied without reloading.",
            jsReload:
                "If true, the page will reload when CSS changes are detected. If false, CSS changes will be applied without reloading.",
            maxHistoryRecords: "The maximum number of history records to keep in the history panel.",
        },
    }

    try {
        await fs.writeJson(settingsPath, defaultSettings, { spaces: 4 })
        console.log(chalk.green("settings.json file created successfully!"))
    } catch (error) {
        console.error(chalk.red(`Failed to create settings.json file: ${error.message}`))
    }
}