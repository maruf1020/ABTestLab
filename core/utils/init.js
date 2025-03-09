import chalk from "chalk"
import { downloadSocketIO } from "../scripts/downloadSocketIo.js"
import { createSettingsFile } from "../scripts/createSettingsFile.js"
import { createSkeleton } from "../scripts/createSkeleton.js"


export async function initializeSkeleton() {
    try {
        console.log(chalk.yellow("Creating skeleton and downloading dependency files..."))

        await downloadSocketIO();
        await createSettingsFile();
        await createSkeleton();

    } catch (error) {
        console.error(chalk.red(`Failed to create skeleton: ${error.message}`))
        throw error
    }
}

