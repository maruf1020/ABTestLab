import fs, { copy } from "fs-extra"
import path from "path"
import prompts from "prompts"
import kleur from "kleur"
import { ROOT_DIR, SKELETON_DIR } from "../config.js"
import { initializeSkeleton } from "./init.js"
import { bundleVariation, bundleTargeting } from "./bundler.js"

function generateId(name) {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 10000)
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_")
  return `${timestamp}_${randomNum}_${sanitizedName}`
}

async function ensureSkeletonExist() {
  const skeletonExist = await fs.pathExists(SKELETON_DIR)
  if (!skeletonExist) {
    const response = await prompts({
      type: "confirm",
      name: "initializeSkeleton",
      message: "Skeleton are missing. Do you want to initialize them now?",
      initial: true,
    })
    if (response.initializeSkeleton) {
      await initializeSkeleton()
    } else {
      throw new Error('Skeleton are required. Please run "npm run cli init" to create skeleton.')
    }
  }
}

async function validateSkeleton() {
  const targetingTemplateExists = await fs.pathExists(path.join(SKELETON_DIR, "targeting"))
  const variationTemplateExists = await fs.pathExists(path.join(SKELETON_DIR, "variation", "default"))

  if (!targetingTemplateExists || !variationTemplateExists) {
    throw new Error('Required skeleton are missing. Please run "npm run cli init" to create skeleton.')
  }
}

async function copyTargetingFolder(destination) {
  const targetingTemplateDir = path.join(SKELETON_DIR, "targeting")
  await fs.copy(targetingTemplateDir, path.join(destination, "targeting"))
  const targetingDir = path.join(destination, "targeting")
  await bundleTargeting(targetingDir)
}

async function initCopyVariationFolder(destination, variationName) {
  const variationInfoList = [];
  const testInfo = await fs.readJson(path.join(destination, "info.json"));
  const isMultiTouchTest = testInfo.type === "Multi-touch";
  if (isMultiTouchTest) {
    const touchPoints = testInfo.touchPoints;
    if (touchPoints.length >= 1) {
      await Promise.all(touchPoints.map(async (touchPoint) => {
        const touchPointDir = path.join(destination, touchPoint);
        const touchPointInfo = await fs.readJson(path.join(touchPointDir, "info.json"));
        const touchPointVariations = touchPointInfo.variations;

        if (touchPointVariations && touchPointVariations.includes(variationName)) {
          return variationInfoList;
        }

        const info = await copyVariationFolder(true, touchPointDir, variationName, testInfo, destination, touchPointInfo);
        variationInfoList.push(info);
      }));

    } else {
      console.log(kleur.red(`Failed to create variation: TouchPoint is missing`));
    }
  } else {
    const info = await copyVariationFolder(false, destination, variationName, testInfo, destination);
    variationInfoList.push(info);
  }
  return variationInfoList;
}

async function copyVariationFolder(isMultiTouchTest, destination, variationName, testInfo, testDestination, touchPointInfo) {
  const variationTemplateDir = path.join(SKELETON_DIR, "variation", "default");
  const variationDir = path.join(destination, variationName);
  await fs.copy(variationTemplateDir, variationDir);

  const info = {
    id: generateId(variationName),
    name: variationName,
    isVariation: true,
    createdAt: new Date().toISOString(),
    createdAtReadable: new Date().toLocaleString(),
    lastUpdated: new Date().toISOString()
  };

  const variationInfo = path.join(variationDir, "info.json");
  await fs.writeJson(variationInfo, info, { spaces: 2 });

  if (!testInfo.variations || testInfo.variations.length === 0) {
    testInfo.variations = [variationName];
  } else {
    if (!testInfo.variations.includes(variationName)) {
      testInfo.variations.push(variationName);
    }
  }
  await fs.writeJson(path.join(testDestination, "info.json"), testInfo, { spaces: 2 });

  if (isMultiTouchTest) {
    if (!touchPointInfo.variations || touchPointInfo.variations.length === 0) {
      touchPointInfo.variations = [variationName];
    } else {
      if (!touchPointInfo.variations.includes(variationName)) {
        touchPointInfo.variations.push(variationName);
      }
    }
    await fs.writeJson(path.join(destination, "info.json"), touchPointInfo, { spaces: 2 });
  }

  await bundleVariation(variationDir); // Ensure this asynchronous operation is awaited
  return info;
}

