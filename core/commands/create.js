import { Command } from "commander"
import prompts from "prompts"
import { createWebsite, createTest, createTouchPoint, createVariation } from "../utils/creators.js"
import { listWebsites, listTests, listOnlyMultiTouchTests, listAllTestExceptMultiTouch, listTouchPoints, listVariations, listTouchPointsAndVariations, getWebsiteInfo, getTestInfo, getTouchPointInfo, getTouchPointsVariationInfo, getVariationInfo } from "../utils/fileUtils.js"
import chalk from "chalk"
import kleur from "kleur"

// export async function listWebsites() 
// export async function listTests(website) 
// export async function listOnlyMultiTouchTests(website)
// export async function listAllTestExceptMultiTouch(website)
// export async function listTouchPoints(website, test) 
// export async function listVariations(website, test) 
// export async function getWebsiteInfo(website)
// export async function getTestInfo(website, test)
// export async function getTouchPointInfo(website, test, touchPoint) 
// export async function getTouchPointsVariationInfo(website, test, touchPoint, variation) 
// export async function getVariationInfo(website, test, variation) 

// export const createCommand = new Command("create").description("Create a new website or test").action(async () => {
//   let exit = false
//   while (!exit) {
//     const response = await prompts({
//       type: "select",
//       name: "choice",
//       message: "What would you like to do?",
//       choices: [
//         { title: "Create New Website", value: "Create New Website" },
//         { title: "Create New Test", value: "Create New Test" },
//         { title: "Create New TouchPoints", value: "Create New TouchPoints" },
//         { title: "Create New Variations", value: "Create New Variations" },
//         { title: "Go Back", value: "Go Back" },
//         { title: "Exit", value: "Exit" },
//       ],
//     })
//     const { choice } = response

//     switch (choice) {
//       case "Create New Website":
//         await createNewWebsite()
//         break
//       case "Create New Test":
//         await createNewTest()
//         break
//       case "Create New TouchPoints":
//         await createNewTouchPoint()
//         break
//       case "Create New Variations":
//         await createNewVariation()
//         break
//       case "Go Back":
//         // Continue the loop
//         break
//       case "Exit":
//         exit = true
//         console.log(chalk.blue("Goodbye!"))
//         break
//     }
//   }
// })

export const createCommand = new Command("create").description("Create a new website or test").action(create)

async function create() {
  const selectedWebsite = await selectWebsite();
  if (typeof selectedWebsite === 'string') {
    await handleTestSelection(selectedWebsite);
  }
}

