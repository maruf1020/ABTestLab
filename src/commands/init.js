import { Command } from "commander"
import { initializeTemplates } from "../utils/init.js"

export const initCommand = new Command("init").description("Initialize template folders").action(async () => {
    try {
        await initializeTemplates()
    } catch (error) {
        console.error(`Failed to initialize templates: ${error.message}`)
    }
})

