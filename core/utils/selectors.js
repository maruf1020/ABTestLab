import chalk from "chalk"
import kleur from "kleur"
import Table from 'cli-table3';
import prompts from "prompts"

import { renameVariation, renameTouchPoint, removeVariation, removeTouchPoint } from "./creators.js"
import { listWebsites, listTests, listVariations, listTouchPointsAndVariations, getTestInfo, getVariationInfo, getTouchPointInfo, getVariationDir, listTouchPoints, getVariationDirForTouchPoint } from "./fileUtils.js"
import { createNewWebsiteWithPrompt, createNewTestWithPrompt, createNewTouchPointWithPrompt, createNewVariationWithPrompt } from "./creatorPrompts.js"
import { startTest } from "./startUtils.js";
import { buildVariation } from "./bundler.js";

export async function selectWebsite(goBack) {
    try {
        // List available websites
        const websites = await listWebsites();
        const options = [
            { title: "Create New Website", value: "create" },
            ...websites.map(w => ({ title: w, value: w })),
            { title: chalk.magenta('🔙 Back'), value: "back" },
            { title: chalk.red('❌ Exit'), value: "exit" },
        ];

        const response = await prompts({
            type: "autocomplete",
            name: "choice",
            message: "Select an option:",
            choices: options,
            suggest: (input, choices) =>
                Promise.resolve(
                    choices.filter(choice =>
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
        console.log(chalk.red('Error selecting website:', error.message));
        return null;
    }
}

export async function selectTest(selectedWebsite, goBack) {
    try {
        // Get tests for selected website
        const tests = await listTests(selectedWebsite);
        const options = [
            { title: "Create New Test", value: "create" },
            ...tests.map(t => ({ title: t, value: t })),
            { title: chalk.magenta('🔙 Back'), value: "back" },
            { title: chalk.red('❌ Exit'), value: "exit" },
        ];

        const response = await prompts({
            type: "select",
            name: "choice",
            message: "Select an option:",
            choices: options,
            suggest: (input, choices) =>
                Promise.resolve(
                    choices.filter(choice =>
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
        console.log(chalk.red('Error selecting test:', error.message));
        return null;
    }
}

export async function selectVariation(selectedWebsite, selectedTest, goBack) {
    try {
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        const variations = await listVariations(selectedWebsite, selectedTest);

        const options = [
            { title: "Create New Variation", value: "create" },
            ...variations.map(v => ({ title: v.name, value: v })),
            { title: chalk.magenta('🔙 Back'), value: "back" },
            { title: chalk.red('❌ Exit'), value: "exit" },
        ];

        if (testInfo.type === 'Patch') {
            options.shift();
        }

        const response = await prompts({
            type: "select",
            name: "choice",
            message: "Select an option:",
            choices: options,
            suggest: (input, choices) =>
                Promise.resolve(
                    choices.filter(choice =>
                        choice.title.toLowerCase().includes(input.toLowerCase())
                    )
                ),
        });

        switch (response.choice) {
            case "create":
                const variationInfoList = await createNewVariationWithPrompt(selectedWebsite, selectedTest);
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

export async function selectTouchPointAndVariations(selectedWebsite, selectedTest, goBack) {
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
            { title: chalk.magenta('🔙 Back'), value: "back" },
            { title: chalk.red('❌ Exit'), value: "exit" },
        );

        const response = await prompts({
            type: "autocomplete",
            name: "choice",
            message: "Select an option:",
            choices: options,
            suggest: (input, choices) =>
                Promise.resolve(
                    choices.filter(choice =>
                        choice.title.toLowerCase().includes(input.toLowerCase())
                    )
                ),
        });

        switch (response.choice) {
            case "create-touch-point":
                const touchPointInfo = await createNewTouchPointWithPrompt(selectedWebsite, selectedTest);
                return touchPointInfo ? touchPointInfo.name : null;
            case "create-variation":
                const variationInfoList = await createNewVariationWithPrompt(selectedWebsite, selectedTest);
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

export async function selectVariationDetails(selectedWebsite, selectedTest, selectedVariation, goBack) {
    try {
        const options = [
            { title: "Start Variation", value: "start" },
            { title: "See Test Details", value: "details" },
            { title: "Build this Variation to all Touch Points", value: "build" },
            { title: "Remove Variation", value: "remove" },
            { title: "Rename Variation", value: "rename" },
            { title: "Copy Variation to Another Test", value: "copy-to-another-test" },
            { title: chalk.magenta('🔙 Back'), value: "back" },
            { title: chalk.red('❌ Exit'), value: "exit" },
        ];

        const response = await prompts({
            type: "select",
            name: "choice",
            message: "Select an option:",
            choices: options,
            suggest: (input, choices) =>
                Promise.resolve(
                    choices.filter(choice =>
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
            case "build": {
                // Build variation
                const variationDir = getVariationDir(selectedWebsite, selectedTest, selectedVariation);
                const testInfo = await getTestInfo(selectedWebsite, selectedTest);
                if (testInfo.type !== 'Multi-touch') {
                    await buildVariation(variationDir);
                } else {
                    const touchPoints = await listTouchPoints(selectedWebsite, selectedTest);
                    await Promise.all(touchPoints.map(async (touchPoint) => {
                        const variationDir = getVariationDirForTouchPoint(selectedWebsite, selectedTest, touchPoint, selectedVariation);
                        await buildVariation(variationDir);
                    }));
                }
                break;
            }
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

export async function selectTouchPointDetails(selectedWebsite, selectedTest, selectedTouchPoint, goBack) {
    try {
        const options = [
            { title: "See Touch Point Details", value: "details" },
            // { title: "Build this Variation to all Touch Points", value: "build" },
            { title: "Build all variations inside this Touch point", value: "build" },
            { title: "Rename Touch Point", value: "rename" },
            { title: "Remove Touch Point", value: "remove" },
            { title: chalk.magenta('🔙 Back'), value: "back" },
            { title: chalk.red('❌ Exit'), value: "exit" },
        ];

        const response = await prompts({
            type: "select",
            name: "choice",
            message: "Select an option:",
            choices: options,
            suggest: (input, choices) =>
                Promise.resolve(
                    choices.filter(choice =>
                        choice.title.toLowerCase().includes(input.toLowerCase())
                    )
                ),
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
            case "build":
                // Build variations inside touch-point
                const variations = await listVariations(selectedWebsite, selectedTest);
                await Promise.all(variations.map(async (variation) => {
                    const variationDir = getVariationDirForTouchPoint(selectedWebsite, selectedTest, selectedTouchPoint, variation);
                    await buildVariation(variationDir);
                }));
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

export async function selectMultipleWebsites(goBack) {
    const websites = await listWebsites();
    if (websites.length === 0) {
        console.log(kleur.yellow("No websites found. Please create a website first."));
        return [];
    }

    const choices = [
        ...websites.map((website) => ({ title: website, value: website })),
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    const { selectedWebsites } = await prompts({
        type: "autocompleteMultiselect",
        name: "selectedWebsites",
        message: "Select websites to run tests on:",
        choices: choices,
        hint: 'Space to select, Enter to confirm',
        instructions: false,
        min: 1,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
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

    return selectedWebsites.filter((website) => website !== "back" && website !== "exit");
}

export async function selectMultipleTests(websites, goBack) {
    const allTests = [];
    for (const website of websites) {
        const tests = await listTests(website);
        allTests.push(...tests.map((test) => ({ website, test })));
    }

    const choices = [
        ...allTests.map(({ website, test }) => ({ title: `${website} - ${test}`, value: { website, test } })),
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    const { selectedTests } = await prompts({
        type: "autocompleteMultiselect",
        name: "selectedTests",
        message: "Select tests to run:",
        choices: choices,
        min: 1,
        hint: 'Space to select, Enter to confirm',
        instructions: false,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
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
            title: `${website} - ${test} - ${variation} (${testType})`,
            value: { website, test, variation, testType },
        })),
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    const { selectedVariations } = await prompts({
        type: "autocompleteMultiselect",
        name: "selectedVariations",
        message: "Select variations to run:",
        choices: choices,
        min: 1,
        hint: 'Space to select, Enter to confirm',
        instructions: false,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (selectedVariations.includes("back")) {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    } else if (selectedVariations.includes("exit")) {
        return goBack();
    }

    return selectedVariations.filter((variation) => variation !== "back" && variation !== "exit");
}