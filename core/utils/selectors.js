import chalk from "chalk";
import kleur from "kleur";
import Table from "cli-table3";
import prompts from "prompts";

import {
  renameVariation,
  renameTouchPoint,
  removeVariation,
  removeTouchPoint,
} from "./creators.js";
import {
  listWebsites,
  listTests,
  listVariations,
  listTouchPointsAndVariations,
  getTestInfo,
  getVariationInfo,
  getTouchPointInfo,
  getVariationDir,
  listTouchPoints,
  getVariationDirForTouchPoint,
} from "./fileUtils.js";
import {
  createNewWebsiteWithPrompt,
  createNewTestWithPrompt,
  createNewTouchPointWithPrompt,
  createNewVariationWithPrompt,
} from "./creatorPrompts.js";
import { startTest } from "./startUtils.js";
import { buildVariation } from "./bundler.js";

export async function selectWebsite(goBack) {
  try {
    // List available websites
    const websites = await listWebsites();
    const options = [
      { title: chalk.green("🆕 Create New Website"), value: "create" },
      ...websites.map((w) => ({ title: chalk.cyan("🌐 " + w), value: w })),
      { title: chalk.magenta("🔙 Back"), value: "back" },
      { title: chalk.red("❌ Exit"), value: "exit" },
    ];

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (response.choice) {
      case "create":
        const websiteInfo = await createNewWebsiteWithPrompt();
        return websiteInfo ? websiteInfo.name : null;
      case "back":
        goBack();
        return null;
      case "exit":
        process.exit(0);
      default:
        return response.choice;
    }
  } catch (error) {
    console.log(chalk.red("Error selecting website:", error.message));
    return null;
  }
}