export async function createWebsite(websiteName, hostnameList) {
  const websiteDir = path.join(ROOT_DIR, websiteName)
  try {
    await fs.ensureDir(websiteDir)

    const websiteInfo = {
      id: generateId(websiteName),
      name: websiteName,
      hostnames: hostnameList,
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    }

    await fs.writeJson(path.join(websiteDir, "info.json"), websiteInfo, { spaces: 2 })
    console.log(kleur.green(`Website "${websiteName}" created successfully with hostname(s): ${hostnameList.join(", ")}`))

    return websiteInfo;
  } catch (error) {
    console.error(kleur.red(`Failed to create website: ${error.message}`))
    throw error
  }
}

export async function createTest(website, testName, testType, touchPointName, variationName) {
  try {
    await validateSkeleton()
    await ensureSkeletonExist()

    const testDir = path.join(ROOT_DIR, website, testName)
    await fs.ensureDir(testDir)

    // Copy targeting folder for all test types
    await copyTargetingFolder(testDir)

    const testInfo = {
      id: generateId(testName),
      name: testName,
      type: testType,
      website: website,
      variations: [], // have to update
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    }

    if (testType === "Multi-touch") {
      testInfo.touchPoints = [] // have to update
    }

    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })

    switch (testType) {
      case "A/B":
        await createVariation(website, testName, "control")
        await createVariation(website, testName, variationName)
        break
      case "AA":
        await createVariation(website, testName, variationName)
        break
      case "Multi-touch":
        await createTouchPoint(website, testName, touchPointName)
        await createVariation(website, testName, "control")
        await createVariation(website, testName, variationName)
        break
      case "Patch":
        await createVariation(website, testName, variationName)
        break
    }

    return testInfo;

  } catch (error) {
    console.error(kleur.red(`Failed to create test: ${error.message}`))
    throw error
  }
}

export async function createVariation(website, test, variationName) {
  try {

    const testDir = path.join(ROOT_DIR, website, test)

    console.log(kleur.green(`Variation "${variationName}" created successfully for test "${test}" in website "${website}".`))

    return await initCopyVariationFolder(testDir, variationName)

  } catch (error) {
    console.error(kleur.red(`Failed to create variation: ${error.message}`))
    throw error
  }
}

export async function createTouchPoint(website, test, touchPointName) {
  try {

    const testDir = path.join(ROOT_DIR, website, test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    const touchPointDir = path.join(testDir, touchPointName)
    await fs.ensureDir(touchPointDir)
    await copyTargetingFolder(touchPointDir)
    const touchPointInfo = path.join(touchPointDir, "info.json")

    const touchPointInfoObj = {
      id: generateId(touchPointName),
      name: touchPointName,
      isTouchPoint: true,
      variations: [],
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    }

    await fs.writeJson(touchPointInfo, touchPointInfoObj, { spaces: 2 })
    await fs.ensureFile(touchPointInfo)

    if (testInfo.touchPoints && testInfo.touchPoints.length > 0) {
      testInfo.touchPoints.push(touchPointName)
    } else {
      if (!testInfo.touchPoints.includes(touchPointName)) {
        testInfo.touchPoints.push(touchPointName);
      }
    }
    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })
    await fs.ensureFile(path.join(testDir, "info.json"))

    const availableVariations = testInfo.variations;
    if (availableVariations && availableVariations.length > 0) {
      availableVariations.forEach(async (variationName) => {
        await createVariation(website, test, variationName)
      })
    }

    console.log(kleur.green(`TouchPoint "${touchPointName}" created successfully for test "${test}" in website "${website}".`))

    return touchPointInfoObj;
  } catch (error) {
    console.error(kleur.red(`Failed to create touchPoint: ${error.message}`))
    throw error
  }
}