async function handleTestSelection(selectedWebsite) {
  const selectedTest = await selectTest(selectedWebsite, create);
  console.log('Selected test:------', selectedTest);
  if (typeof selectedTest === 'string') {
    const testInfo = await getTestInfo(selectedWebsite, selectedTest);
    if (typeof testInfo === 'object' && testInfo !== null && 'type' in testInfo) {
      console.log('Selected test info:', testInfo.type);
      switch (testInfo.type) {
        case 'Multi-touch':
          const selectedTouchPoint = await selectTouchPointAndVariations(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
          if (selectedTouchPoint === 'back') {
            await handleTestSelection(selectedWebsite);
          } else {
            console.log('Selected touch point:', selectedTouchPoint);
          }
          break;
        case 'AA':
        case 'A/B':
          const selectedVariation = await selectVariation(selectedWebsite, selectedTest, () => handleTestSelection(selectedWebsite));
          if (selectedVariation === 'back') {
            await handleTestSelection(selectedWebsite);
          } else {
            console.log('Selected variation:', selectedVariation);
          }
          break;
        case 'patch':
          console.log('under development');
          break;
        default:
          console.error('Unknown test type');
      }
    } else {
      console.log('Invalid testInfo object');
    }
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
        // const websiteInfo = await createNewWebsite();
        // return websiteInfo ? websiteInfo.name : null;
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
    // Get variations for selected website and test
    const variations = await listVariations(selectedWebsite, selectedTest);
    const options = [
      { title: "Create New Variation", value: "create" },
      ...variations.map(v => ({ title: v.name, value: v })),
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
        const touchPointInfo = await createNewTouchPoint(selectedWebsite, selectedTest);
        return touchPointInfo ? touchPointInfo.name : null;
      case "create-variation":
        const variationInfo = await createNewVariation(selectedWebsite, selectedTest);
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

async function createNewWebsite() {
  const response = await prompts({
    type: "text",
    name: "websiteName",
    message: "Enter the name of the new website:",
    validate: (input) => input.trim() !== "" || "Website name cannot be empty",
  })
  const { websiteName } = response

  try {
    return await createWebsite(websiteName)

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
    console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`));
    return await createTest(website, testName, testType);
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

// async function createNewTouchPoint() {
//   try {
//     // List available websites
//     const websites = await listWebsites()
//     if (!websites.length) {
//       console.log(chalk.red('No websites found. Please create a website first.'))
//       return
//     }

//     // Select website
//     const selectedWebsite = await prompts({
//       type: 'select',
//       name: 'website',
//       message: 'Select a website:',
//       choices: websites.map(w => ({ title: w, value: w })),
//     })

//     // Get multi-touch tests for selected website
//     const multiTouchTests = await listOnlyMultiTouchTests(selectedWebsite)
//     if (!multiTouchTests.length) {
//       console.log(chalk.red('No multi-touch tests found. Please create a multi-touch test first.'))
//       return
//     }

//     // Select test
//     const selectedTest = await prompts({
//       type: 'select',
//       name: 'test',
//       message: 'Select a multi-touch test:',
//       choices: multiTouchTests.map(t => ({ title: t, value: t })),
//     })

//     // Get touch point name
//     const touchPointName = await prompts({
//       type: 'text',
//       name: 'name',
//       message: 'Enter touch point name:',
//       validate: value => value.trim() !== '' || 'Name is required',
//     })

//     // Create new touch point
//     await createTouchPoint(selectedWebsite, selectedTest, touchPointName)
//     console.log(chalk.green(`Touch point '${touchPointName}' created successfully!`))
//   } catch (error) {
//     console.log(chalk.red('Error creating touch point:', error.message))
//   }
// }

// async function createNewVariation() {
//   try {
//     // List available websites
//     const websites = await listWebsites()
//     if (!websites.length) {
//       console.log(chalk.red('No websites found. Please create a website first.'))
//       return
//     }

//     // Select website
//     const selectedWebsite = await prompts({
//       type: 'select',
//       name: 'website',
//       message: 'Select a website:',
//       choices: websites.map(w => ({ title: w, value: w })),
//     })

//     // Get all tests for selected website
//     const tests = await listTests(selectedWebsite.website)
//     if (!tests.length) {
//       console.log(chalk.red('No tests found. Please create a test first.'))
//       return
//     }

//     // Select test
//     const selectedTest = await prompts({
//       type: 'select',
//       name: 'test',
//       message: 'Select a test:',
//       choices: tests.map(t => ({ title: t, value: t })),
//     })

//     // Get variation name
//     const variationName = await prompts({
//       type: 'text',
//       name: 'name',
//       message: 'Enter variation name:',
//       validate: value => value.trim() !== '' || 'Name is required',
//     })

//     // Create new variation
//     await createVariation(selectedWebsite, selectedTest, variationName)
//     console.log(chalk.green(`Variation '${variationName}' created successfully!`))
//   } catch (error) {
//     console.log(chalk.red('Error creating variation:', error.message))
//   }
// }


// export { createCommand, createNewWebsite, createNewTest, createNewTouchPoint, createNewVariation }

// async function promptAndCreateTest(website) {
//   const tests = await listTests(website);
//   console.log(tests);

//   const response = await prompts({
//     type: 'select',
//     name: 'action',
//     message: 'Select an action:',
//     choices: [
//       { title: 'Create a test', value: 'create' },
//       ...tests.map((test) => ({ title: test, value: test })),
//       { title: 'Go back', value: 'back' },
//       { title: 'Exit', value: 'exit' }
//     ]
//   });

//   const { action } = response;

//   if (action === 'create') {
//     await handleCreateTest(website);
//   } else if (action === 'back') {
//     console.log('Going back...');
//   } else if (action === 'exit') {
//     console.log('Exiting...');
//   } else {
//     await handleSelectedTest(website, action);
//   }
// }

// async function handleCreateTest(website) {
//   const createResponse = await prompts([
//     {
//       type: 'text',
//       name: 'testName',
//       message: 'Enter the name of the new test:',
//       validate: (input) => input.trim() !== '' || 'Test name cannot be empty',
//     },
//     {
//       type: 'select',
//       name: 'testType',
//       message: 'Select the test type:',
//       choices: ['A/B', 'AA', 'Multi-touch', 'Patch'].map((type) => ({ title: type, value: type })),
//     },
//   ]);

//   const { testName, testType } = createResponse;

//   try {
//     await createTest(website, testName, testType);
//     console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`));
//   } catch (error) {
//     console.error(chalk.red(`Failed to create test: ${error.message}`));
//   }
// }

// async function handleSelectedTest(website, testName) {
//   const testInfo = await getTestInfo(website, testName);
//   console.log(testInfo);

//   if (testInfo.type === 'Multi-touch' && testInfo.touchPoints) {
//     await handleTouchPointActions(website, testName, testInfo);
//   } else {
//     await handleVariationActions(website, testName, testInfo);
//   }
// }

// async function handleTouchPointActions(website, testName, testInfo) {
//   const touchPointResponse = await prompts({
//     type: 'select',
//     name: 'touchPointAction',
//     message: 'Select a touch point action:',
//     choices: [
//       { title: 'Create a new touch point', value: 'createTouchPoint' },
//       ...testInfo.touchPoints.map((touchPoint) => ({ title: touchPoint, value: touchPoint })),
//       { title: 'Go back', value: 'back' },
//       { title: 'Exit', value: 'exit' }
//     ]
//   });

//   const { touchPointAction } = touchPointResponse;

//   if (touchPointAction === 'createTouchPoint') {
//     const newTouchPointResponse = await prompts({
//       type: 'text',
//       name: 'newTouchPoint',
//       message: 'Enter the name of the new touch point:',
//       validate: (input) => input.trim() !== '' || 'Touch point name cannot be empty',
//     });

//     const { newTouchPoint } = newTouchPointResponse;

//     try {
//       await createTouchPoint(website, testName, newTouchPoint);
//       console.log(chalk.green(`Touch point "${newTouchPoint}" created successfully for test "${testInfo.name}".`));
//     } catch (error) {
//       console.error(chalk.red(`Failed to create touch point: ${error.message}`));
//     }
//   } else if (touchPointAction === 'back') {
//     console.log('Going back...');
//   } else if (touchPointAction === 'exit') {
//     console.log('Exiting...');
//   } else {
//     await handleVariationActions(website, testName, testInfo);
//   }
// }

// async function handleVariationActions(website, testName, testInfo) {
//   const variationResponse = await prompts({
//     type: 'select',
//     name: 'variationAction',
//     message: 'Select a variation action:',
//     choices: [
//       { title: 'Create a new variation', value: 'createVariation' },
//       ...testInfo.variations.map((variation) => ({ title: variation, value: variation })),
//       { title: 'Go back', value: 'back' },
//       { title: 'Exit', value: 'exit' }
//     ]
//   });

//   const { variationAction } = variationResponse;

//   if (variationAction === 'createVariation') {
//     const newVariationResponse = await prompts({
//       type: 'text',
//       name: 'newVariation',
//       message: 'Enter the name of the new variation:',
//       validate: (input) => input.trim() !== '' || 'Variation name cannot be empty',
//     });

//     const { newVariation } = newVariationResponse;

//     try {
//       await createVariation(website, testName, newVariation);
//       console.log(chalk.green(`Variation "${newVariation}" created successfully for test "${testInfo.name}".`));
//     } catch (error) {
//       console.error(chalk.red(`Failed to create variation: ${error.message}`));
//     }
//   } else if (variationAction === 'back') {
//     console.log('Going back...');
//   } else if (variationAction === 'exit') {
//     console.log('Exiting...');
//   } else {
//     console.log(`Selected variation: ${variationAction}`);
//   }
// }