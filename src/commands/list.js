import { Command } from "commander"
import { listWebsites, listTests } from "../utils/fileUtils.js"

export const listCommand = new Command("list")
  .description("List websites or tests")
  .option("-w, --website <name>", "List tests for a specific website")
  .action(async (options) => {
    if (options.website) {
      const tests = await listTests(options.website)
      console.log(`Tests for website "${options.website}":`)
      tests.forEach((test) => console.log(`- ${test}`))
    } else {
      const websites = await listWebsites()
      console.log("Available websites:")
      websites.forEach((website) => console.log(`- ${website}`))
    }
  })

