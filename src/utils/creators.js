import fs from "fs-extra"
import path from "path"
import inquirer from "inquirer"
import { ROOT_DIR } from "../config.js"

export async function createWebsite(websiteName) {
  const websiteDir = path.join(ROOT_DIR, websiteName)
  await fs.ensureDir(websiteDir)
  await fs.writeJson(path.join(websiteDir, "info.json"), { name: websiteName })
}

export async function createTest(website, testName, testType) {
  const testDir = path.join(ROOT_DIR, website, testName)
  await fs.ensureDir(testDir)

  const templateDir = path.join(ROOT_DIR, "_templates", `${testType.toLowerCase()}_test`)

  if (!(await fs.pathExists(templateDir))) {
    await createTemplateDirectory(templateDir, testType)
  }

  await fs.copy(templateDir, testDir)

  switch (testType) {
    case "Normal":
      await createNormalTestVariations(testDir)
      break
    case "A/B":
      await createABTestVariations(testDir)
      break
    case "Multipage":
      await createMultipageTestExperiences(testDir)
      break
  }

  await fs.writeJson(path.join(testDir, "info.json"), { name: testName, type: testType })
}

async function createNormalTestVariations(testDir) {
  let createAnother = true
  let variationCount = 0

  while (createAnother) {
    variationCount++
    const { variationName } = await inquirer.prompt([
      {
        type: "input",
        name: "variationName",
        message: `Enter the name for Variation ${variationCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Variation name cannot be empty"
          const variationDir = path.join(testDir, input)
          if (await fs.pathExists(variationDir)) return "A variation with this name already exists"
          return true
        },
      },
    ])

    await fs.move(path.join(testDir, "Variation_name"), path.join(testDir, variationName))

    const { createAnotherVariation } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createAnotherVariation",
        message: "Do you want to create another variation?",
        default: false,
      },
    ])

    createAnother = createAnotherVariation

    if (createAnother) {
      await fs.copy(
        path.join(ROOT_DIR, "_templates", "normal_test", "Variation_name"),
        path.join(testDir, "Variation_name"),
      )
    }
  }
}

async function createABTestVariations(testDir) {
  let createAnother = true
  let variationCount = 0

  while (createAnother) {
    variationCount++
    const { variationName } = await inquirer.prompt([
      {
        type: "input",
        name: "variationName",
        message: `Enter the name for Variation ${variationCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Variation name cannot be empty"
          const variationDir = path.join(testDir, input)
          if (await fs.pathExists(variationDir)) return "A variation with this name already exists"
          return true
        },
      },
    ])

    await fs.move(path.join(testDir, "variation_name"), path.join(testDir, variationName))

    const { createAnotherVariation } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createAnotherVariation",
        message: "Do you want to create another variation?",
        default: false,
      },
    ])

    createAnother = createAnotherVariation

    if (createAnother) {
      await fs.copy(
        path.join(ROOT_DIR, "_templates", "ab_test", "variation_name"),
        path.join(testDir, "variation_name"),
      )
    }
  }
}

