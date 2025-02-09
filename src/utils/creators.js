import fs from "fs-extra"
import path from "path"
import prompts from "prompts"
import kleur from "kleur"
import { fileURLToPath } from "url"
import { ROOT_DIR } from "../config.js"
import { initializeTemplates } from "./init.js"
import { convertScssToCSS } from "./cssUtils.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates")

async function ensureTemplatesExist() {
  const templatesExist = await fs.pathExists(TEMPLATES_DIR)
  if (!templatesExist) {
    const response = await prompts({
      type: "confirm",
      name: "initializeTemplates",
      message: "Templates are missing. Do you want to initialize them now?",
      initial: true,
    })
    if (response.initializeTemplates) {
      await initializeTemplates()
    } else {
      throw new Error('Templates are required. Please run "npm run cli init" to create templates.')
    }
  }
}

async function validateTemplates() {
  const targetingTemplateExists = await fs.pathExists(path.join(TEMPLATES_DIR, "targeting"))
  const variationTemplateExists = await fs.pathExists(path.join(TEMPLATES_DIR, "variation"))

  if (!targetingTemplateExists || !variationTemplateExists) {
    throw new Error('Required templates are missing. Please run "npm run cli init" to create templates.')
  }
}

async function copyTargetingFolder(destination) {
  const targetingTemplateDir = path.join(TEMPLATES_DIR, "targeting")
  await fs.copy(targetingTemplateDir, path.join(destination, "targeting"))

  // Ensure info.json exists in the targeting folder
  const infoJsonPath = path.join(destination, "targeting", "info.json")
  if (!(await fs.pathExists(infoJsonPath))) {
    await fs.writeJson(
      infoJsonPath,
      {
        name: "Targeting",
        createdAt: new Date().toISOString(),
        createdAtReadable: new Date().toLocaleString(),
        lastUpdated: new Date().toISOString(),
      },
      { spaces: 2 },
    )
  }
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
    await ensureTemplatesExist()
    await validateTemplates()
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
      case "Multipage":
        variations = await createMultipageTest(testDir)
        break
      case "Patch":
        variations = await createPatchTest(testDir)
        break
    }

    const testInfo = {
      name: testName,
      type: testType,
      website: website,
      variations: variations,
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    }

    if (testType === "Multipage") {
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
  const variations = ["Control"]
  await createVariation(testDir, "Control")
  const additionalVariations = await createVariations(testDir, 1)
  for (const variation of additionalVariations) {
    await createVariation(testDir, variation)
  }
  return [...variations, ...additionalVariations]
}

async function createMultipageTest(testDir) {
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
        name: touchPoint,
        variations: ["Control", ...variations],
        createdAt: new Date().toISOString(),
        createdAtReadable: new Date().toLocaleString(),
        lastUpdated: new Date().toISOString(),
      },
      { spaces: 2 },
    )
    console.log(kleur.green(`Touch point "${touchPoint}" created successfully.`))
  }

  return ["Control", ...variations]
}

async function createPatchTest(testDir) {
  const variations = ["Control", "patch"]
  await createVariation(testDir, "Control")
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
        message: `Enter the name for Touch Point ${touchPointCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Touch Point name cannot be empty"
          if (touchPoints.includes(input)) return "A Touch Point with this name already exists"
          return true
        },
      },
      {
        type: "confirm",
        name: "createAnother",
        message: "Do you want to create another Touch Point?",
        initial: false,
      },
    ])

    touchPoints.push(response.touchPointName)

    const touchPointDir = path.join(testDir, response.touchPointName)
    await fs.ensureDir(touchPointDir)
    await fs.copy(path.join(TEMPLATES_DIR, "touch-point"), touchPointDir)
    console.log(kleur.green(`Touch point "${response.touchPointName}" created successfully.`))

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
      await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
      await fs.writeJson(
        path.join(variationDir, "info.json"),
        {
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
  if (variationName === "Control") {
    // For Control, copy the first non-Control variation
    const variations = await fs.readdir(dir)
    const nonControlVariation = variations.find((v) => v !== "Control" && v !== "targeting" && v !== "info.json")
    if (nonControlVariation) {
      await fs.copy(path.join(dir, nonControlVariation), variationDir)
    } else {
      await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
    }
  } else {
    await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
  }
  await fs.writeJson(
    path.join(variationDir, "info.json"),
    {
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
  const response = await prompts({
    type: "select",
    name: "activeVariation",
    message: "Select a variation to activate:",
    choices: variations.map((v) => ({ title: v, value: v })),
  })

  const activeVariation = response.activeVariation

  if (activeVariation) {
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))
    testInfo.activeVariation = activeVariation
    testInfo.lastUpdated = new Date().toISOString()
    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 })

    if (testType === "Multipage") {
      const touchPoints = await fs.readdir(testDir)
      for (const touchPoint of touchPoints) {
        const touchPointDir = path.join(testDir, touchPoint)
        if ((await fs.stat(touchPointDir)).isDirectory()) {
          await updateVariationStatus(touchPointDir, activeVariation)
        }
      }
    } else {
      await updateVariationStatus(testDir, activeVariation)
    }

    console.log(kleur.green(`Activated variation: ${activeVariation}`))
  }
}

async function updateVariationStatus(dir, activeVariation) {
  const variations = await fs.readdir(dir)
  for (const variation of variations) {
    if (variation !== "info.json" && (await fs.stat(path.join(dir, variation))).isDirectory()) {
      const variationDir = path.join(dir, variation)
      const variationInfo = await fs.readJson(path.join(variationDir, "info.json"))
      variationInfo.active = variation === activeVariation
      variationInfo.lastUpdated = new Date().toISOString()
      await fs.writeJson(path.join(variationDir, "info.json"), variationInfo, { spaces: 2 })

      // Convert SCSS to CSS
      const scssFile = path.join(variationDir, "style.scss")
      const cssFile = path.join(variationDir, "style.css")
      if (await fs.pathExists(scssFile)) {
        await convertScssToCSS(scssFile, cssFile)
      }
    }
  }
}

