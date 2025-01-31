import { Command } from "commander"
import { listWebsites, listTests } from "../utils/fileUtils.js"
import chalk from "chalk"

export const listCommand = new Command("list")
  .description("List websites or tests")
  .option("-w, --website <name>", "List tests for a specific website")
  .action(async (options) => {
    try {
      if (options.website) {
        const tests = await listTests(options.website)
        console.log(chalk.blue(`Tests for website "${options.website}":`))
        tests.forEach((test) => console.log(chalk.cyan(`- ${test}`)))
      } else {
        const websites = await listWebsites()
        console.log(chalk.blue("Available websites:"))
        websites.forEach((website) => console.log(chalk.cyan(`- ${website}`)))
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`))
    }
  })

