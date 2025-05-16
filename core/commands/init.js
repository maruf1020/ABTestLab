import chalk from "chalk"
import { Command } from "commander"

import { createSettingsFile } from "../scripts/createSettingsFile.js"
import { createSkeleton } from "../scripts/createSkeleton.js"
import { structureOldProject } from "../scripts/structureOldProject.js"

export const initCommand = new Command("init").description("Initialize template folders").action(init)
export async function init() {
    try {
        // console.log(chalk.yellow("Creating skeleton and downloading dependency files..."))

        await createSettingsFile();
        await createSkeleton();
        // await structureOldProject();

        console.log(chalk.green("Project initialized successfully! 💯"))

    } catch (error) {
        console.error(`Failed to initialize project: ${error.message}`)
    }
}
