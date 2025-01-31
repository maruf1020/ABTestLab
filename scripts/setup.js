import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, "..", "websites")

async function createFolderStructure() {
  console.log("Setting up initial folder structure...")

  try {
    // Create the root 'websites' folder
    await fs.ensureDir(ROOT_DIR)

    // Create template folders
    const templatesDir = path.join(ROOT_DIR, "_templates")
    await fs.ensureDir(templatesDir)

    // Create template for Normal test
    const normalTestDir = path.join(templatesDir, "normal_test")
    await fs.ensureDir(normalTestDir)
    await fs.ensureDir(path.join(normalTestDir, "Variation_name"))
    await fs.writeFile(path.join(normalTestDir, "Variation_name", "config.js"), "// JavaScript file for targeting")
    await fs.writeFile(
      path.join(normalTestDir, "Variation_name", "style.scss"),
      "/* SCSS file for variation styling */",
    )
    await fs.writeFile(path.join(normalTestDir, "Variation_name", "index.js"), "// JavaScript file for variation logic")
    await fs.writeJson(path.join(normalTestDir, "Variation_name", "info.json"), { name: "Variation Name" })
    await fs.writeJson(path.join(normalTestDir, "info.json"), { type: "Normal Test" })

    // Create template for A/B test
    const abTestDir = path.join(templatesDir, "ab_test")
    await fs.ensureDir(abTestDir)
    await fs.ensureDir(path.join(abTestDir, "config"))
    await fs.writeFile(path.join(abTestDir, "config", "css_targeting.js"), "// JavaScript file for CSS targeting")
    await fs.writeFile(path.join(abTestDir, "config", "js_targeting.js"), "// JavaScript file for JS targeting")
    await fs.writeJson(path.join(abTestDir, "config", "json_targeting.json"), {})
    await fs.ensureDir(path.join(abTestDir, "variation_name"))
    await fs.writeFile(path.join(abTestDir, "variation_name", "style.scss"), "/* SCSS file for variation styling */")
    await fs.writeFile(path.join(abTestDir, "variation_name", "index.js"), "// JavaScript file for variation logic")
    await fs.writeJson(path.join(abTestDir, "variation_name", "info.json"), { name: "Variation Name" })
    await fs.ensureDir(path.join(abTestDir, "control"))
    await fs.writeFile(path.join(abTestDir, "control", "index.js"), "// JavaScript file for control logic")
    await fs.writeJson(path.join(abTestDir, "control", "info.json"), { name: "Control" })
    await fs.writeJson(path.join(abTestDir, "info.json"), { type: "A/B Test" })

    // Create template for Multipage test
    const multipageTestDir = path.join(templatesDir, "multipage_test")
    await fs.ensureDir(multipageTestDir)
    await fs.ensureDir(path.join(multipageTestDir, "Experience_name"))
    await fs.ensureDir(path.join(multipageTestDir, "Experience_name", "targeting"))
    await fs.writeFile(
      path.join(multipageTestDir, "Experience_name", "targeting", "css_targeting.js"),
      "// JavaScript file for CSS targeting",
    )
    await fs.writeFile(
      path.join(multipageTestDir, "Experience_name", "targeting", "js_targeting.js"),
      "// JavaScript file for JS targeting",
    )
    await fs.writeJson(path.join(multipageTestDir, "Experience_name", "targeting", "json_targeting.json"), {})
    await fs.ensureDir(path.join(multipageTestDir, "Experience_name", "variation_name"))
    await fs.writeFile(
      path.join(multipageTestDir, "Experience_name", "variation_name", "style.scss"),
      "/* SCSS file for variation styling */",
    )
    await fs.writeFile(
      path.join(multipageTestDir, "Experience_name", "variation_name", "index.js"),
      "// JavaScript file for variation logic",
    )
    await fs.writeJson(path.join(multipageTestDir, "Experience_name", "variation_name", "info.json"), {
      name: "Variation Name",
    })
    await fs.ensureDir(path.join(multipageTestDir, "Experience_name", "control"))
    await fs.writeFile(
      path.join(multipageTestDir, "Experience_name", "control", "index.js"),
      "// JavaScript file for control logic",
    )
    await fs.writeJson(path.join(multipageTestDir, "Experience_name", "control", "info.json"), { name: "Control" })
    await fs.writeJson(path.join(multipageTestDir, "Experience_name", "info.json"), { name: "Experience Name" })
    await fs.writeJson(path.join(multipageTestDir, "info.json"), { type: "Multipage Test" })

    console.log("Folder structure created successfully!")
  } catch (error) {
    console.error("Error creating folder structure:", error)
  }
}

createFolderStructure()

