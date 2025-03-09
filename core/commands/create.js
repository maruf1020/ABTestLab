import { Command } from "commander"
import prompts from "prompts"
import { createWebsite, createTest, createTouchPoint, createVariation } from "../utils/creators.js"
import { listWebsites, listTests, listOnlyMultiTouchTests, listAllTestExceptMultiTouch, listTouchPoints, listVariations, listTouchPointsAndVariations, getWebsiteInfo, getTestInfo, getTouchPointInfo, getTouchPointsVariationInfo, getVariationInfo } from "../utils/fileUtils.js"
import chalk from "chalk"
import kleur from "kleur"

export const createCommand = new Command("create").description("Create a new website or test").action(create)

async function create() {
  const selectedWebsite = await selectWebsite();
  if (typeof selectedWebsite === 'string') {
    await handleTestSelection(selectedWebsite);
  }
}

async function handleTestSelection(selectedWebsite) {
  const selectedTest = await selectTest(selectedWebsite, create);
  if (typeof selectedTest === 'string') {
    const testInfo = await getTestInfo(selectedWebsite, selectedTest);
    if (typeof testInfo === 'object' && testInfo !== null && 'type' in testInfo) {
      console.log(chalk.green(`Selected test----: (${testInfo.type})`));
      switch (testInfo.type) {
        case 'Multi-touch':
          const selectedTouchPoint = await selectTouchPointAndVariations(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
          if (selectedTouchPoint === 'back') {
            await handleTestSelection(selectedWebsite);
          } else {
            if (selectedTouchPoint.includes(' (variation)')) {
              const variationName = selectedTouchPoint.replace(' (variation)', '');
              selectVariationDetails(selectedWebsite, selectedTest, variationName, () => handleTestSelection(selectedWebsite));
            } else if (selectedTouchPoint.includes(' (touchPoint)')) {
              const touchPointName = selectedTouchPoint.replace(' (touchPoint)', '');
              selectTouchPointDetails(selectedWebsite, selectedTest, touchPointName, () => handleTestSelection(selectedWebsite));
            } else {
              console.log('Unexpected Selection:', selectedTouchPoint);
            }
          }
          break;
        case 'AA':
        case 'A/B':
          const selectedVariation = await selectVariation(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
          if (selectedVariation === 'back') {
            await handleTestSelection(selectedWebsite);
          } else {
            selectVariationDetails(selectedWebsite, selectedTest, selectedVariation, () => handleTestSelection(selectedWebsite));
          }
          break;
        case 'Patch':
          const returnValue = await selectVariation(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
          if (returnValue === 'back') {
            await handleTestSelection(selectedWebsite);
          } else {
            selectVariationDetails(selectedWebsite, selectedTest, returnValue, () => handleTestSelection(selectedWebsite));
          }
          break;
        default:
          console.error('Unknown test type');
      }
    } else {
      console.log('Invalid testInfo object');
    }
  }
}

async function handleTestDetails(selectedWebsite, selectedTest) { }

// Helper function to handle website and test selection
async function selectWebsite() {
  try {
    // List available websites
    const websites = await listWebsites();
    const options = [
      { title: "Create New Website", value: "create" },
      ...websites.map(w => ({ title: w, value: w })),
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" },
    ];

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "create":
        const websiteInfo = await createNewWebsite();
        return websiteInfo ? websiteInfo.name : null;
      case "back":
        // goBack();
        console.log(kleur.yellow("npm run cli is now under development. Please run the command again to continue."));
        return null;
      case "exit":
        process.exit(0);
      default:
        return response.choice;
    }
  } catch (error) {
    console.log(chalk.red('Error selecting website:', error.message));
    return null;
  }
}

async function selectTest(selectedWebsite, goBack) {
  try {
    // Get tests for selected website
    const tests = await listTests(selectedWebsite);
    const options = [
      { title: "Create New Test", value: "create" },
      ...tests.map(t => ({ title: t, value: t })),
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" },
    ];

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "create":
        const testInfo = await createNewTest(selectedWebsite);
        return testInfo ? testInfo.name : null;
      case "back":
        goBack();
        return null;
      case "exit":
        process.exit(0);
      default:
        return response.choice;
    }
  } catch (error) {
    console.log(chalk.red('Error selecting test:', error.message));
    return null;
  }
}

async function selectTouchPoint(selectedWebsite, selectedTest, goBack) {
  try {
    // Get touch points for selected website and test
    const touchPoints = await listTouchPoints(selectedWebsite, selectedTest);
    const options = [
      { title: "Create New Touch Point", value: "create" },
      ...touchPoints.map(tp => ({ title: tp.name, value: tp })),
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" },
    ];

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "create":
        // const testInfo = await createNewTest(selectedWebsite);
        // return testInfo ? testInfo.name : null;
        await createNewTouchPoint(selectedWebsite, selectedTest);
        // After creating, re-run the selection
        return await selectTouchPoint(selectedWebsite, selectedTest, goBack);
      case "back":
        goBack();
        return null;
      case "exit":
        process.exit(0);
      default:
        return response.choice;
    }
  } catch (error) {
    console.log(chalk.red('Error selecting touch point:', error.message));
    return null;
  }
}

