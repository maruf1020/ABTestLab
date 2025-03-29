import fs from "fs-extra"
import path from "path"
import Table from "cli-table3"
import debug from "debug"
import kleur from "kleur"
import chalk from "chalk"
import prompts from "prompts"

import { ROOT_DIR } from "../global/config.js"
import { getTestInfo, getVariationDir, getVariationDirForTouchPoint } from "./fileUtils.js"
import { buildVariation } from "../utils/bundler.js"
import { selectTest, selectVariation } from "./selectors.js"

const log = debug("ab-testing-cli:build")

export async function handleLatestTest(lastTest, goBack) {
    const isGroupTest = lastTest.tests.length > 1;
    const choices = [
        { title: chalk.green('📦 Build Latest Test'), value: "run" },
        { title: chalk.magenta('🔙 Back'), value: "back" },
        { title: chalk.red('❌ Exit'), value: "exit" },
    ];

    if (!isGroupTest) {
        choices.splice(1, 0, { title: chalk.blueBright('🔄 Change Variation'), value: "changeVariation" });
        choices.splice(2, 0, { title: chalk.blueBright('🔄 Change Test'), value: "changeTest" });
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
                await buildMultipleTest(lastTest.tests.map((test) => ({
                    website: test.websiteName,
                    test: test.testName,
                    variation: test.variationName,
                    testType: test.testType
                })))
            } else {
                await buildTest(testData.websiteName, testData.testName, testData.variationName, testData.testType)
            }
            break
        case "changeVariation":
            const variationName = await selectVariation(testData.websiteName, testData.testName, () => handleLatestTest(lastTest, goBack))
            if (!variationName) return null;
            return await buildTest(testData.websiteName, testData.testName, variationName, testData.testType)
        case "changeTest":
            return await handleTestSelectionWithHistory(testData.websiteName, lastTest, goBack);
        case "back":
            return goBack()
        case "exit":
            console.log(kleur.blue("See you soon!"))
            process.exit(0)

    }

}

export async function viewTestHistory(history, viewType, goBack) {
    const filteredHistory =
        viewType === "groupTest"
            ? history.filter(entry => entry.tests.length > 1)
            : viewType === "singleTest"
                ? history.filter(entry => entry.tests.length === 1)
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

    const testTypeIcons = {
        "A/B": "🆎",
        "AA": "📊",
        "Multi-touch": "🎯",
        "Patch": "🩹"
    };


    const choices = filteredHistory.map((entry, index) => {
        if (entry.tests.length > 1) {
            const groupTitle = entry.tests.map((test, i) => {
                const icon = testTypeIcons[test.testType] || "🧪"; // Default icon if testType is unknown
                return `${i === 0 ? "┌" : i === (entry.tests.length - 1) ? "    └" : "    │"} ${icon} ${test.websiteName} - ${test.testName} - ${test.variationName} (${test.testType})`;
            }).join('\n');

            return {
                title: groupTitle,
                value: { entryIndex: index, isGroup: true },
            };
        } else {
            const test = entry.tests[0];
            const icon = testTypeIcons[test.testType] || "🧪"; // Default icon
            return {
                title: `- ${icon} ${test.websiteName} - ${test.testName} - ${test.variationName} (${test.testType})`,
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
            buildMultipleTest(selectedEntry.tests.map((test) => ({
                website: test.websiteName,
                test: test.testName,
                variation: test.variationName,
                testType: test.testType
            })));
        } else {
            const selectedTestData = selectedEntry.tests[selectedTest.testIndex];
            await buildTest(
                selectedTestData.websiteName,
                selectedTestData.testName,
                selectedTestData.variationName,
                selectedTestData.testType,
            );
        }
    }
}

async function handleTestSelectionWithHistory(selectedWebsite, lastTest, goBack) {
    const selectedTest = await selectTest(selectedWebsite, () => handleLatestTest(lastTest, goBack));
    if (typeof selectedTest === 'string') {
        await handleTestDetailsWithHistory(selectedWebsite, selectedTest, lastTest, goBack);
    }
}

async function handleTestDetailsWithHistory(selectedWebsite, selectedTest, lastTest, goBack) {
    const selectedVariation = await selectVariation(selectedWebsite, selectedTest, () => handleTestSelectionWithHistory(selectedWebsite, lastTest, goBack));
    if (typeof selectedVariation === 'string') {
        const testInfo = await getTestInfo(selectedWebsite, selectedTest);
        await buildTest(selectedWebsite, selectedTest, selectedVariation, testInfo.type);
    }
}

export async function buildTest(website, test, variation, testType) {
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

    console.log(kleur.green(`Building test "${test}" for website "${website}" with variation "${variation}"...`))
    log(`Test directory: ${testDir}`)
    log(`Active variation: ${variation}`)

    let variationDirList = []
    if (testType !== "Multi-touch") {
        variationDirList.push(getVariationDir(website, test, variation))
    } else {
        const touchPoints = testInfo.touchPoints || []
        variationDirList = touchPoints.map((touchPoint) => getVariationDirForTouchPoint(website, test, touchPoint, variation))
    }
    await Promise.all(variationDirList.map((variationDir) => buildVariation(variationDir)))
}

export async function buildMultipleTest(selectedVariations) {
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

    console.log(kleur.green(`Building test "${selectedVariations.map((v) => "website: " + v.website + " - test: " + v.test + " - variation: " + v.variation).join(", ")}" ...`))


    log(`Test directories: ${testDirList}`)
    log(`Active variations: ${selectedVariations.map((v) => "website: " + v.website + " test: " + v.test + " variation: " + v.variation).join(", ")}`)

    await Promise.all(selectedVariations.map(async (v) => {
        let variationDirList = [];
        const { website, test, variation } = v;
        const testDir = path.join(ROOT_DIR, website, test);
        const testInfo = await fs.readJson(path.join(testDir, "info.json"));

        if (testInfo.testType !== "Multi-touch") {
            variationDirList.push(getVariationDir(website, test, variation));
        } else {
            const touchPoints = testInfo.touchPoints || [];
            variationDirList = touchPoints.map((touchPoint) => getVariationDirForTouchPoint(website, test, touchPoint, variation));
        }

        await Promise.all(variationDirList.map((variationDir) => buildVariation(variationDir)));
    }));
}