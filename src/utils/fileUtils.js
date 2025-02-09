import fs from "fs-extra"
import path from "path"
import { ROOT_DIR } from "../config.js"

export async function listWebsites() {
  try {
    if (!fs.existsSync(ROOT_DIR)) {
      return []
    }
    const items = await fs.readdir(ROOT_DIR)
    return items.filter((item) => fs.statSync(path.join(ROOT_DIR, item)).isDirectory())
  } catch (error) {
    throw new Error(`Failed to list websites: ${error.message}`)
  }
}

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