async function selectVariation(selectedWebsite, selectedTest, goBack) {
  try {
    const testInfo = await getTestInfo(selectedWebsite, selectedTest);
    const variations = await listVariations(selectedWebsite, selectedTest);

    const options = [
      { title: "Create New Variation", value: "create" },
      ...variations.map(v => ({ title: v.name, value: v })),
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" },
    ];

    if (testInfo.type === 'Patch') {
      options.shift();
    }

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "create":
        // const testInfo = await createNewTest(selectedWebsite);
        // return testInfo ? testInfo.name : null;
        await createNewVariation(selectedWebsite, selectedTest);
        // After creating, re-run the selection
        return await selectVariation(selectedWebsite, selectedTest, goBack);
      case "back":
        goBack();
        return null;
      case "exit":
        process.exit(0);
      default:
        return response.choice;
    }
  } catch (error) {
    console.log(chalk.red('Error selecting variation:', error.message));
    return null;
  }
}

async function selectTouchPointAndVariations(selectedWebsite, selectedTest, goBack) {
  try {
    const touchPointsAndVariations = await listTouchPointsAndVariations(selectedWebsite, selectedTest);
    const options = [
      { title: "Create New Touch Point", value: "create-touch-point" },
    ];

    if (touchPointsAndVariations.some(item => item.type === "touchPoint")) {
      options.push({ title: "Create New Variation", value: "create-variation" });
    }

    options.push(
      ...touchPointsAndVariations.map(item => ({ title: item.name + ' (' + (item.type === "variation" ? kleur.blue(item.type) : kleur.magenta(item.type)) + ')', value: item.name + ' (' + item.type + ')' })),
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" }
    );

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "create-touch-point":
        await createNewTouchPoint(selectedWebsite, selectedTest);
        // // After creating, re-run the selection
        return await selectTouchPointAndVariations(selectedWebsite, selectedTest, goBack);
      case "create-variation":
        await createNewVariation(selectedWebsite, selectedTest);
        return await selectTouchPointAndVariations(selectedWebsite, selectedTest, goBack);
      case "back":
        goBack();
        return null;
      case "exit":
        process.exit(0);
      default:
        return response.choice;
    }
  } catch (error) {
    console.log(chalk.red('Error selecting touch point:', error.message));
    return null;
  }
}

async function selectVariationDetails(selectedWebsite, selectedTest, selectedVariation, goBack) {
  try {
    const options = [
      { title: "Start Variation", value: "start" },
      { title: "See Test Details", value: "details" },
      { title: "Build Variation", value: "build" },
      { title: "Remove Variation", value: "remove" },
      { title: "Rename Variation", value: "rename" },
      { title: "Copy Variation to Another Test", value: "copy-to-another-test" },
      // { title: "Copy Any Variation to This Test", value: "copy-to-this-test" },
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" },
    ];

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "start":
        // Start variation
        console.log(kleur.yellow("Under development"));
        break;
      case "details":
        // See test details
        console.log(kleur.yellow("Under development"));
        break;
      case "build":
        // Build variation
        console.log(kleur.yellow("Under development"));
        break;
      case "remove":
        // Remove variation
        console.log(kleur.yellow("Under development"));
        break;
      case "rename":
        // Rename variation
        console.log(kleur.yellow("Under development"));
        break;
      case "copy-to-another-test":
        // Copy variation to another test
        console.log(kleur.yellow("Under development"));
        break;
      // case "copy-to-this-test":
      //   // Copy any variation to this test
      //   console.log(kleur.yellow("Under development"));
      //   break;
      case "back":
        // Go back
        console.log(kleur.yellow("Under development"));
        break;
      case "exit":
        // Exit
        console.log(kleur.yellow("Under development"));
        break;
      default:
        break;
    }

  } catch (error) {
    console.error(chalk.red(`Failed to get variation details: ${error.message}`));
  }

}

