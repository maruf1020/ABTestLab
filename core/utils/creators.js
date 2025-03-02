import fs from "fs-extra"
import path from "path"
import prompts from "prompts"
import kleur from "kleur"
import { fileURLToPath } from "url"
import { ROOT_DIR } from "../config.js"
import { initializeSkeleton } from "./init.js"
import { bundleVariation, bundleTargeting } from "./bundler.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SKELETON_DIR = path.resolve(__dirname, "..", "..", "skeleton")

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

export async function createWebsite(websiteName) {
  const websiteDir = path.join(ROOT_DIR, websiteName)
  try {
    await fs.ensureDir(websiteDir)

    const response = await prompts({
      type: "text",
      name: "hostnames",
      message: "Enter the website host(s) or URL(s) (separate multiple with commas):",
      validate: (input) => input.trim() !== "" || "At least one hostname or URL is required",
    })

    const hostnameList = response.hostnames.split(",").map((host) => host.trim())

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
  } catch (error) {
    console.error(kleur.red(`Failed to create website: ${error.message}`))
    throw error
  }
}

export async function createTest(website, testName, testType) {
  try {
    await ensureSkeletonExist()
    await validateSkeleton()
    const testDir = path.join(ROOT_DIR, website, testName)
    await fs.ensureDir(testDir)

    // Copy targeting folder for all test types
    await copyTargetingFolder(testDir)

    let variations = []

    switch (testType) {
      case "A/B":
        variations = await createABTest(testDir)
        break
      case "AA":
        variations = await createAATest(testDir)
        break
      case "Multi-touch":
        variations = await createMultiTouchTest(testDir)
        break
      case "Patch":
        variations = await createPatchTest(testDir)
        break
    }

    const testInfo = {
      id: generateId(testName),
      name: testName,
      type: testType,
      website: website,
      variations: variations,
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    }

    if (testType === "Multi-touch") {
      const dirs = await fs.readdir(testDir)
      testInfo.touchPoints = dirs.filter((dir) => dir !== "targeting" && dir !== "info.json")
    }

    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })
    console.log(kleur.green(`Test "${testName}" created successfully for website "${website}".`))
    console.log(kleur.blue("Returning to main menu..."))
  } catch (error) {
    console.error(kleur.red(`Failed to create test: ${error.message}`))
    throw error
  }
}

export async function UpdateTest(website, testName) {
  try {
    await ensureSkeletonExist()
    await validateSkeleton()
    const testDir = path.join(ROOT_DIR, website, testName)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))

    console.log(testInfo)


    let variations = []

    // switch (testType) {
    //   case "A/B":
    //     variations = await createABTest(testDir)
    //     break
    //   case "AA":
    //     variations = await createAATest(testDir)
    //     break
    //   case "Multi-touch":
    //     variations = await createMultiTouchTest(testDir)
    //     break
    //   case "Patch":
    //     variations = await createPatchTest(testDir)
    //     break
    // }

    // const testInfo = {
    //   id: generateId(testName),
    //   name: testName,
    //   type: testType,
    //   website: website,
    //   variations: variations,
    //   createdAt: new Date().toISOString(),
    //   createdAtReadable: new Date().toLocaleString(),
    //   lastUpdated: new Date().toISOString(),
    // }

    // if (testType === "Multi-touch") {
    //   const dirs = await fs.readdir(testDir)
    //   testInfo.touchPoints = [testInfo.touchPoints, dirs.filter((dir) => dir !== "targeting" && dir !== "info.json")].flat()
    // }

    // await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })

    // console.log(kleur.green(`Test "${testName}" updated successfully for website "${website}".`))
    // console.log(kleur.blue("Returning to main menu..."))
  } catch (error) {
    console.error(kleur.red(`Failed to update test: ${error.message}`))
    throw error
  }
}

async function createABTest(testDir) {
  const variations = ["Control"]
  await createVariation(testDir, "Control")
  const additionalVariations = await createVariations(testDir, 1)
  for (const variation of additionalVariations) {
    await createVariation(testDir, variation)
  }
  return [...variations, ...additionalVariations]
}

