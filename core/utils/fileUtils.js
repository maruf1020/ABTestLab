import fs from "fs-extra"
import path from "path"

import { ROOT_DIR } from "../global/config.js"

export async function listWebsites() {
  try {
    if (!fs.existsSync(ROOT_DIR)) {
      return []
    }
    const items = await fs.readdir(ROOT_DIR);
    const result = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(ROOT_DIR, item);
        const isDirectory = await fs.stat(itemPath).then((stat) => stat.isDirectory());
        const hasInfoJson = await fs.pathExists(path.join(itemPath, 'info.json'));

        return isDirectory && hasInfoJson ? item : null;
      })
    );
    return result.filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to list websites: ${error.message}`)
  }
}

export async function listTests(website) {
  try {
    const websiteDir = path.join(ROOT_DIR, website);
    const tests = await fs.readdir(websiteDir);

    const result = await Promise.all(
      tests.map(async (test) => {
        const testPath = path.join(websiteDir, test);
        const isDirectory = await fs.lstat(testPath).then((stat) => stat.isDirectory());
        const hasInfoJson = await fs.pathExists(path.join(testPath, 'info.json'));

        return isDirectory && hasInfoJson ? test : null;
      })
    );

    return result.filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to list tests: ${error.message}`);
  }
}

export async function listOnlyMultiTouchTests(website) {
  try {
    const websiteDir = path.join(ROOT_DIR, website);
    const tests = await fs.readdir(websiteDir);

    const result = await Promise.all(
      tests.map(async (test) => {
        const testPath = path.join(websiteDir, test);
        const isDirectory = await fs.lstat(testPath).then((stat) => stat.isDirectory());
        const hasInfoJson = await fs.pathExists(path.join(testPath, 'info.json'));

        if (isDirectory && hasInfoJson) {
          const testInfo = await getTestInfo(website, test);
          if (testInfo.type === "Multi-touch") {
            return test;
          }
        }
        return null;
      })
    );

    return result.filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to list multi-touch tests: ${error.message}`);
  }
}

export async function listAllTestExceptMultiTouch(website) {
  try {
    const websiteDir = path.join(ROOT_DIR, website);
    const tests = await fs.readdir(websiteDir);

    const result = await Promise.all(
      tests.map(async (test) => {
        const testPath = path.join(websiteDir, test);
        const isDirectory = await fs.lstat(testPath).then((stat) => stat.isDirectory());
        const hasInfoJson = await fs.pathExists(path.join(testPath, 'info.json'));

        if (isDirectory && hasInfoJson) {
          const testInfo = await getTestInfo(website, test);
          if (testInfo.type !== "Multi-touch") {
            return test;
          }
        }
        return null;
      })
    );

    return result.filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to list tests except Multi-touch: ${error.message}`);
  }
}

export async function listTouchPoints(website, test) {
  try {
    const testInfo = await getTestInfo(website, test);

    if (!testInfo || !testInfo.touchPoints) {
      throw new Error(`No touchPoints found for test ${test} in website ${website}`);
    }

    return testInfo.touchPoints;
  } catch (error) {
    throw new Error(`Failed to list touchPoints for test ${test} in website ${website}: ${error.message}`);
  }
}


export async function listVariations(website, test) {
  try {
    const testInfo = await getTestInfo(website, test);

    if (!testInfo || !testInfo.variations) {
      throw new Error(`No variations found for test ${test} in website ${website}`);
    }

    return testInfo.variations;
  } catch (error) {
    throw new Error(`Failed to list variations for test ${test} in website ${website}: ${error.message}`);
  }
}


export async function listTouchPointsAndVariations(website, test) {
  try {
    const testInfo = await getTestInfo(website, test);

    if (!testInfo || !testInfo.touchPoints || !testInfo.variations) {
      throw new Error(`TouchPoints or variations are missing for test ${test} in website ${website}`);
    }

    const touchPoints = testInfo.touchPoints.map(item => ({
      name: item,
      type: "touchPoint"
    }));

    const variations = testInfo.variations.map(item => ({
      name: item,
      type: "variation"
    }));

    return [...touchPoints, ...variations];
  } catch (error) {
    throw new Error(`Failed to list touchPoints and variations for test ${test} in website ${website}: ${error.message}`);
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

export function getVariationDir(website, test, variation) {
  return path.join(ROOT_DIR, website, test, variation)
}

export function getVariationDirForTouchPoint(website, test, touchPoint, variation) {
  return path.join(ROOT_DIR, website, test, touchPoint, variation)
}