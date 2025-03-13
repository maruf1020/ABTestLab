import chalk from "chalk"
import { Command } from "commander"

import { createSettingsFile } from "../scripts/createSettingsFile"
import { createSkeleton } from "../scripts/createSkeleton"
import { downloadSocketIO } from "../scripts/downloadSocketIO"

export const initCommand = new Command("init").description("Initialize template folders").action(init)
async function init() {
    try {
        console.log(chalk.yellow("Creating skeleton and downloading dependency files..."))

        await downloadSocketIO();
        await createSettingsFile();
        await createSkeleton();

    } catch (error) {
        console.error(`Failed to initialize skeleton: ${error.message}`)
    }
}
