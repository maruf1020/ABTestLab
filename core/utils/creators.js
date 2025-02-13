import fs from "fs-extra"
import path from "path"
import prompts from "prompts"
import kleur from "kleur"
import { fileURLToPath } from "url"
import { ROOT_DIR } from "../config.js"
import { initializeSkeleton } from "./init.js"
import { convertScssToCSS } from "./cssUtils.js"

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
  const variationTemplateExists = await fs.pathExists(path.join(SKELETON_DIR, "variation"))

  if (!targetingTemplateExists || !variationTemplateExists) {
    throw new Error('Required skeleton are missing. Please run "npm run cli init" to create skeleton.')
  }
}

async function copyTargetingFolder(destination) {
  const targetingTemplateDir = path.join(SKELETON_DIR, "targeting")
  await fs.copy(targetingTemplateDir, path.join(destination, "targeting"))
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
    console.log(
      kleur.green(`Website "${websiteName}" created successfully with hostname(s): ${hostnameList.join(", ")}`),
    )
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
      testInfo.touchpoints = dirs.filter((dir) => dir !== "targeting" && dir !== "info.json")
    }

    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })
    console.log(kleur.green(`Test "${testName}" created successfully for website "${website}".`))

    // Prompt for variation activation
    if (variations.length > 0) {
      await activateVariation(testDir, variations, testType)
    }
  } catch (error) {
    console.error(kleur.red(`Failed to create test: ${error.message}`))
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
  const touchpoints = await createTouchpoints(testDir)
  const variations = await createVariations(testDir, 0) // Pass 0 to prevent creating variations in test folder

  // Copy targeting folder to the test directory
  await copyTargetingFolder(testDir)

  for (const touchpoint of touchpoints) {
    const touchpointDir = path.join(testDir, touchpoint)
    await fs.ensureDir(touchpointDir)
    await copyTargetingFolder(touchpointDir)

    // Create Control variation first
    await createVariation(touchpointDir, "Control")

    // Create other variations
    for (const variation of variations) {
      await createVariation(touchpointDir, variation)
    }

    await fs.writeJson(
      path.join(touchpointDir, "info.json"),
      {
        id: generateId(touchpoint),
        name: touchpoint,
        variations: ["Control", ...variations],
        createdAt: new Date().toISOString(),
        createdAtReadable: new Date().toLocaleString(),
        lastUpdated: new Date().toISOString(),
      },
      { spaces: 2 },
    )
    console.log(kleur.green(`Touchpoint "${touchpoint}" created successfully.`))
  }

  return ["Control", ...variations]
}

async function createPatchTest(testDir) {
  const variations = ["patch"]
  await createVariation(testDir, "patch")
  return variations
}

