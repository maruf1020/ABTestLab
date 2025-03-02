import { Command } from "commander"
import prompts from "prompts"
import { createWebsite, createTest, listTests } from "../utils/creators.js"
import { getTestInfo, listWebsites } from "../utils/fileUtils.js"
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
      { title: "Create New Website", value: "Create New Website" },
      ...websites.map((website) => ({ title: website, value: website })),
      { title: "Go Back", value: "Go Back" },
      { title: "Exit", value: "Exit" },
    ],
  })
  const { website } = response

  if (website === "Go Back") {
    return
  } else if (website === "Exit") {
    process.exit(0)

  } else if (website === "Create New Website") {
    await createNewWebsite()
    return
  }

  await promptAndCreateTest(website)
}

async function promptAndCreateTest(website) {
  const tests = await listTests(website);
  console.log(tests);

  const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select an action:',
    choices: [
      { title: 'Create a test', value: 'create' },
      ...tests.map((test) => ({ title: test, value: test })),
      { title: 'Go back', value: 'back' },
      { title: 'Exit', value: 'exit' }
    ]
  });

  const { action } = response;

  if (action === 'create') {
    await handleCreateTest(website);
  } else if (action === 'back') {
    console.log('Going back...');
  } else if (action === 'exit') {
    console.log('Exiting...');
  } else {
    await handleSelectedTest(website, action);
  }
}

async function handleCreateTest(website) {
  const createResponse = await prompts([
    {
      type: 'text',
      name: 'testName',
      message: 'Enter the name of the new test:',
      validate: (input) => input.trim() !== '' || 'Test name cannot be empty',
    },
    {
      type: 'select',
      name: 'testType',
      message: 'Select the test type:',
      choices: ['A/B', 'AA', 'Multi-touch', 'Patch'].map((type) => ({ title: type, value: type })),
    },
  ]);

  const { testName, testType } = createResponse;

  try {
    await createTest(website, testName, testType);
    console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`));
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`));
  }
}

async function handleSelectedTest(website, testName) {
  const testInfo = await getTestInfo(website, testName);
  console.log(testInfo);

  if (testInfo.type === 'Multi-touch' && testInfo.touchPoints) {
    await handleTouchPointActions(website, testName, testInfo);
  } else {
    await handleVariationActions(website, testName, testInfo);
  }
}

async function handleTouchPointActions(website, testName, testInfo) {
  const touchPointResponse = await prompts({
    type: 'select',
    name: 'touchPointAction',
    message: 'Select a touch point action:',
    choices: [
      { title: 'Create a new touch point', value: 'createTouchPoint' },
      ...testInfo.touchPoints.map((touchPoint) => ({ title: touchPoint, value: touchPoint })),
      { title: 'Go back', value: 'back' },
      { title: 'Exit', value: 'exit' }
    ]
  });

  const { touchPointAction } = touchPointResponse;

  if (touchPointAction === 'createTouchPoint') {
    const newTouchPointResponse = await prompts({
      type: 'text',
      name: 'newTouchPoint',
      message: 'Enter the name of the new touch point:',
      validate: (input) => input.trim() !== '' || 'Touch point name cannot be empty',
    });

    const { newTouchPoint } = newTouchPointResponse;

    try {
      await createTouchPoint(website, testName, newTouchPoint);
      console.log(chalk.green(`Touch point "${newTouchPoint}" created successfully for test "${testInfo.name}".`));
    } catch (error) {
      console.error(chalk.red(`Failed to create touch point: ${error.message}`));
    }
  } else if (touchPointAction === 'back') {
    console.log('Going back...');
  } else if (touchPointAction === 'exit') {
    console.log('Exiting...');
  } else {
    await handleVariationActions(website, testName, testInfo);
  }
}

async function handleVariationActions(website, testName, testInfo) {
  const variationResponse = await prompts({
    type: 'select',
    name: 'variationAction',
    message: 'Select a variation action:',
    choices: [
      { title: 'Create a new variation', value: 'createVariation' },
      ...testInfo.variations.map((variation) => ({ title: variation, value: variation })),
      { title: 'Go back', value: 'back' },
      { title: 'Exit', value: 'exit' }
    ]
  });

  const { variationAction } = variationResponse;

  if (variationAction === 'createVariation') {
    const newVariationResponse = await prompts({
      type: 'text',
      name: 'newVariation',
      message: 'Enter the name of the new variation:',
      validate: (input) => input.trim() !== '' || 'Variation name cannot be empty',
    });

    const { newVariation } = newVariationResponse;

    try {
      await createVariation(website, testName, newVariation);
      console.log(chalk.green(`Variation "${newVariation}" created successfully for test "${testInfo.name}".`));
    } catch (error) {
      console.error(chalk.red(`Failed to create variation: ${error.message}`));
    }
  } else if (variationAction === 'back') {
    console.log('Going back...');
  } else if (variationAction === 'exit') {
    console.log('Exiting...');
  } else {
    console.log(`Selected variation: ${variationAction}`);
  }
}