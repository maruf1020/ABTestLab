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

export async function createWebsite(websiteName) {
  const websiteDir = path.join(ROOT_DIR, websiteName)
  try {
    await fs.ensureDir(websiteDir)

    const response = await prompts({
      type: "text",
      name: "hostnames",
      message: "Enter the website host(s) (separate multiple hosts with commas):",
      validate: (input) => input.trim() !== "" || "At least one hostname is required",
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

async function ensureTemplatesExist() {
  const templatesExist = await fs.pathExists(TEMPLATES_DIR)
  if (!templatesExist) {
    const response = await prompts({
      type: "confirm",
      name: "createTemplates",
      message: "Templates do not exist. Do you want to create them?",
      initial: true,
    })
    if (response.createTemplates) {
      await initializeTemplates()
    } else {
      throw new Error('Templates are required to create tests. Please run "npm run cli init" to create templates.')
    }
  }
}

export async function createTest(website, testName, testType) {
  try {
    await ensureTemplatesExist()
    const testDir = path.join(ROOT_DIR, website, testName)
    await fs.ensureDir(testDir)

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
      testInfo.touchpoints = await fs.readdir(testDir)
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
  // Create control
  const controlDir = path.join(testDir, "control")
  await fs.ensureDir(controlDir)
  await fs.copy(path.join(TEMPLATES_DIR, "variation"), controlDir)
  await fs.writeJson(
    path.join(controlDir, "info.json"),
    {
      name: "Control",
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    },
    { spaces: 2 },
  )
  console.log(kleur.green("Control variation created successfully."))

  // Create variations
  return await createVariations(testDir, 1)
}

async function createAATest(testDir) {
  return await createVariations(testDir, 1)
}

async function createMultipageTest(testDir) {
  const touchPoints = await createTouchPoints(testDir)
  const variations = await createVariations(testDir, touchPoints.length)

  for (const touchPoint of touchPoints) {
    const touchPointDir = path.join(testDir, touchPoint)

    // Create variations for this touch point
    for (const variation of variations) {
      const variationDir = path.join(touchPointDir, variation)
      await fs.ensureDir(variationDir)
      await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
      await fs.writeJson(
        path.join(variationDir, "info.json"),
        {
          name: variation,
          createdAt: new Date().toISOString(),
          createdAtReadable: new Date().toLocaleString(),
          lastUpdated: new Date().toISOString(),
        },
        { spaces: 2 },
      )
    }

    await fs.writeJson(
      path.join(touchPointDir, "info.json"),
      {
        name: touchPoint,
        variations: variations,
        createdAt: new Date().toISOString(),
        createdAtReadable: new Date().toLocaleString(),
        lastUpdated: new Date().toISOString(),
      },
      { spaces: 2 },
    )
    console.log(kleur.green(`Touch point "${touchPoint}" created successfully.`))
  }

  return variations
}

async function createPatchTest(testDir) {
  const variationName = "patch"
  const variationDir = path.join(testDir, variationName)
  await fs.ensureDir(variationDir)
  await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
  await fs.writeJson(
    path.join(variationDir, "info.json"),
    {
      name: variationName,
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    },
    { spaces: 2 },
  )
  console.log(kleur.green(`Patch variation "${variationName}" created successfully.`))
  return [variationName]
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

    if (touchPointCount === 1) {
      const variationDir = path.join(testDir, response.variationName)
      await fs.ensureDir(variationDir)
      await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
      await fs.writeJson(
        path.join(variationDir, "info.json"),
        {
          name: response.variationName,
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

async function activateVariation(testDir, variations, testType) {
  const response = await prompts({
    type: "select",
    name: "activeVariation",
    message: "Select a variation to activate:",
    choices: [{ title: "None", value: "None" }, ...variations.map((v) => ({ title: v, value: v }))],
  })

  const activeVariation = response.activeVariation

  if (activeVariation !== "None") {
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