async function createTouchpoints(testDir) {
  const touchpoints = []
  let touchpointCount = 0

  while (true) {
    touchpointCount++

    const response = await prompts([
      {
        type: "text",
        name: "touchpointName",
        message: `Enter the name for Touchpoint ${touchpointCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Touchpoint name cannot be empty"
          if (touchpoints.includes(input)) return "A Touchpoint with this name already exists"
          return true
        },
      },
      {
        type: "confirm",
        name: "createAnother",
        message: "Do you want to create another Touchpoint?",
        initial: false,
      },
    ])

    touchpoints.push(response.touchpointName)

    const touchpointDir = path.join(testDir, response.touchpointName)
    await fs.ensureDir(touchpointDir)
    await copyTargetingFolder(touchpointDir)
    console.log(kleur.green(`Touchpoint "${response.touchpointName}" created successfully.`))

    if (!response.createAnother) break
  }

  return touchpoints
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
      await fs.copy(path.join(SKELETON_DIR, "variation"), variationDir)
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
        { spaces: 2 },
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
  await fs.copy(path.join(SKELETON_DIR, "variation"), variationDir)

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
    { spaces: 2 },
  )
}

async function activateVariation(testDir, variations, testType) {
  const choices = [{ title: "None", value: "None" }, ...variations.map((v) => ({ title: v, value: v }))]

  const response = await prompts({
    type: "select",
    name: "activeVariation",
    message: "Select a variation to activate (or 'None' to deactivate all):",
    choices: choices,
  })

  const activeVariation = response.activeVariation

  const testInfo = await fs.readJson(path.join(testDir, "info.json"))

  if (testType === "Multi-touch") {
    const touchpoints = testInfo.touchpoints || []
    for (const touchpoint of touchpoints) {
      const touchpointDir = path.join(testDir, touchpoint)
      const touchpointInfoPath = path.join(touchpointDir, "info.json")
      if (await fs.pathExists(touchpointInfoPath)) {
        const touchpointInfo = await fs.readJson(touchpointInfoPath)
        if (activeVariation === "None") {
          delete touchpointInfo.activeVariation
        } else {
          touchpointInfo.activeVariation = activeVariation
        }
        touchpointInfo.lastUpdated = new Date().toISOString()
        await fs.writeJson(touchpointInfoPath, touchpointInfo, { spaces: 2 })
      }
    }
    // Update the main test's info.json
    if (activeVariation === "None") {
      delete testInfo.activeVariation
    } else {
      testInfo.activeVariation = activeVariation
    }
    testInfo.lastUpdated = new Date().toISOString()
    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })

    console.log(kleur.green(`Updated active variation for the main test to: ${activeVariation}`))
    console.log(kleur.green(`Updated active variation for all touchpoints to: ${activeVariation}`))
  } else {
    if (activeVariation === "None") {
      delete testInfo.activeVariation
      console.log(kleur.yellow("No variation activated. All variations are now inactive."))
    } else {
      testInfo.activeVariation = activeVariation
      console.log(kleur.green(`Activated variation: ${activeVariation}`))
    }
    testInfo.lastUpdated = new Date().toISOString()
    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })
  }

  await updateVariationStatus(testDir, activeVariation, testType)
}

async function updateVariationStatus(dir, activeVariation, testType) {
  if (testType === "Multi-touch") {
    const touchpoints = await fs.readdir(dir)
    for (const touchpoint of touchpoints) {
      const touchpointDir = path.join(dir, touchpoint)
      if ((await fs.stat(touchpointDir)).isDirectory() && touchpoint !== "targeting") {
        await updateTouchpointVariationStatus(touchpointDir, activeVariation)
      }
    }
  } else {
    const variations = await fs.readdir(dir)
    for (const variation of variations) {
      if (
        variation !== "info.json" &&
        variation !== "targeting" &&
        (await fs.stat(path.join(dir, variation))).isDirectory()
      ) {
        await updateSingleVariationStatus(dir, variation, activeVariation)
      }
    }
  }
}

async function updateTouchpointVariationStatus(touchpointDir, activeVariation) {
  const variations = await fs.readdir(touchpointDir)
  for (const variation of variations) {
    if (
      variation !== "info.json" &&
      variation !== "targeting" &&
      (await fs.stat(path.join(touchpointDir, variation))).isDirectory()
    ) {
      await updateSingleVariationStatus(touchpointDir, variation, activeVariation)
    }
  }
}

async function updateSingleVariationStatus(dir, variation, activeVariation) {
  const variationDir = path.join(dir, variation)
  const infoJsonPath = path.join(variationDir, "info.json")

  if (await fs.pathExists(infoJsonPath)) {
    const variationInfo = await fs.readJson(infoJsonPath)
    variationInfo.active = activeVariation !== "None" && variation === activeVariation
    variationInfo.lastUpdated = new Date().toISOString()
    await fs.writeJson(infoJsonPath, variationInfo, { spaces: 2 })

    // Convert SCSS to CSS
    const scssFile = path.join(variationDir, "style.scss")
    const cssFile = path.join(variationDir, "style.css")
    if (await fs.pathExists(scssFile)) {
      await convertScssToCSS(scssFile, cssFile)
    }
  }
}