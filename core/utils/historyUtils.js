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

export async function updateHistory(newTests) {
    let history = await loadHistory()
    const settings = await fs.readJson(settingsPath)
    const MAX_HISTORY_LENGTH = settings.maxHistoryRecords

    // Create a new entry
    const newEntry = {
        lastRun: new Date().toISOString(),
        tests: newTests,
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