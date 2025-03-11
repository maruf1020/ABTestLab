import fs from "fs-extra"
import path from "path"

const historyPath = path.join(process.cwd(), "history.json")
const settingsPath = path.join(process.cwd(), "settings.json")

export async function loadHistory() {
    if (await fs.pathExists(historyPath)) {
        return fs.readJson(historyPath)
    }
    return []
}

export async function clearHistory() {
    await fs.writeJson(historyPath, [])
}

export async function updateHistory(newTests) {
    let history = await loadHistory()
    const settings = await fs.readJson(settingsPath)
    const MAX_HISTORY_LENGTH = settings.maxHistoryRecords

    // Create a new entry
    const newEntry = {
        lastRun: new Date().toISOString(),
        tests: newTests.map(({ website, test, variation, testType }) => ({
            websiteName: website,
            testName: test,
            variationName: variation,
            testType,
        })),
    }

    // Remove duplicates
    history = history.filter((entry) => !isDuplicate(entry, newEntry))

    // Add the new entry to the beginning of the array
    history.unshift(newEntry)

    // Ensure the maximum length is not exceeded
    if (history.length > MAX_HISTORY_LENGTH) {
        history = history.slice(0, MAX_HISTORY_LENGTH)
    }

    // Save the updated history
    try {
        await fs.writeJson(historyPath, history, { spaces: 2 })
    } catch (error) {
        console.error("Error writing history file:", error)
    }
}

export async function changeVariationsNameOnHistory(test, newVariationName) {
    const history = await loadHistory()
    const newHistory = history.map((entry) => {
        const newTests = entry.tests.map((testInfo) => {
            if (
                testInfo.websiteName === test.website &&
                testInfo.testName === test.test &&
                testInfo.variationName === test.variation &&
                testInfo.testType === test.testType
            ) {
                return {
                    ...testInfo,
                    variationName: newVariationName,
                }
            }
            return testInfo
        })
        return {
            ...entry,
            tests: newTests,
        }
    })

    await fs.writeJson(historyPath, newHistory, { spaces: 2 })
}

function isDuplicate(existingEntry, newEntry) {
    if (existingEntry.tests.length !== newEntry.tests.length) {
        return false
    }

    return existingEntry.tests.every((existingTest, index) => {
        const newTest = newEntry.tests[index]
        return (
            existingTest.websiteName === newTest.websiteName &&
            existingTest.testName === newTest.testName &&
            existingTest.variationName === newTest.variationName
        )
    })
}