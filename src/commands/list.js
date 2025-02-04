import { Command } from "commander"
import { listWebsites, listTests, getTestInfo } from "../utils/fileUtils.js"
import chalk from "chalk"
import path from "path"
import fs from "fs-extra"

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

          if (testInfo.type === "Multipage") {
            console.log(chalk.yellow(`  Touchpoints:`))
            for (const touchPoint of testInfo.touchpoints) {
              console.log(chalk.cyan(`    - ${touchPoint}`))
              const touchPointDir = path.join(process.cwd(), "websites", options.website, test, touchPoint)
              const variations = await fs.readdir(touchPointDir)
              for (const variation of variations) {
                if (variation !== "info.json" && (await fs.stat(path.join(touchPointDir, variation))).isDirectory()) {
                  const variationInfo = await fs.readJson(path.join(touchPointDir, variation, "info.json"))
                  if (variationInfo.active) {
                    console.log(chalk.green(`      - ${variation} (active)`))
                  } else {
                    console.log(chalk.cyan(`      - ${variation}`))
                  }
                }
              }
            }
          } else {
            console.log(chalk.yellow(`  Variations:`))
            for (const variation of testInfo.variations) {
              const variationInfo = await fs.readJson(
                path.join(process.cwd(), "websites", options.website, test, variation, "info.json"),
              )
              if (variationInfo.active) {
                console.log(chalk.green(`    - ${variation} (active)`))
              } else {
                console.log(chalk.cyan(`    - ${variation}`))
              }
            }
          }
        }
      } else {
        const websites = await listWebsites()
        console.log(chalk.blue("Available websites:"))
        for (const website of websites) {
          const websiteInfo = await fs.readJson(path.join(process.cwd(), "websites", website, "info.json"))
          console.log(chalk.cyan(`- ${website}`))
          console.log(chalk.yellow(`  Hostnames: ${websiteInfo.hostnames.join(", ")}`))
          console.log(chalk.yellow(`  Created: ${websiteInfo.createdAtReadable}`))
          console.log(chalk.yellow(`  Last Updated: ${new Date(websiteInfo.lastUpdated).toLocaleString()}`))
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`))
    }
  })

