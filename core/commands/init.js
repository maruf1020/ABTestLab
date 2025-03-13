import chalk from "chalk"
import { Command } from "commander"

import { createSettingsFile } from "../scripts/createSettingsFile.js"
import { createSkeleton } from "../scripts/createSkeleton.js"
import { downloadSocketIO } from "../scripts/downloadSocketIO.js"

export const initCommand = new Command("init").description("Initialize template folders").action(init)
export async function init() {
    try {
        console.log(chalk.yellow("Creating skeleton and downloading dependency files..."))

        await downloadSocketIO();
        await createSettingsFile();
        await createSkeleton();

    } catch (error) {
        console.error(`Failed to initialize skeleton: ${error.message}`)
    }
}
