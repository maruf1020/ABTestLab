import { Command } from "commander"
import inquirer from "inquirer"
import { createWebsite, createTest } from "../utils/creators.js"
import { listWebsites } from "../utils/fileUtils.js"
import chalk from "chalk"

export const createCommand = new Command("create").description("Create a new website or test").action(async () => {
  let exit = false
  while (!exit) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Create New Website", "Create New Test", "Go Back", "Exit"],
      },
    ])

    switch (choice) {
      case "Create New Website":
        await createNewWebsite()
        break
      case "Create New Test":
        await createNewTest()
        break
      case "Go Back":
        // Continue the loop
        break
      case "Exit":
        exit = true
        console.log(chalk.blue("Goodbye!"))
        break
    }
  }
})

async function createNewWebsite() {
  const { websiteName } = await inquirer.prompt([
    {
      type: "input",
      name: "websiteName",
      message: "Enter the name of the new website:",
      validate: (input) => input.trim() !== "" || "Website name cannot be empty",
    },
  ])

  try {
    await createWebsite(websiteName)
    console.log(chalk.green(`Website "${websiteName}" created successfully.`))

    const { createTest } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createTest",
        message: "Would you like to create a test for this website now?",
        default: true,
      },
    ])

    if (createTest) {
      await promptAndCreateTest(websiteName)
    }
  } catch (error) {
    console.error(chalk.red(`Failed to create website: ${error.message}`))
  }
}

async function createNewTest() {
  const websites = await listWebsites()
  if (websites.length === 0) {
    console.log(chalk.yellow("No websites found. Please create a new website first."))
    return
  }

  const { website } = await inquirer.prompt([
    {
      type: "list",
      name: "website",
      message: "Select a website to create a test for:",
      choices: [...websites, "Go Back"],
    },
  ])

  if (website === "Go Back") {
    return
  }

  await promptAndCreateTest(website)
}

async function promptAndCreateTest(website) {
  const { testName, testType } = await inquirer.prompt([
    {
      type: "input",
      name: "testName",
      message: "Enter the name of the new test:",
      validate: (input) => input.trim() !== "" || "Test name cannot be empty",
    },
    {
      type: "list",
      name: "testType",
      message: "Select the test type:",
      choices: ["Normal", "A/B", "Multipage"],
    },
  ])

  try {
    await createTest(website, testName, testType)
    console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`))
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`))
  }
}

