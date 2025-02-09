import path from "path"
import chalk from "chalk"
import { Command } from "commander"
import { listTests, getTestInfo } from "./testUtils.js" // Ensure the correct path and file extension

export const listCommand = new Command("list")
  .description("List websites or tests")
  .option("-w, --website <name>", "List tests for a specific website")
  .action(async (options) => {
    try {
      if (options.website) {
        const tests = await listTests(options.website)
        console.log(chalk.blue(`Tests for website "${options.website}":`))
        for (const test of tests) {
          const testInfo = await getTestInfo(options.website, test)
          console.log(chalk.cyan(`- ${test} (${testInfo.type})`))
          console.log(chalk.yellow(`  Created: ${testInfo.createdAtReadable}`))
          console.log(chalk.yellow(`  Last Updated: ${new Date(testInfo.lastUpdated).toLocaleString()}`))

          if (testInfo.type === "Multi-touch") {
            console.log(chalk.yellow(`  Touchpoints:`))
            for (const touchpoint of testInfo.touchpoints) {
              console.log(chalk.cyan(`    - ${touchpoint}`))
              if (options.website && test && touchpoint) {
                const touchpointDir = path.join(process.cwd(), "websites", options.website, test, touchpoint)
                console.log(chalk.green(`    Directory: ${touchpointDir}`))
              } else {
                console.error("Error: Missing required parameters for path.join")
              }
            }
          }
        }
      } else {
        console.log("Available websites:")
        // Add logic to list available websites
      }
    } catch (error) {
      console.error("Error:", error.message)
    }
  })