async function createAATest(testDir) {
  const variations = await createVariations(testDir, 2)
  for (const variation of variations) {
    await createVariation(testDir, variation)
  }
  return variations
}

async function createMultiTouchTest(testDir) {
  const touchPoints = await createTouchPoints(testDir)
  const variations = await createVariations(testDir, 0) // Pass 0 to prevent creating variations in test folder

  // Copy targeting folder to the test directory
  await copyTargetingFolder(testDir)

  for (const touchPoint of touchPoints) {
    const touchPointDir = path.join(testDir, touchPoint)
    await fs.ensureDir(touchPointDir)
    await copyTargetingFolder(touchPointDir)

    // Create Control variation first
    await createVariation(touchPointDir, "Control")

    // Create other variations
    for (const variation of variations) {
      await createVariation(touchPointDir, variation)
    }

    await fs.writeJson(
      path.join(touchPointDir, "info.json"),
      {
        id: generateId(touchPoint),
        name: touchPoint,
        variations: ["Control", ...variations],
        createdAt: new Date().toISOString(),
        createdAtReadable: new Date().toLocaleString(),
        lastUpdated: new Date().toISOString(),
      },
      { spaces: 2 }
    )
    console.log(kleur.green(`TouchPoint "${touchPoint}" created successfully.`))
  }

  return ["Control", ...variations]
}

async function createPatchTest(testDir) {
  const variations = ["patch"]
  await createVariation(testDir, "patch")
  return variations
}

async function createTouchPoints(testDir) {
  const touchPoints = []
  let touchPointCount = 0

  while (true) {
    touchPointCount++

    const response = await prompts([
      {
        type: "text",
        name: "touchPointName",
        message: `Enter the name for TouchPoint ${touchPointCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "TouchPoint name cannot be empty"
          if (touchPoints.includes(input)) return "A TouchPoint with this name already exists"
          return true
        },
      },
      {
        type: "confirm",
        name: "createAnother",
        message: "Do you want to create another TouchPoint?",
        initial: false,
      },
    ])

    touchPoints.push(response.touchPointName)

    const touchPointDir = path.join(testDir, response.touchPointName)
    await fs.ensureDir(touchPointDir)
    await copyTargetingFolder(touchPointDir)
    console.log(kleur.green(`TouchPoint "${response.touchPointName}" created successfully.`))

    if (!response.createAnother) break
  }

  return touchPoints
}

async function createVariations(testDir, touchPointCount) {
  const variations = []
  let variationCount = 0

  while (true) {
    variationCount++

    const response = await prompts([
      {
        type: "text",
        name: "variationName",
        message: `Enter the name for Variation ${variationCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Variation name cannot be empty"
          if (variations.includes(input)) return "This variation name has already been used"
          return true
        },
      },
      {
        type: "confirm",
        name: "createAnother",
        message: "Do you want to create another variation?",
        initial: false,
      },
    ])

    variations.push(response.variationName)

    if (touchPointCount !== 0) {
      const variationDir = path.join(testDir, response.variationName)
      await fs.ensureDir(variationDir)
      await fs.copy(path.join(SKELETON_DIR, "variation", "default"), variationDir)
      await fs.writeJson(
        path.join(variationDir, "info.json"),
        {
          id: generateId(response.variationName),
          name: response.variationName,
          isVariation: true,
          createdAt: new Date().toISOString(),
          createdAtReadable: new Date().toLocaleString(),
          lastUpdated: new Date().toISOString(),
        },
        { spaces: 2 }
      )
    }

    console.log(kleur.green(`Variation "${response.variationName}" created successfully.`))

    if (!response.createAnother) break
  }

  return variations
}

async function createVariation(dir, variationName) {
  const variationDir = path.join(dir, variationName)
  await fs.ensureDir(variationDir)
  await fs.copy(path.join(SKELETON_DIR, "variation", "default"), variationDir)

  // Create info.json for the variation
  const infoJsonPath = path.join(variationDir, "info.json")
  await fs.writeJson(
    infoJsonPath,
    {
      id: generateId(variationName),
      name: variationName,
      isVariation: true,
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    },
    { spaces: 2 }
  )

  // Bundle the variation
  await bundleVariation(variationDir)
}