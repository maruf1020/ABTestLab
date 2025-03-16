import fs from "fs-extra"
import path from "path"

import { ROOT_DIR } from "../global/config.js"

export async function listTests(website) {
    try {
        const websiteDir = path.join(ROOT_DIR, website)
        const items = await fs.readdir(websiteDir)
        return items.filter((item) => fs.statSync(path.join(websiteDir, item)).isDirectory() && item !== "info.json")
    } catch (error) {
        throw new Error(`Failed to list tests for website ${website}: ${error.message}`)
    }
}

export async function getTestInfo(website, test) {
    try {
        const testInfoPath = path.join(ROOT_DIR, website, test, "info.json")
        return await fs.readJson(testInfoPath)
    } catch (error) {
        throw new Error(`Failed to get test info for ${test} in website ${website}: ${error.message}`)
    }
}