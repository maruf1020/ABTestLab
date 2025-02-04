import fs from "fs-extra"
import path from "path"
import inquirer from "inquirer"
import chalk from "chalk"
import { fileURLToPath } from "url"
import { ROOT_DIR } from "../config.js"
import { initializeTemplates } from "./init.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates")

export async function createWebsite(websiteName) {
  const websiteDir = path.join(ROOT_DIR, websiteName)
  try {
    await fs.ensureDir(websiteDir)

    const { hostnames } = await inquirer.prompt([
      {
        type: "input",
        name: "hostnames",
        message: "Enter the website host(s) (separate multiple hosts with commas):",
        validate: (input) => input.trim() !== "" || "At least one hostname is required",
      },
    ])

    const hostnameList = hostnames.split(",").map((host) => host.trim())

    await fs.writeJson(path.join(websiteDir, "info.json"), {
      name: websiteName,
      hostnames: hostnameList,
    })
    console.log(
      chalk.green(`Website "${websiteName}" created successfully with hostname(s): ${hostnameList.join(", ")}`),
    )
  } catch (error) {
    console.error(chalk.red(`Failed to create website: ${error.message}`))
    throw error
  }
}

async function ensureTemplatesExist() {
  const templatesExist = await fs.pathExists(TEMPLATES_DIR)
  if (!templatesExist) {
    const { createTemplates } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createTemplates",
        message: "Templates do not exist. Do you want to create them?",
        default: true,
      },
    ])
    if (createTemplates) {
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
      case "Normal":
        variations = await createNormalTest(testDir)
        break
      case "A/B":
        variations = await createABTest(testDir)
        break
      case "Multipage":
        variations = await createMultipageTest(testDir)
        break
    }

    await fs.writeJson(path.join(testDir, "info.json"), { name: testName, type: testType })
    console.log(chalk.green(`Test "${testName}" created successfully for website "${website}".`))

    // Prompt for variation activation
    if (variations.length > 0) {
      await activateVariation(testDir, variations, testType)
    }
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`))
    throw error
  }
}

async function createNormalTest(testDir) {
  const { createVariation } = await inquirer.prompt([
    {
      type: "confirm",
      name: "createVariation",
      message: "Would you like to create a variation?",
      default: true,
    },
  ])

  if (createVariation) {
    return await createVariations(testDir, 1)
  }
  return []
}

async function createABTest(testDir) {
  // Create control
  const controlDir = path.join(testDir, "control")
  await fs.ensureDir(controlDir)
  await fs.copy(path.join(TEMPLATES_DIR, "variation"), controlDir)
  await fs.writeJson(path.join(controlDir, "info.json"), { name: "Control" })

  // Create variations
  return await createVariations(testDir, 1)
}

async function createMultipageTest(testDir) {
  const touchPoints = await createTouchPoints(testDir)
  const variations = await createVariations(testDir, touchPoints.length)

  for (const touchPoint of touchPoints) {
    const touchPointDir = path.join(testDir, touchPoint)

    // Create control for this touch point
    const controlDir = path.join(touchPointDir, "control")
    await fs.ensureDir(controlDir)
    await fs.copy(path.join(TEMPLATES_DIR, "variation"), controlDir)
    await fs.writeJson(path.join(controlDir, "info.json"), { name: "Control" })

    // Create variations for this touch point
    for (const variation of variations) {
      const variationDir = path.join(touchPointDir, variation)
      await fs.ensureDir(variationDir)
      await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
      await fs.writeJson(path.join(variationDir, "info.json"), { name: variation })
    }
  }

  return variations
}

async function createTouchPoints(testDir) {
  const touchPoints = []
  let touchPointCount = 0

  while (true) {
    touchPointCount++

    const response = await inquirer.prompt([
      {
        type: "input",
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
        default: false,
      },
    ])

    touchPoints.push(response.touchPointName)

    const touchPointDir = path.join(testDir, response.touchPointName)
    await fs.ensureDir(touchPointDir)
    await fs.copy(path.join(TEMPLATES_DIR, "touch-point"), touchPointDir)

    if (!response.createAnother) break
  }

  return touchPoints
}

async function createVariations(testDir, touchPointCount) {
  const variations = []
  let variationCount = 0

  while (true) {
    variationCount++

    const response = await inquirer.prompt([
      {
        type: "input",
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
        default: false,
      },
    ])

    variations.push(response.variationName)

    if (touchPointCount === 1) {
      const variationDir = path.join(testDir, response.variationName)
      await fs.ensureDir(variationDir)
      await fs.copy(path.join(TEMPLATES_DIR, "variation"), variationDir)
      await fs.writeJson(path.join(variationDir, "info.json"), { name: response.variationName })
    }

    console.log(chalk.green(`Created variation: ${response.variationName}`))

    if (!response.createAnother) break
  }

  return variations
}

async function activateVariation(testDir, variations, testType) {
  const { activeVariation } = await inquirer.prompt([
    {
      type: "list",
      name: "activeVariation",
      message: "Select a variation to activate:",
      choices: ["None", ...variations],
    },
  ])

  if (activeVariation !== "None") {
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))
    testInfo.activeVariation = activeVariation
    await fs.writeJson(path.join(testDir, "info.json"), testInfo)

    if (testType === "Multipage") {
      const touchPoints = await fs.readdir(testDir)
      for (const touchPoint of touchPoints) {
        const touchPointDir = path.join(testDir, touchPoint)
        if ((await fs.stat(touchPointDir)).isDirectory()) {
          const variationDir = path.join(touchPointDir, activeVariation)
          if (await fs.pathExists(variationDir)) {
            const variationInfo = await fs.readJson(path.join(variationDir, "info.json"))
            variationInfo.active = true
            await fs.writeJson(path.join(variationDir, "info.json"), variationInfo)
          }
        }
      }
    } else {
      const variationDir = path.join(testDir, activeVariation)
      if (await fs.pathExists(variationDir)) {
        const variationInfo = await fs.readJson(path.join(variationDir, "info.json"))
        variationInfo.active = true
        await fs.writeJson(path.join(variationDir, "info.json"), variationInfo)
      }
    }

    console.log(chalk.green(`Activated variation: ${activeVariation}`))
  }
}

