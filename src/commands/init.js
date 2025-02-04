import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import ora from "ora"
import chalk from "chalk"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const initCommand = new Command("init").description("Initialize template folders").action(async () => {
    const spinner = ora("Creating template folders...").start()

    try {
        const templatesDir = path.resolve(__dirname, "..", "templates")

        // Create templates directory
        await fs.ensureDir(templatesDir)

        // Create variation template
        const variationDir = path.join(templatesDir, "variation")
        await fs.ensureDir(variationDir)
        await fs.writeFile(path.join(variationDir, "index.js"), "// JavaScript file for variation logic")
        await fs.writeFile(path.join(variationDir, "style.scss"), "/* SCSS file for variation styling */")
        await fs.writeJson(path.join(variationDir, "info.json"), { name: "Variation Name" })

        // Create touch-point template
        const touchPointDir = path.join(templatesDir, "touch-point")
        await fs.ensureDir(touchPointDir)
        await fs.ensureDir(path.join(touchPointDir, "targeting"))
        await fs.writeFile(
            path.join(touchPointDir, "targeting", "css_targeting.js"),
            "// JavaScript file for CSS targeting",
        )
        await fs.writeFile(path.join(touchPointDir, "targeting", "js_targeting.js"), "// JavaScript file for JS targeting")
        await fs.writeJson(path.join(touchPointDir, "targeting", "json_targeting.json"), {})
        await fs.writeJson(path.join(touchPointDir, "info.json"), { name: "Touch Point Name" })

        spinner.succeed(chalk.green("Template folders created successfully!"))
    } catch (error) {
        spinner.fail(chalk.red(`Failed to create template folders: ${error.message}`))
    }
})

