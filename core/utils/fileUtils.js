import fs from "fs-extra"
import path from "path"

import { ROOT_DIR } from "../global/config.js"

export async function listWebsites() {
  try {
    if (!fs.existsSync(ROOT_DIR)) {
      return []
    }
    const items = await fs.readdir(ROOT_DIR)
    return items
      .filter((item) => fs.statSync(path.join(ROOT_DIR, item)).isDirectory())
      .filter((item) => fs.pathExists(path.join(ROOT_DIR, item, "info.json")))
  } catch (error) {
    throw new Error(`Failed to list websites: ${error.message}`)
  }
}

export async function listTests(website) {
  const websiteDir = path.join(ROOT_DIR, website)
  const tests = await fs.readdir(websiteDir)
  return tests
    .filter((test) => fs.lstatSync(path.join(websiteDir, test)).isDirectory())
    .filter((test) => fs.pathExists(path.join(websiteDir, test, "info.json")))
}

export async function listOnlyMultiTouchTests(website) {
  const websiteDir = path.join(ROOT_DIR, website)
  const tests = await fs.readdir(websiteDir)
  return tests
    .filter((test) => fs.lstatSync(path.join(websiteDir, test)).isDirectory())
    .filter((test) => fs.pathExists(path.join(websiteDir, test, "info.json")))
    .filter((test) => getTestInfo(website, test).type === "Multi-touch")
}

export async function listAllTestExceptMultiTouch(website) {
  const websiteDir = path.join(ROOT_DIR, website)
  const tests = await fs.readdir(websiteDir)
  return tests
    .filter((test) => fs.lstatSync(path.join(websiteDir, test)).isDirectory())
    .filter((test) => fs.pathExists(path.join(websiteDir, test, "info.json")))
    .filter((test) => getTestInfo(website, test).type !== "Multi-touch")
}

export async function listTouchPoints(website, test) {
  try {
    const testInfo = await getTestInfo(website, test)
    return testInfo.touchPoints
  } catch (error) {
    throw new Error(`Failed to list touchPoints for test ${test} in website ${website}: ${error.message}`)
  }
}

export async function listVariations(website, test) {
  try {
    const testInfo = await getTestInfo(website, test)
    return testInfo.variations
  } catch (error) {
    throw new Error(`Failed to list tests for test ${test} in website ${website}: ${error.message}`)
  }
}

export async function listTouchPointsAndVariations(website, test) {
  try {
    const testInfo = await getTestInfo(website, test)
    const touchPoints = testInfo.touchPoints.map(item => {
      return {
        name: item,
        type: "touchPoint"
      }
    })
    const variations = testInfo.variations.map(item => {
      return {
        name: item,
        type: "variation"
      }
    })
    return [...touchPoints, ...variations]
  } catch (error) {
    throw new Error(`Failed to list touchPoints for test ${test} in website ${website}: ${error.message}`)
  }
}

export async function getWebsiteInfo(website) {
  try {
    const websiteInfoPath = path.join(ROOT_DIR, website, "info.json")
    return await fs.readJson(websiteInfoPath)
  } catch (error) {
    throw new Error(`Failed to get website info for ${website}: ${error.message}`)
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

export async function getVariationInfo(website, test, variation) {
  try {
    const variationInfoPath = path.join(ROOT_DIR, website, test, variation, "info.json")
    return await fs.readJson(variationInfoPath)
  } catch (error) {
    throw new Error(`Failed to get variation info for ${variation} in test ${test} in website ${website}: ${error.message}`)
  }
}

export async function getTouchPointInfo(website, test, touchPoint) {
  try {
    const touchPointInfoPath = path.join(ROOT_DIR, website, test, touchPoint, "info.json")
    return await fs.readJson(touchPointInfoPath)
  } catch (error) {
    throw new Error(`Failed to get touchPoint info for ${touchPoint} in test ${test} in website ${website}: ${error.message}`)
  }
}

export async function getTouchPointsVariationInfo(website, test, touchPoint, variation) {
  try {
    const touchPointInfoPath = path.join(ROOT_DIR, website, test, touchPoint, variation, "info.json")
    return await fs.readJson(touchPointInfoPath)
  } catch (error) {
    throw new Error(`Failed to get touchPoint info for ${variation} in touchPoint ${touchPoint} in test ${test} in website ${website}: ${error.message}`)
  }
}