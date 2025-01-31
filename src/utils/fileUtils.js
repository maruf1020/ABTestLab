import fs from "fs-extra"
import path from "path"
import { ROOT_DIR } from "../config.js"

export async function listWebsites() {
  return await fs.readdir(ROOT_DIR)
}

export async function listTests(website) {
  const websiteDir = path.join(ROOT_DIR, website)
  const items = await fs.readdir(websiteDir)
  return items.filter((item) => item !== "info.json")
}

