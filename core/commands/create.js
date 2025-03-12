import { Command } from "commander"
import prompts from "prompts"
import { createWebsite, createTest, createTouchPoint, createVariation, renameVariation, renameTouchPoint, removeVariation, removeTouchPoint } from "../utils/creators.js"
import { listWebsites, listTests, listTouchPoints, listVariations, listTouchPointsAndVariations, getTestInfo, getVariationInfo, getTouchPointInfo } from "../utils/fileUtils.js"
import chalk from "chalk"
import kleur from "kleur"
import Table from 'cli-table3';

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
    await handleTestDetails(selectedWebsite, selectedTest);
  }
}

async function handleTestDetails(selectedWebsite, selectedTest) {
  const testInfo = await getTestInfo(selectedWebsite, selectedTest);
  if (typeof testInfo === 'object' && testInfo !== null && 'type' in testInfo) {
    switch (testInfo.type) {
      case 'Multi-touch':
        const selectedTouchPoint = await selectTouchPointAndVariations(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
        if (typeof selectedTouchPoint === 'string') {
          if (selectedTouchPoint.includes(' (variation)')) {
            const variationName = selectedTouchPoint.replace(' (variation)', '');
            const variationDetails = await selectVariationDetails(selectedWebsite, selectedTest, variationName, () => handleTestDetails(selectedWebsite, selectedTest));
            if (typeof variationDetails === 'string') {
              console.log('Variation Details:', variationDetails);
            }
          } else if (selectedTouchPoint.includes(' (touchPoint)')) {
            const touchPointName = selectedTouchPoint.replace(' (touchPoint)', '');
            const touchPointDetails = await selectTouchPointDetails(selectedWebsite, selectedTest, touchPointName, () => handleTestDetails(selectedWebsite, selectedTest));
            if (typeof touchPointDetails === 'string') {
              console.log('TouchPoint Details:', touchPointDetails);
            }
          }
        }
        break;
      case 'AA':
      case 'A/B':
      case 'Patch':
        const selectedVariation = await selectVariation(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
        if (typeof selectedVariation === 'string') {
          const variationDetails = await selectVariationDetails(selectedWebsite, selectedTest, selectedVariation, () => handleTestDetails(selectedWebsite, selectedTest));
          if (typeof variationDetails === 'string') {
            console.log('Variation Details:', variationDetails);
          }
        }
        break;
      default:
        console.error('Unknown test type');
    }
  } else {
    console.log('Invalid testInfo object');
  }
}

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
        const variationInfoList = await createNewVariation(selectedWebsite, selectedTest);
        const variationInfo = variationInfoList[0];
        return variationInfo ? variationInfo.name : null;
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
        const touchPointInfo = await createNewTouchPoint(selectedWebsite, selectedTest);
        return touchPointInfo ? touchPointInfo.name : null;
      case "create-variation":
        const variationInfoList = await createNewVariation(selectedWebsite, selectedTest);
        const variationInfo = variationInfoList[0];
        return variationInfo ? variationInfo.name : null;
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
        const variationInfo = await getVariationInfo(selectedWebsite, selectedTest, selectedVariation);
        if (variationInfo) {
          const formattedCreatedAt = new Date(variationInfo.createdAt).toLocaleString();
          const formattedLastUpdated = new Date(variationInfo.lastUpdated).toLocaleString();

          const table = new Table({
            head: ['Key', 'Value']
          });

          table.push(
            ['ID', variationInfo.id],
            ['Name', variationInfo.name],
            ['Created At', formattedCreatedAt],
            ['Last Updated', formattedLastUpdated]
          );

          console.log('Variation Details:');
          console.log(table.toString());
        } else {
          console.log(chalk.red('Failed to get variation details'));
        }
        return null;
      case "build":
        // Build variation
        console.log(kleur.yellow("Under development"));
        break;
      case "remove":
        // Remove variation
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        if (testInfo.variations.length > 1) {
          const removeVariationResponse = await removeVariation(selectedWebsite, selectedTest, selectedVariation);
          if (removeVariationResponse) {
            console.log(chalk.green(`Variation "${selectedVariation}" removed successfully.`));
          } else {
            console.error(chalk.red('Failed to remove variation'));
          }
        } else {
          console.log(kleur.yellow("You need minimum 1 variation to run the test. You can not delete the only variation available."));
        }
        break;
      case "rename":
        // Rename variation
        const renameResponse = await prompts({
          type: 'text',
          name: 'newName',
          message: 'Enter the new name for the variation:',
          validate: (input) => input.trim() !== '' || 'Variation name cannot be empty',
        });

        const { newName } = renameResponse;

        try {
          const renameVariationResponse = await renameVariation(selectedWebsite, selectedTest, selectedVariation, newName);
          if (renameVariationResponse) {
            console.log(chalk.green(`Variation "${selectedVariation}" renamed to "${newName}" successfully.`));
          } else {
            console.error(chalk.red('Failed to rename variation'));
          }
        } catch (error) {
          console.error(chalk.red(`Failed to rename variation: ${error.message}`));
        }

        break;
      case "back":
        // Go back
        goBack()
        return null;
      case "exit":
        // Exit
        process.exit(0);
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
      { title: "See Touch Point Details", value: "details" },
      { title: "Rename Touch Point", value: "rename" },
      { title: "Remove Touch Point", value: "remove" },
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
        const touchPointInfo = await getTouchPointInfo(selectedWebsite, selectedTest, selectedTouchPoint);
        if (touchPointInfo) {
          const formattedCreatedAt = new Date(touchPointInfo.createdAt).toLocaleString();
          const formattedLastUpdated = new Date(touchPointInfo.lastUpdated).toLocaleString();

          const table = new Table({
            head: ['Key', 'Value']
          });

          table.push(
            ['ID', touchPointInfo.id],
            ['Name', touchPointInfo.name],
            ['Created At', formattedCreatedAt],
            ['Last Updated', formattedLastUpdated]
          );

          console.log('Touch Point Details:');
          console.log(table.toString());
        } else {
          console.log(chalk.red('Failed to get touch point details'));
        }
        break;
      case "rename":
        // Rename touch point
        const renameResponse = await prompts({
          type: 'text',
          name: 'newName',
          message: 'Enter the new name for the touch point:',
          validate: (input) => input.trim() !== '' || 'Touch point name cannot be empty',
        });

        const { newName } = renameResponse;

        try {
          const renameTouchPointResponse = await renameTouchPoint(selectedWebsite, selectedTest, selectedTouchPoint, newName);
          if (renameTouchPointResponse) {
            console.log(chalk.green(`Touch point "${selectedTouchPoint}" renamed to "${newName}" successfully.`));
          } else {
            console.error(chalk.red('Failed to rename touch point'));
          }
        } catch (error) {
          console.error(chalk.red(`Failed to rename touch point: ${error.message}`));
        }
        break;
      case "remove":
        // Remove touch point
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        if (testInfo.touchPoints.length > 1) {
          const removeTouchPointResponse = await removeTouchPoint(selectedWebsite, selectedTest, selectedTouchPoint);
          if (removeTouchPointResponse) {
            console.log(chalk.green(`Touch point "${selectedTouchPoint}" removed successfully.`));
          } else {
            console.error(chalk.red('Failed to remove touch point'));
          }
        } else {
          console.log(kleur.yellow("You need minimum 1 touch point to run the test. You can not delete the only touch point available."));
        }
        break;
      case "back":
        // Go back
        goBack()
        return null;
      case "exit":
        // Exit
        process.exit(0);
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
  } catch (error) {
    console.error(chalk.red(`Failed to create website: ${error.message}`))
    return null;
  }
}