export async function selectTest(selectedWebsite, goBack) {
  const testTypeIcons = {
    "A/B": "🆎",
    AA: "📊",
    "Multi-touch": "🎯",
    Patch: "🩹",
  };
  try {
    const tests = await listTests(selectedWebsite);
    const testInfos = await Promise.all(
      tests.map((test) => getTestInfo(selectedWebsite, test))
    );
    const options = [
      { title: chalk.green("🆕 Create New Test"), value: "create" },
      ...tests.map((test, index) => {
        const testInfo = testInfos[index];
        const icon =
          testInfo && testInfo.type
            ? testTypeIcons[testInfo.type] || "🧪"
            : "🧪";
        return {
          title: chalk.cyan(`${icon} ${test}`),
          value: test,
        };
      }),
      { title: chalk.magenta("🔙 Back"), value: "back" },
      { title: chalk.red("❌ Exit"), value: "exit" },
    ];

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (response.choice) {
      case "create":
        const testInfo = await createNewTestWithPrompt(selectedWebsite);
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
    console.log(chalk.red("Error selecting test:", error.message));
    return null;
  }
}

export async function selectVariation(selectedWebsite, selectedTest, goBack) {
  try {
    const testInfo = await getTestInfo(selectedWebsite, selectedTest);
    const variations = await listVariations(selectedWebsite, selectedTest);

    const options = [
      { title: chalk.green("🆕 Create New Variation"), value: "create" },
      ...variations.map((v) => ({ title: chalk.green("🎭 " + v), value: v })),
      { title: chalk.magenta("🔙 Back"), value: "back" },
      { title: chalk.red("❌ Exit"), value: "exit" },
    ];

    if (testInfo.type === "Patch") {
      options.shift();
    }

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Select an option:",
      choices: options,
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (response.choice) {
      case "create":
        const variationInfoList = await createNewVariationWithPrompt(
          selectedWebsite,
          selectedTest
        );
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
    console.log(chalk.red("Error selecting variation:", error.message));
    return null;
  }
}

export async function selectTouchPointAndVariations(
  selectedWebsite,
  selectedTest,
  goBack
) {
  try {
    const touchPointsAndVariations = await listTouchPointsAndVariations(
      selectedWebsite,
      selectedTest
    );
    const options = [
      {
        title: chalk.green("🆕 Create New Touch Point"),
        value: "create-touch-point",
      },
    ];

    if (touchPointsAndVariations.some((item) => item.type === "touchPoint")) {
      options.push({
        title: chalk.green("🆕 Create New Variation"),
        value: "create-variation",
      });
    }

    options.push(
      ...touchPointsAndVariations.map((item) => ({
        title:
          chalk.cyan((item.type === "variation" ? "🎭 " : "📍 ") + item.name) +
          " (" +
          (item.type === "variation"
            ? kleur.blue(item.type)
            : kleur.magenta(item.type)) +
          ")",
        value: item.name + " (" + item.type + ")",
      })),
      { title: chalk.magenta("🔙 Back"), value: "back" },
      { title: chalk.red("❌ Exit"), value: "exit" }
    );

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (response.choice) {
      case "create-touch-point":
        const touchPointInfo = await createNewTouchPointWithPrompt(
          selectedWebsite,
          selectedTest
        );
        return touchPointInfo ? touchPointInfo.name : null;
      case "create-variation":
        const variationInfoList = await createNewVariationWithPrompt(
          selectedWebsite,
          selectedTest
        );
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
    console.log(chalk.red("Error selecting touch point:", error.message));
    return null;
  }
}

export async function selectVariationDetails(
  selectedWebsite,
  selectedTest,
  selectedVariation,
  goBack
) {
  try {
    const options = [
      { title: chalk.green("🚀 Start Variation"), value: "start" },
      { title: chalk.blueBright("📜 See Test Details"), value: "details" },
      { title: chalk.greenBright("📦 Build variation"), value: "build" },
      {
        title: chalk.magenta("📤 Copy Variation to Another Test"),
        value: "copy-to-another-test",
      },
      { title: chalk.yellow("✏️  Rename Variation"), value: "rename" },
      { title: chalk.red("🗑️  Remove Variation"), value: "remove" },
      { title: chalk.magenta("🔙 Back"), value: "back" },
      { title: chalk.red("❌ Exit"), value: "exit" },
    ];

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (response.choice) {
      case "start": {
        // Start variation
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        const testType = testInfo.type;
        startTest(selectedWebsite, selectedTest, selectedVariation, testType);
        break;
      }
      case "details":
        const variationInfo = await getVariationInfo(
          selectedWebsite,
          selectedTest,
          selectedVariation
        );
        if (variationInfo) {
          const formattedCreatedAt = new Date(
            variationInfo.createdAt
          ).toLocaleString();
          const formattedLastUpdated = new Date(
            variationInfo.lastUpdated
          ).toLocaleString();

          const table = new Table({
            head: ["Key", "Value"],
          });

          table.push(
            ["ID", variationInfo.id],
            ["Name", variationInfo.name],
            ["Created At", formattedCreatedAt],
            ["Last Updated", formattedLastUpdated]
          );

          console.log("Variation Details:");
          console.log(table.toString());
        } else {
          console.log(chalk.red("Failed to get variation details"));
        }
        return null;
      case "build": {
        // Build variation
        const variationDir = getVariationDir(
          selectedWebsite,
          selectedTest,
          selectedVariation
        );
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        if (testInfo.type !== "Multi-touch") {
          await buildVariation(variationDir);
        } else {
          const touchPoints = await listTouchPoints(
            selectedWebsite,
            selectedTest
          );
          await Promise.all(
            touchPoints.map(async (touchPoint) => {
              const variationDir = getVariationDirForTouchPoint(
                selectedWebsite,
                selectedTest,
                touchPoint,
                selectedVariation
              );
              await buildVariation(variationDir);
            })
          );
        }
        break;
      }
      case "remove":
        // Remove variation
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        if (testInfo.variations.length > 1) {
          const removeVariationResponse = await removeVariation(
            selectedWebsite,
            selectedTest,
            selectedVariation
          );
          if (removeVariationResponse) {
            console.log(
              chalk.green(
                `Variation "${selectedVariation}" removed successfully.`
              )
            );
          } else {
            console.error(chalk.red("Failed to remove variation"));
          }
        } else {
          console.log(
            kleur.yellow(
              "You need minimum 1 variation to run the test. You can not delete the only variation available."
            )
          );
        }
        break;
      case "rename":
        // Rename variation
        const renameResponse = await prompts({
          type: "text",
          name: "newName",
          message: "Enter the new name for the variation:",
          validate: (input) =>
            input.trim() !== "" || "Variation name cannot be empty",
        });

        const { newName } = renameResponse;

        try {
          const renameVariationResponse = await renameVariation(
            selectedWebsite,
            selectedTest,
            selectedVariation,
            newName
          );
          if (renameVariationResponse) {
            console.log(
              chalk.green(
                `Variation "${selectedVariation}" renamed to "${newName}" successfully.`
              )
            );
          } else {
            console.error(chalk.red("Failed to rename variation"));
          }
        } catch (error) {
          console.error(
            chalk.red(`Failed to rename variation: ${error.message}`)
          );
        }

        break;
      case "back":
        // Go back
        goBack();
        return null;
      case "exit":
        // Exit
        process.exit(0);
      default:
        break;
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to get variation details: ${error.message}`)
    );
  }
}

export async function selectTouchPointDetails(
  selectedWebsite,
  selectedTest,
  selectedTouchPoint,
  goBack
) {
  try {
    const options = [
      {
        title: chalk.blueBright("📜 See Touch Point Details"),
        value: "details",
      },
      {
        title: chalk.blueBright(
          "📦 Build all variations inside this Touch point"
        ),
        value: "build",
      },
      { title: chalk.yellow("✏️  Rename Touch Point"), value: "rename" },
      { title: chalk.red("🗑️  Remove Touch Point"), value: "remove" },
      { title: chalk.magenta("🔙 Back"), value: "back" },
      { title: chalk.red("❌ Exit"), value: "exit" },
    ];

    const response = await prompts({
      type: "autocomplete",
      name: "choice",
      message: "Select an option:",
      choices: options,
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (response.choice) {
      case "details":
        // See test details
        const touchPointInfo = await getTouchPointInfo(
          selectedWebsite,
          selectedTest,
          selectedTouchPoint
        );
        if (touchPointInfo) {
          const formattedCreatedAt = new Date(
            touchPointInfo.createdAt
          ).toLocaleString();
          const formattedLastUpdated = new Date(
            touchPointInfo.lastUpdated
          ).toLocaleString();

          const table = new Table({
            head: ["Key", "Value"],
          });

          table.push(
            ["ID", touchPointInfo.id],
            ["Name", touchPointInfo.name],
            ["Created At", formattedCreatedAt],
            ["Last Updated", formattedLastUpdated]
          );

          console.log("Touch Point Details:");
          console.log(table.toString());
        } else {
          console.log(chalk.red("Failed to get touch point details"));
        }
        break;
      case "build":
        // Build variations inside touch-point
        const variations = await listVariations(selectedWebsite, selectedTest);
        await Promise.all(
          variations.map(async (variation) => {
            const variationDir = getVariationDirForTouchPoint(
              selectedWebsite,
              selectedTest,
              selectedTouchPoint,
              variation
            );
            await buildVariation(variationDir);
          })
        );
      case "rename":
        // Rename touch point
        const renameResponse = await prompts({
          type: "text",
          name: "newName",
          message: "Enter the new name for the touch point:",
          validate: (input) =>
            input.trim() !== "" || "Touch point name cannot be empty",
        });

        const { newName } = renameResponse;

        try {
          const renameTouchPointResponse = await renameTouchPoint(
            selectedWebsite,
            selectedTest,
            selectedTouchPoint,
            newName
          );
          if (renameTouchPointResponse) {
            console.log(
              chalk.green(
                `Touch point "${selectedTouchPoint}" renamed to "${newName}" successfully.`
              )
            );
          } else {
            console.error(chalk.red("Failed to rename touch point"));
          }
        } catch (error) {
          console.error(
            chalk.red(`Failed to rename touch point: ${error.message}`)
          );
        }
        break;
      case "remove":
        // Remove touch point
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        if (testInfo.touchPoints.length > 1) {
          const removeTouchPointResponse = await removeTouchPoint(
            selectedWebsite,
            selectedTest,
            selectedTouchPoint
          );
          if (removeTouchPointResponse) {
            console.log(
              chalk.green(
                `Touch point "${selectedTouchPoint}" removed successfully.`
              )
            );
          } else {
            console.error(chalk.red("Failed to remove touch point"));
          }
        } else {
          console.log(
            kleur.yellow(
              "You need minimum 1 touch point to run the test. You can not delete the only touch point available."
            )
          );
        }
        break;
      case "back":
        // Go back
        goBack();
        return null;
      case "exit":
        // Exit
        process.exit(0);
      default:
        break;
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to get touch point details: ${error.message}`)
    );
  }
}

export async function selectMultipleWebsites(goBack) {
  const websites = await listWebsites();
  if (websites.length === 0) {
    console.log(
      kleur.yellow("No websites found. Please create a website first.")
    );
    return [];
  }

  const choices = [
    ...websites.map((website) => ({
      title: "🌐 " + chalk.cyan(website),
      value: website,
    })),
    { title: chalk.magenta("🔙 Back"), value: "back" },
    { title: chalk.red("❌ Exit"), value: "exit" },
  ];

  const { selectedWebsites } = await prompts({
    type: "autocompleteMultiselect",
    name: "selectedWebsites",
    message: "Select websites to run tests on:",
    choices: choices,
    hint: "Space to select, Enter to confirm",
    instructions: false,
    min: 1,
    suggest: (input, choices) =>
      Promise.resolve(
        choices.filter((choice) =>
          choice.title.toLowerCase().includes(input.toLowerCase())
        )
      ),
  });

  if (selectedWebsites.includes("exit")) {
    console.log(kleur.blue("See you soon!"));
    process.exit(0);
  } else if (selectedWebsites.includes("back")) {
    return goBack();
  }

  return selectedWebsites.filter(
    (website) => website !== "back" && website !== "exit"
  );
}

export async function selectMultipleTests(websites, goBack) {
  const testTypeIcons = {
    "A/B": "🆎",
    AA: "📊",
    "Multi-touch": "🎯",
    Patch: "🩹",
  };
  let allTests = [];
  for (const website of websites) {
    const tests = await listTests(website);
    allTests.push(...tests.map((test) => ({ website, test })));
  }

  // get test info for all tests
  const testInfos = await Promise.all(
    allTests.map(({ website, test }) => getTestInfo(website, test))
  );
  allTests = allTests.map((test, index) => {
    const testInfo = testInfos[index];
    const icon =
      testInfo && testInfo.type ? testTypeIcons[testInfo.type] || "🧪" : "🧪";
    return {
      website: test.website,
      test: test.test,
      icon,
    };
  });

  const choices = [
    ...allTests.map(({ website, test, icon }) => ({
      title: `${icon} ${website} - ${test}`,
      value: { website, test },
    })),
    { title: chalk.magenta("🔙 Back"), value: "back" },
    { title: chalk.red("❌ Exit"), value: "exit" },
  ];

  const { selectedTests } = await prompts({
    type: "autocompleteMultiselect",
    name: "selectedTests",
    message: "Select tests to run:",
    choices: choices,
    min: 1,
    hint: "Space to select, Enter to confirm",
    instructions: false,
    suggest: (input, choices) =>
      Promise.resolve(
        choices.filter((choice) =>
          choice.title.toLowerCase().includes(input.toLowerCase())
        )
      ),
  });

  if (selectedTests.includes("exit")) {
    console.log(kleur.blue("See you soon!"));
    process.exit(0);
  } else if (selectedTests.includes("back")) {
    return goBack();
  }

  return selectedTests.filter((test) => test !== "back" && test !== "exit");
}

export async function selectMultipleVariations(tests, goBack) {
  const testTypeIcons = {
    "A/B": "🆎",
    AA: "📊",
    "Multi-touch": "🎯",
    Patch: "🩹",
  };
  const allVariations = [];
  for (const { website, test } of tests) {
    const testInfo = await getTestInfo(website, test);
    allVariations.push(
      ...testInfo.variations.map((variation) => ({
        website,
        test,
        variation,
        testType: testInfo.type,
      }))
    );
  }

  const choices = [
    ...allVariations.map(({ website, test, variation, testType }) => ({
      title: `🎭 ${website} - ${test} - ${variation} (${testTypeIcons[testType] || "🧪"} ${testType})`,
      value: { website, test, variation, testType },
    })),
    { title: chalk.magenta("🔙 Back"), value: "back" },
    { title: chalk.red("❌ Exit"), value: "exit" },
  ];

  let lastOptionsState = [];
  const { selectedVariations } = await prompts({
    type: "autocompleteMultiselect",
    name: "selectedVariations",
    message: `Select variations to run: ${chalk.yellow("(You can not select multiple variations of the same test)")}`,
    choices: choices,
    min: 1,
    warn: null,
    hint: "Space to select, Enter to confirm",
    instructions: false,
    suggest: (input, choices) =>
      Promise.resolve(
        choices.filter((choice) =>
          choice.title.toLowerCase().includes(input.toLowerCase())
        )
      ),
    onRender() {
      if (
        !this.value ||
        this.value.length < 1 ||
        !this.value.some(
          (option) =>
            option.value &&
            option.value.website &&
            option.value.test &&
            option.value.variation &&
            option.value.testType
        )
      )
        return;

      if (lastOptionsState.length === 0) {
        lastOptionsState = JSON.parse(JSON.stringify(this.value));
      } else {
        const currentOptionsState = JSON.parse(JSON.stringify(this.value));

        if (lastOptionsState.length < 1 || currentOptionsState.length < 1)
          return;

        const lastModifiedOption = currentOptionsState.find((option) =>
          lastOptionsState.some(
            (prevOption) =>
              prevOption.value.website === option.value.website &&
              prevOption.value.test === option.value.test &&
              prevOption.value.variation === option.value.variation &&
              prevOption.value.testType === option.value.testType &&
              prevOption.selected !== option.selected
          )
        );

        if (lastModifiedOption?.selected !== true) {
          lastOptionsState = currentOptionsState;
          return;
        }

        const isMultipleVariationsSelected = currentOptionsState
          .filter((option) => option.selected)
          .some((option) => {
            return (
              currentOptionsState
                .filter((option) => option.selected)
                .filter(
                  (selectedOption) =>
                    selectedOption.value.website === option.value.website &&
                    selectedOption.value.test === option.value.test
                ).length > 1
            );
          });

        if (isMultipleVariationsSelected) {
          this.warn =
            "You can not select multiple variations of the same test.";
        }

        const selectedOptions = this.value.filter((option) => option?.selected);
        selectedOptions.forEach((selectedOption) => {
          const { website, test, variation } = selectedOption?.value;
          if (
            website === lastModifiedOption?.value?.website &&
            test === lastModifiedOption?.value?.test
          ) {
            if (variation !== lastModifiedOption?.value?.variation) {
              if (!selectedOption.selected) return;
              selectedOption.selected = false;
            }
          }
        });

        lastOptionsState = JSON.parse(JSON.stringify(this.value));
      }
    },
  });

  if (selectedVariations.includes("back")) {
    console.log(kleur.blue("See you soon!"));
    process.exit(0);
  } else if (selectedVariations.includes("exit")) {
    return goBack();
  }

  return selectedVariations.filter(
    (variation) => variation !== "back" && variation !== "exit"
  );
}
