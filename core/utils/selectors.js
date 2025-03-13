import chalk from "chalk"
import kleur from "kleur"
import Table from 'cli-table3';
import prompts from "prompts"

import { renameVariation, renameTouchPoint, removeVariation, removeTouchPoint } from "./creators.js"
import { listWebsites, listTests, listVariations, listTouchPointsAndVariations, getTestInfo, getVariationInfo, getTouchPointInfo } from "./fileUtils.js"
import { createNewWebsiteWithPrompt, createNewTestWithPrompt, createNewTouchPointWithPrompt, createNewVariationWithPrompt } from "./creatorPrompts.js"

export async function selectWebsite() {
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
                const websiteInfo = await createNewWebsiteWithPrompt();
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

export async function selectTest(selectedWebsite, goBack) {
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

export async function selectTouchPointDetails(selectedWebsite, selectedTest, selectedTouchPoint, goBack) {
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