async function createMultipageTestExperiences(testDir) {
  let createAnotherExperience = true
  let experienceCount = 0

  while (createAnotherExperience) {
    experienceCount++
    const { experienceName } = await inquirer.prompt([
      {
        type: "input",
        name: "experienceName",
        message: `Enter the name for Experience ${experienceCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Experience name cannot be empty"
          const experienceDir = path.join(testDir, input)
          if (await fs.pathExists(experienceDir)) return "An experience with this name already exists"
          return true
        },
      },
    ])

    await fs.move(path.join(testDir, "Experience_name"), path.join(testDir, experienceName))

    await createMultipageTestVariations(path.join(testDir, experienceName))

    const { createAnother } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createAnother",
        message: "Do you want to create another experience?",
        default: false,
      },
    ])

    createAnotherExperience = createAnother

    if (createAnotherExperience) {
      await fs.copy(
        path.join(ROOT_DIR, "_templates", "multipage_test", "Experience_name"),
        path.join(testDir, "Experience_name"),
      )
    }
  }
}

async function createMultipageTestVariations(experienceDir) {
  let createAnotherVariation = true
  let variationCount = 0

  while (createAnotherVariation) {
    variationCount++
    const { variationName } = await inquirer.prompt([
      {
        type: "input",
        name: "variationName",
        message: `Enter the name for Variation ${variationCount}:`,
        validate: async (input) => {
          if (input.trim() === "") return "Variation name cannot be empty"
          const variationDir = path.join(experienceDir, input)
          if (await fs.pathExists(variationDir)) return "A variation with this name already exists"
          return true
        },
      },
    ])

    await fs.move(path.join(experienceDir, "variation_name"), path.join(experienceDir, variationName))

    const { createAnother } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createAnother",
        message: "Do you want to create another variation for this experience?",
        default: false,
      },
    ])

    createAnotherVariation = createAnother

    if (createAnotherVariation) {
      await fs.copy(
        path.join(ROOT_DIR, "_templates", "multipage_test", "Experience_name", "variation_name"),
        path.join(experienceDir, "variation_name"),
      )
    }
  }
}

async function createTemplateDirectory(templateDir, testType) {
  await fs.ensureDir(templateDir)

  switch (testType) {
    case "Normal":
      await fs.ensureDir(path.join(templateDir, "Variation_name"))
      await fs.writeFile(path.join(templateDir, "Variation_name", "config.js"), "// JavaScript file for targeting")
      await fs.writeFile(
        path.join(templateDir, "Variation_name", "style.scss"),
        "/* SCSS file for variation styling */",
      )
      await fs.writeFile(path.join(templateDir, "Variation_name", "index.js"), "// JavaScript file for variation logic")
      await fs.writeJson(path.join(templateDir, "Variation_name", "info.json"), { name: "Variation Name" })
      await fs.writeJson(path.join(templateDir, "info.json"), { type: "Normal Test" })
      break
    case "A/B":
      await fs.ensureDir(path.join(templateDir, "config"))
      await fs.writeFile(path.join(templateDir, "config", "css_targeting.js"), "// JavaScript file for CSS targeting")
      await fs.writeFile(path.join(templateDir, "config", "js_targeting.js"), "// JavaScript file for JS targeting")
      await fs.writeJson(path.join(templateDir, "config", "json_targeting.json"), {})
      await fs.ensureDir(path.join(templateDir, "variation_name"))
      await fs.writeFile(
        path.join(templateDir, "variation_name", "style.scss"),
        "/* SCSS file for variation styling */",
      )
      await fs.writeFile(path.join(templateDir, "variation_name", "index.js"), "// JavaScript file for variation logic")
      await fs.writeJson(path.join(templateDir, "variation_name", "info.json"), { name: "Variation Name" })
      await fs.ensureDir(path.join(templateDir, "control"))
      await fs.writeFile(path.join(templateDir, "control", "index.js"), "// JavaScript file for control logic")
      await fs.writeJson(path.join(templateDir, "control", "info.json"), { name: "Control" })
      await fs.writeJson(path.join(templateDir, "info.json"), { type: "A/B Test" })
      break
    case "Multipage":
      await fs.ensureDir(path.join(templateDir, "Experience_name"))
      await fs.ensureDir(path.join(templateDir, "Experience_name", "targeting"))
      await fs.writeFile(
        path.join(templateDir, "Experience_name", "targeting", "css_targeting.js"),
        "// JavaScript file for CSS targeting",
      )
      await fs.writeFile(
        path.join(templateDir, "Experience_name", "targeting", "js_targeting.js"),
        "// JavaScript file for JS targeting",
      )
      await fs.writeJson(path.join(templateDir, "Experience_name", "targeting", "json_targeting.json"), {})
      await fs.ensureDir(path.join(templateDir, "Experience_name", "variation_name"))
      await fs.writeFile(
        path.join(templateDir, "Experience_name", "variation_name", "style.scss"),
        "/* SCSS file for variation styling */",
      )
      await fs.writeFile(
        path.join(templateDir, "Experience_name", "variation_name", "index.js"),
        "// JavaScript file for variation logic",
      )
      await fs.writeJson(path.join(templateDir, "Experience_name", "variation_name", "info.json"), {
        name: "Variation Name",
      })
      await fs.ensureDir(path.join(templateDir, "Experience_name", "control"))
      await fs.writeFile(
        path.join(templateDir, "Experience_name", "control", "index.js"),
        "// JavaScript file for control logic",
      )
      await fs.writeJson(path.join(templateDir, "Experience_name", "control", "info.json"), { name: "Control" })
      await fs.writeJson(path.join(templateDir, "Experience_name", "info.json"), { name: "Experience Name" })
      await fs.writeJson(path.join(templateDir, "info.json"), { type: "Multipage Test" })
      break
  }
}