async function createNewTest(website) {
  const testList = await listTests(website);
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
    return await createTest(website, testName, testType, touchPointName, variationName);
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`));
  }
}

async function createNewTouchPoint(website, testName) {
  const touchPointList = await listTouchPoints(website, testName);
  const createResponse = await prompts([
    {
      type: 'text',
      name: 'touchPointName',
      message: 'Enter the name of the new touch point:',
      validate: (input) => {
        const trimmedInput = input.trim();
        if (touchPointList.includes(trimmedInput)) {
          return 'Touch point name already exists';
        }
        return trimmedInput !== '' || 'Touch point name cannot be empty';
      },
    }
  ]);

  const { touchPointName } = createResponse;

  try {
    return await createTouchPoint(website, testName, touchPointName);
  } catch (error) {
    console.error(chalk.red(`Failed to create touch point: ${error.message}`));
  }
}

async function createNewVariation(website, testName) {
  const testInfo = await getTestInfo(website, testName);
  const createResponse = await prompts([
    {
      type: 'text',
      name: 'variationName',
      message: 'Enter the name of the new variation:',
      validate: (input) => {
        const trimmedInput = input.trim();
        if (testInfo.variations.some(v => v.name === trimmedInput)) {
          return 'Variation name already exists';
        }
        return trimmedInput !== '' || 'Variation name cannot be empty';
      },
    },
  ]);

  const { variationName } = createResponse;

  try {
    return await createVariation(website, testName, variationName);
  } catch (error) {
    console.error(chalk.red(`Failed to create variation: ${error.message}`));
  }
}