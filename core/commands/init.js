import { Command } from "commander"
import { initializeSkeleton } from "../utils/init.js"

export const initCommand = new Command("init").description("Initialize template folders").action(async () => {
    try {
        await initializeSkeleton()
    } catch (error) {
        console.error(`Failed to initialize skeleton: ${error.message}`)
    }
})