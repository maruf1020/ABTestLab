import { Command } from "commander"
import prompts from "prompts"
import { createWebsite, createTest } from "../utils/creators.js"
import { listWebsites } from "../utils/fileUtils.js"
import chalk from "chalk"

export const createCommand = new Command("create").description("Create a new website or test").action(async () => {
  let exit = false
  while (!exit) {
    const response = await prompts({
      type: "select",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { title: "Create New Website", value: "Create New Website" },
        { title: "Create New Test", value: "Create New Test" },
        { title: "Go Back", value: "Go Back" },
        { title: "Exit", value: "Exit" },
      ],
    })
    const { choice } = response

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
  const response = await prompts({
    type: "text",
    name: "websiteName",
    message: "Enter the name of the new website:",
    validate: (input) => input.trim() !== "" || "Website name cannot be empty",
  })
  const { websiteName } = response

  try {
    await createWebsite(websiteName)

    const response = await prompts({
      type: "toggle",
      name: "createTest",
      message: "Would you like to create a test for this website now?",
      initial: true,
      active: "yes",
      inactive: "no",
    })
    const { createTest } = response

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

  const response = await prompts({
    type: "select",
    name: "website",
    message: "Select a website to create a test for:",
    choices: [
      ...websites.map((website) => ({ title: website, value: website })),
      { title: "Go Back", value: "Go Back" },
    ],
  })
  const { website } = response

  if (website === "Go Back") {
    return
  }

  await promptAndCreateTest(website)
}

async function promptAndCreateTest(website) {
  const response = await prompts([
    {
      type: "text",
      name: "testName",
      message: "Enter the name of the new test:",
      validate: (input) => input.trim() !== "" || "Test name cannot be empty",
    },
    {
      type: "select",
      name: "testType",
      message: "Select the test type:",
      choices: ["A/B", "AA", "Multipage", "Patch"].map(type => ({ title: type, value: type })),
    },
  ])
  const { testName, testType } = response

  try {
    await createTest(website, testName, testType)
    console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`))
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`))
  }
}