async function selectTouchPointDetails(selectedWebsite, selectedTest, selectedTouchPoint, goBack) {
  try {
    const options = [
      { title: "See Test Details", value: "details" },
      { title: "Remove Touch Point", value: "remove" },
      { title: "Rename Touch Point", value: "rename" },
      { title: "Build All variation inside Touch Point", value: "build-all-variation" },
      { title: "Copy Touch Point to Another Test", value: "copy-to-another-test" },
      // { title: "Copy Any Touch Point to This Test", value: "copy-to-this-test" },
      { title: "Go Back", value: "back" },
      { title: "Exit", value: "exit" },
    ];

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Select an option:",
      choices: options,
    });

    switch (response.choice) {
      case "details":
        // See test details
        console.log(kleur.yellow("Under development"));
        break;
      case "remove":
        // Remove touch point
        console.log(kleur.yellow("Under development"));
        break;
      case "rename":
        // Rename touch point
        console.log(kleur.yellow("Under development"));
        break;
      case "build-all-variation":
        // Build all variation inside touch point
        console.log(kleur.yellow("Under development"));
        break;
      case "copy-to-another-test":
        // Copy touch point to another test
        console.log(kleur.yellow("Under development"));
        break;
      // case "copy-to-this-test":
      //   // Copy any touch point to this test
      //   console.log(kleur.yellow("Under development"));
      //   break;
      case "back":
        // Go back
        console.log(kleur.yellow("Under development"));
        break;
      case "exit":
        // Exit
        console.log(kleur.yellow("Under development"));
        break;
      default:
        break;
    }

  } catch (error) {
    console.error(chalk.red(`Failed to get touch point details: ${error.message}`));
  }
}

