import fs from "fs-extra"
import path from "path"
import Table from "cli-table3"
import debug from "debug"
import kleur from "kleur"
import chalk from "chalk"
import prompts from "prompts"

import { ROOT_DIR } from "../global/config.js"
import { listWebsites, listTests } from "./fileUtils.js"
import { startTestServer } from "../server/testServer.js"
import { updateHistory } from "./historyUtils.js"
import { selectTest, selectVariation } from "./selectors.js"

const log = debug("ab-testing-cli:start")

export async function handleLatestTest(lastTest, goBack) {
    const isGroupTest = lastTest.tests.length > 1;
    const choices = [
        { title: "Run Latest test", value: "run" },
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    if (!isGroupTest) {
        choices.splice(1, 0, { title: "Change variation", value: "changeVariation" });
        choices.splice(2, 0, { title: "Change test", value: "changeTest" });
    }

    const { action } = await prompts({
        type: "autocomplete",
        name: "action",
        message: "What would you like to do with the latest test?",
        choices: choices,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    const testData = lastTest.tests[0]

    switch (action) {
        case "run":
            if (lastTest.tests.length > 1) {
                await startMultipleTest(lastTest.tests.map((test) => ({
                    website: test.websiteName,
                    test: test.testName,
                    variation: test.variationName,
                    testType: test.testType
                })))
            } else {
                await startTest(testData.websiteName, testData.testName, testData.variationName, testData.testType)
            }
            break
        case "changeVariation":
            const variationName = await selectVariation(testData.websiteName, testData.testName, () => handleLatestTest(lastTest, goBack))
            if (!variationName) return null;
            return await startTest(testData.websiteName, testData.testName, variationName, testData.testType)
        case "changeTest":
            // await changeTest(testData.websiteName, () => handleLatestTest(lastTest, goBack))
            // export async function selectTest(selectedWebsite, goBack)
            // export async function selectVariation(selectedWebsite, selectedTest, goBack)
            const selectedTest = await selectTest(testData.websiteName, () => handleLatestTest(lastTest, goBack));
            if (!selectedTest) return null;
            const selectedVariation = await selectVariation(testData.websiteName, selectedTest, () => handleLatestTest(lastTest, goBack));
            if (!selectedVariation) return null;
            return await startTest(testData.websiteName, selectedTest, selectedVariation, testData.testType)
        case "back":
            return goBack()
        case "exit":
            console.log(kleur.blue("See you soon!"))
            process.exit(0)

    }

}

export async function runSingleTest(options, goBack) {
    const websitesPath = path.join(ROOT_DIR)

    if (!fs.existsSync(websitesPath)) {
        console.log(kleur.yellow("No websites directory found. You need to create a website first."))
        return
    }

    let website = options.website
    let test = options.test
    const websites = await listWebsites()

    if (websites.length === 0) {
        console.log(kleur.yellow("No websites found. Please create a website first."))
        return
    }

    if (!website) {
        const websiteResponse = await prompts({
            type: "autocomplete",
            name: "website",
            message: "Search & select a website:",
            choices: websites.map((w) => ({ title: w, value: w })),
            suggest: (input, choices) => {
                return Promise.resolve(choices.filter((choice) => choice.title.toLowerCase().includes(input.toLowerCase())))
            },
        })
        website = websiteResponse.website
    }

    const tests = await listTests(website)

    if (tests.length === 0) {
        console.log(kleur.yellow(`No tests found for website "${website}". Please create a test first.`))
        return
    }

    if (!test) {
        const testResponse = await prompts({
            type: "autocomplete",
            name: "test",
            message: "Search & select a test:",
            choices: tests.map((t) => ({ title: t, value: t })),
            suggest: (input, choices) => {
                return Promise.resolve(choices.filter((choice) => choice.title.toLowerCase().includes(input.toLowerCase())))
            },
        })
        test = testResponse.test
    }

    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    const variationResponse = await prompts({
        type: "autocomplete",
        name: "variation",
        message: "Select a variation to run:",
        choices: testInfo.variations.map((v) => ({ title: v, value: v })),
    })

    await startTest(website, test, variationResponse.variation, testInfo.type)
}

export async function viewTestHistory(history, viewType, goBack) {
    // Filter history based on viewType
    const filteredHistory = viewType === "groupTest"
        ? history.filter(entry => entry.tests.length > 1)
        : history;

    const hasMultiTouchTest = filteredHistory.some((entry) => entry.tests.some((test) => test.testType === "Multi-touch"));
    const hasGroupTest = filteredHistory.some((entry) => entry.tests.length > 1);

    const tableHeaders = [];
    const columnWidths = [];

    if (hasGroupTest) {
        tableHeaders.push(kleur.green("Group Test"));
        columnWidths.push(14);
    }

    tableHeaders.push(
        kleur.green("Test type"),
        kleur.green("Website Name"),
        kleur.green("Test Name")
    );
    columnWidths.push(14, 14, 14);

    if (hasMultiTouchTest) {
        tableHeaders.push(kleur.green("Touch-point Name"));
        columnWidths.push(18);
    }

    tableHeaders.push(
        kleur.green("Variation Name"),
        kleur.green("Last Run")
    );
    columnWidths.push(16, 24);

    const table = new Table({
        head: tableHeaders,
        colWidths: columnWidths,
    });

    for (const entry of filteredHistory) {
        const groupTestIndicator = entry.tests.length > 1 ? "YES" : "NO";
        let isFirstTestInGroup = true;

        for (const test of entry.tests) {
            if (test.testType === "Multi-touch") {
                const testDir = path.join(ROOT_DIR, test.websiteName, test.testName);
                const testInfo = await fs.readJson(path.join(testDir, "info.json"));
                const touchPoints = testInfo.touchPoints || [];

                touchPoints.forEach((touchPoint, index) => {
                    const row = [];

                    if (hasGroupTest) {
                        row.push(isFirstTestInGroup ? groupTestIndicator : "");
                    }

                    row.push(
                        index === 0 ? test.testType : "",
                        index === 0 ? test.websiteName : "",
                        index === 0 ? test.testName : "",
                        touchPoint,
                        test.variationName,
                        index === 0 ? new Date(entry.lastRun).toLocaleString() : ""
                    );

                    table.push(row);
                    isFirstTestInGroup = false;
                });
            } else {
                const row = [];

                if (hasGroupTest) {
                    row.push(isFirstTestInGroup ? groupTestIndicator : "");
                }

                row.push(
                    test.testType,
                    test.websiteName,
                    test.testName
                );

                if (hasMultiTouchTest) {
                    row.push("-");
                }

                row.push(
                    test.variationName,
                    new Date(entry.lastRun).toLocaleString()
                );

                table.push(row);
                isFirstTestInGroup = false;
            }
        }
    }

    console.log(table.toString());

    // Add "back" and "exit" options at the end
    const menuOptions = [
        {
            title: chalk.magenta('🔙 Back'),
            value: { action: "back" },
        },
        {
            title: chalk.red('❌ Exit'),
            value: { action: "exit" },
        },
    ]

    const choices = filteredHistory.map((entry, index) => {
        if (entry.tests.length > 1) {
            const groupTitle = entry.tests.map((test, i) =>
                `${i === 0 ? "┌" : i === (entry.tests.length - 1) ? "    └" : i === 1 ? "    │" : "    │"} ${test.websiteName} - ${test.testName} - ${test.variationName} (${test.testType})`
            ).join('\n');
            return {
                title: groupTitle,
                value: { entryIndex: index, isGroup: true },
            };
        } else {
            const test = entry.tests[0];
            return {
                title: `${test.websiteName} - ${test.testName} - ${test.variationName} (${test.testType})`,
                value: { entryIndex: index, testIndex: 0, isGroup: false },
            };
        }
    });

    const allChoices = [...choices, ...menuOptions];

    const { selectedTest } = await prompts({
        type: "autocomplete",
        name: "selectedTest",
        message: "Select a test to run:",
        choices: allChoices,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (selectedTest.action) {
        if (selectedTest.action === "back") {
            // Show previous menu
            return goBack();
        } else if (selectedTest.action === "exit") {
            // Exit the command
            console.log(kleur.blue("See you soon!"));
            process.exit(0);
        }
    } else {
        const selectedEntry = history[selectedTest.entryIndex];
        if (selectedTest.isGroup) {
            startMultipleTest(selectedEntry.tests.map((test) => ({
                website: test.websiteName,
                test: test.testName,
                variation: test.variationName,
                testType: test.testType
            })));
        } else {
            const selectedTestData = selectedEntry.tests[selectedTest.testIndex];
            await startTest(
                selectedTestData.websiteName,
                selectedTestData.testName,
                selectedTestData.variationName,
                selectedTestData.testType,
            );
        }
    }
}

export async function groupTestMenu(history, goBack) {
    const choices = [
        { title: "Create Group Test", value: "create" },
        { title: "Create From History", value: "history" },
        { title: "Run Group Test From History", value: "runHistory" },
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ]

    const { action } = await prompts({
        type: "select",
        name: "action",
        message: "What would you like to do with group tests?",
        choices: choices,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    })

    switch (action) {
        case "create":
            await runMultipleTests(() => groupTestMenu(history), goBack)
            return
        case "history":
            await runGroupFromHistory(history)
            return
        case "runHistory":
            await viewTestHistory(history, "groupTest", () => groupTestMenu(history), goBack)
            return
        case "back":
            return goBack()
        case "exit":
            console.log(kleur.blue("See you soon!"))
            process.exit(0)
    }
}

async function changeVariation(website, test, testType, goBack) {
    const testDir = path.join(ROOT_DIR, website, test);
    const testInfo = await fs.readJson(path.join(testDir, "info.json"));

    const choices = [
        ...testInfo.variations.map((v) => ({ title: v, value: v })),
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    const { variation } = await prompts({
        type: "select",
        name: "variation",
        message: "Select a new variation to run:",
        choices: choices,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (variation === "back") {
        return goBack();
    } else if (variation === "exit") {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    } else {
        await startTest(website, test, variation, testType);
    }
}

async function changeTest(website, goBack) {
    const tests = await listTests(website);

    const testChoices = [
        ...tests.map((t) => ({ title: t, value: t })),
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    const { test } = await prompts({
        type: "autocomplete",
        name: "test",
        message: "Search & select a new test:",
        choices: testChoices,
        suggest: (input, choices) => {
            return Promise.resolve(choices.filter((choice) => choice.title.toLowerCase().includes(input.toLowerCase())));
        },
    });

    if (test === "back") {
        return goBack();
    } else if (test === "exit") {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    }

    const testDir = path.join(ROOT_DIR, website, test);
    const testInfo = await fs.readJson(path.join(testDir, "info.json"));

    const variationChoices = [
        ...testInfo.variations.map((v) => ({ title: v, value: v })),
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    const { variation } = await prompts({
        type: "autocomplete",
        name: "variation",
        message: "Select a variation to run:",
        choices: variationChoices,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (variation === "back") {
        return goBack();
    } else if (variation === "exit") {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    } else {
        await startTest(website, test, variation, testInfo.type);
    }
}

async function runGroupFromHistory(history) {
    // Filter history to show only single tests
    const singleTestHistory = history.filter(entry => entry.tests.length === 1)

    if (singleTestHistory.length === 0) {
        console.log(kleur.yellow("No single tests found in history."))
        return
    }

    const choices = singleTestHistory.map((entry, index) => ({
        title: `${index + 1}. ${entry.tests[0].websiteName} - ${entry.tests[0].testName} - ${entry.tests[0].variationName}`,
        value: entry,
    }))

    const { selectedTests } = await prompts({
        type: "autocompleteMultiselect",
        name: "selectedTests",
        message: "Select tests to add to your group:",
        choices: choices,
        min: 1,
    })

    // Create a group of selected tests
    const selectedVariations = selectedTests.flatMap(entry => ({
        website: entry.tests[0].websiteName,
        test: entry.tests[0].testName,
        variation: entry.tests[0].variationName,
        testType: entry.tests[0].testType,
    }))

    // Run the selected group
    await startMultipleTest(selectedVariations)
}

async function runMultipleTests(goBack) {
    const selectedWebsites = await selectMultipleWebsites(goBack)
    if (selectedWebsites.length === 0) {
        console.log(kleur.yellow("No websites selected. Returning to main menu."))
        return
    }

    const selectedTests = await selectMultipleTests(selectedWebsites, goBack)
    if (selectedTests.length === 0) {
        console.log(kleur.yellow("No tests selected. Returning to main menu."))
        return
    }

    const selectedVariations = await selectMultipleVariations(selectedTests, goBack)
    if (selectedVariations.length === 0) {
        console.log(kleur.yellow("No variations selected. Returning to main menu."))
        return
    }

    await startMultipleTest(selectedVariations)
}

async function selectMultipleWebsites(goBack) {
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
        min: 1,
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (selectedWebsites.includes("back")) {
        return goBack();
    } else if (selectedWebsites.includes("exit")) {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    }

    return selectedWebsites.filter((website) => website !== "back" && website !== "exit");
}

async function selectMultipleTests(websites, goBack) {
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
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (selectedTests.includes("back")) {
        return goBack();
    } else if (selectedTests.includes("exit")) {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    }

    return selectedTests.filter((test) => test !== "back" && test !== "exit");
}

async function selectMultipleVariations(tests, goBack) {
    const allVariations = [];
    for (const { website, test } of tests) {
        const testDir = path.join(ROOT_DIR, website, test);
        const testInfo = await fs.readJson(path.join(testDir, "info.json"));
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
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase())
                )
            ),
    });

    if (selectedVariations.includes("back")) {
        return goBack();
    } else if (selectedVariations.includes("exit")) {
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    }

    return selectedVariations.filter((variation) => variation !== "back" && variation !== "exit");
}

async function startTest(website, test, variation, testType) {
    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    const tableHeaders = [
        kleur.green("Test type"),
        kleur.green("Website Name"),
        kleur.green("Test Name"),
        kleur.green("Variation Name"),
    ]
    const columnWidths = [14, 14, 14, 16]

    if (testType === "Multi-touch") {
        tableHeaders.splice(3, 0, kleur.green("Touch-point Name"))
        columnWidths.splice(3, 0, 18)
    }

    const table = new Table({
        head: tableHeaders,
        colWidths: columnWidths,
    })

    if (testType === "Multi-touch") {
        const touchPoints = testInfo.touchPoints || []
        touchPoints.forEach((touchPoint, index) => {
            if (index === 0) {
                table.push([testType, website, test, touchPoint, variation])
            } else {
                table.push(["", "", "", touchPoint, variation])
            }
        })
    } else {
        table.push([testType, website, test, variation])
    }

    console.log(table.toString())

    console.log(kleur.green(`Starting test "${test}" for website "${website}" with variation "${variation}"...`))
    log(`Test directory: ${testDir}`)
    log(`Active variation: ${variation}`)

    await startTestServer([{ website, test, variation, testType }])
    await updateHistory([{ website, test, variation, testType }])
}

async function startMultipleTest(selectedVariations) {
    const testDirList = selectedVariations.map((v) => path.join(ROOT_DIR, v.website, v.test))
    const testInfoList = await Promise.all(testDirList.map((testDir) => fs.readJson(path.join(testDir, "info.json"))))

    const tableHeaders = [
        kleur.green("Test type"),
        kleur.green("Website Name"),
        kleur.green("Test Name"),
        kleur.green("Variation Name"),
    ]
    const columnWidths = [14, 14, 14, 16]

    if (selectedVariations.some((v) => v.testType === "Multi-touch")) {
        tableHeaders.splice(3, 0, kleur.green("Touch-point Name"))
        columnWidths.splice(3, 0, 18)
    }

    const table = new Table({
        head: tableHeaders,
        colWidths: columnWidths,
    })

    selectedVariations.forEach((v) => {
        if (v.testType === "Multi-touch") {
            const touchPoints = testInfoList.find((t) => t.name === v.test).touchPoints || []
            touchPoints.forEach((touchPoint, index) => {
                if (index === 0) {
                    table.push([v.testType, v.website, v.test, touchPoint, v.variation])
                } else {
                    table.push(["", "", "", touchPoint, v.variation])
                }
            })
        } else {
            table.push([v.testType, v.website, v.test, "-", v.variation])
        }
    })

    console.log(table.toString())

    console.log(kleur.green(`Starting test "${selectedVariations.map((v) => "website: " + v.website + " - test: " + v.test + " - variation: " + v.variation).join(", ")}" ...`))


    log(`Test directories: ${testDirList}`)
    log(`Active variations: ${selectedVariations.map((v) => "website: " + v.website + " test: " + v.test + " variation: " + v.variation).join(", ")}`)

    await startTestServer(selectedVariations)
    await updateHistory(selectedVariations.map((v) => ({ website: v.website, test: v.test, variation: v.variation, testType: v.testType })))
}