async function createNewWebsite() {
  const websites = await listWebsites();
  const createResponse = await prompts([
    {
      type: "text",
      name: "websiteName",
      message: "Enter the name of the new website:",
      validate: (input) => {
        const trimmedInput = input.trim();
        const validNamePattern = /^[a-zA-Z0-9\-_ ]+$/;
        if (trimmedInput === '') {
          return 'Website name cannot be empty';
        }
        if (!validNamePattern.test(trimmedInput)) {
          const invalidChars = [...new Set(trimmedInput.replace(/[a-zA-Z0-9\-_ ]/g, ''))].join(', ');
          return `Website name contains invalid characters: ${invalidChars}`;
        }
        if (websites.includes(trimmedInput)) {
          return 'Website name already exists';
        }
        return true;
      },
    },
    {
      type: "text",
      name: "hostnames",
      message: "Enter the website host(s) or URL(s) (separate multiple with commas):",
      validate: (input) => {
        const trimmedInput = input.trim();
        if (trimmedInput === '') {
          return "At least one hostname or URL is required";
        }
        const hostnames = trimmedInput.split(',').map(hostname => hostname.trim());
        //we are not allowing ip address. for IF address we can use below regex
        // /^(?:(https?|wss?):\/\/)?((?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.?[A-Za-z]{2,63}|((25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)))(:\d{1,5})?$/;
        const validHostnamePattern = /^(?:(https?|wss?):\/\/)?(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.?[A-Za-z]{2,63}(:\d{1,5})?$/;
        const invalidHostnames = hostnames.filter(hostname => !validHostnamePattern.test(hostname));
        if (invalidHostnames.length > 0) {
          return `Invalid hostnames or URLs: ${invalidHostnames.join(', ')}`;
        }
        return true;
      },
    }
  ]);

  const { websiteName, hostnames } = createResponse;

  const hostnameList = hostnames.split(",").map((host) => host.trim())

  try {
    return await createWebsite(websiteName, hostnameList)

    // const response = await prompts({
    //   type: "toggle",
    //   name: "createTest",
    //   message: "Would you like to create a test for this website now?",
    //   initial: true,
    //   active: "yes",
    //   inactive: "no",
    // })
    // const { createTest } = response

    // if (createTest) {
    //   await promptAndCreateTest(websiteName)
    // }
  } catch (error) {
    console.error(chalk.red(`Failed to create website: ${error.message}`))
    return null;
  }
}

async function createNewTest(website) {
  const testList = await listTests(website);
  // const websites = await listWebsites()
  // if (websites.length === 0) {
  //   console.log(chalk.yellow("No websites found. Please create a new website first."))
  //   return
  // }

  // const response = await prompts({
  //   type: "select",
  //   name: "website",
  //   message: "Select a website to create a test for:",
  //   choices: [
  //     { title: "Create New Website", value: "Create New Website" },
  //     ...websites.map((website) => ({ title: website, value: website })),
  //     { title: "Go Back", value: "Go Back" },
  //     { title: "Exit", value: "Exit" },
  //   ],
  // })
  // const { website } = response

  // if (website === "Go Back") {
  //   return
  // } else if (website === "Exit") {
  //   process.exit(0)

  // } else if (website === "Create New Website") {
  //   await createNewWebsite()
  //   return
  // }
  const createResponse = await prompts([
    {
      type: 'text',
      name: 'testName',
      message: 'Enter the name of the new test:',
      validate: (input) => {
        const trimmedInput = input.trim();
        const validNamePattern = /^[a-zA-Z0-9\-_ ]+$/;
        if (trimmedInput === '') {
          return 'Test name cannot be empty';
        }
        if (!validNamePattern.test(trimmedInput)) {
          const invalidChars = [...new Set(trimmedInput.replace(/[a-zA-Z0-9\-_ ]/g, ''))].join(', ');
          return `Test name contains invalid characters: ${invalidChars}`;
        }
        if (testList.includes(trimmedInput)) {
          return 'Test name already exists';
        }
        return true;
      },
    },
    {
      type: 'select',
      name: 'testType',
      message: 'Select the test type:',
      choices: ['A/B', 'AA', 'Multi-touch', 'Patch'].map((type) => ({ title: type, value: type })),
    },
    {
      type: (prev) => (prev === 'Multi-touch' ? 'text' : null),
      name: 'touchPointName',
      message: 'Enter the touch point name:',
      validate: (input) => input.trim() !== '' || 'Touch point name cannot be empty',
    },
    {
      type: 'text',
      name: 'variationName',
      message: 'Enter the variation name:',
      validate: (input) => input.trim() !== '' || 'Variation name cannot be empty',
    },
  ]);

  const { testName, testType, touchPointName, variationName } = createResponse;

  if (!testName || !testType || (testType === 'Multi-touch' && !touchPointName) || !variationName) return null;

  try {
    console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`));
    return await createTest(website, testName, testType, touchPointName, variationName);
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`));
  }
}

async function createNewTouchPoint(website, testName) {
  const createResponse = await prompts([
    {
      type: 'text',
      name: 'touchPointName',
      message: 'Enter the name of the new touch point:',
      validate: (input) => input.trim() !== '' || 'Touch point name cannot be empty',
    },
  ]);

  const { touchPointName } = createResponse;

  try {
    console.log(chalk.green(`Touch point "${touchPointName}" created successfully for test "${testName}".`));
    return await createTouchPoint(website, testName, touchPointName);
  } catch (error) {
    console.error(chalk.red(`Failed to create touch point: ${error.message}`));
  }
}

async function createNewVariation(website, testName) {
  const createResponse = await prompts([
    {
      type: 'text',
      name: 'variationName',
      message: 'Enter the name of the new variation:',
      validate: (input) => input.trim() !== '' || 'Variation name cannot be empty',
    },
  ]);

  const { variationName } = createResponse;

  try {
    console.log(chalk.green(`Variation "${variationName}" created successfully for test "${testName}".`));
    return await createVariation(website, testName, variationName);
  } catch (error) {
    console.error(chalk.red(`Failed to create variation: ${error.message}`));
  }
}