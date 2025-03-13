import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createSkeleton() {
    const skeletonDir = path.resolve(__dirname, "..", "..", "skeleton")

    // Create skeleton directory
    await fs.ensureDir(skeletonDir)


    // Create variation template
    const variationDir = path.join(skeletonDir, "variation", "default")
    await fs.ensureDir(variationDir)

    // Copy default image of variation
    const variationTemplateDir = path.join(__dirname, "..", "templates", "variation");
    const variationFiles = ["index.js", "style.scss", "info.json"];

    // Verify template files exist
    if (!fs.existsSync(variationTemplateDir) || !variationFiles.every(file => fs.existsSync(path.join(variationTemplateDir, file)))) {
        throw new Error("Template files are missing or templates directory doesn't exist");
    }

    // Copy template files to variation directory
    await Promise.all(variationFiles.map(async file => {
        await fs.copyFile(
            path.join(variationTemplateDir, file),
            path.join(variationDir, file)
        );
    }));


    // Create targeting template
    const targetingDir = path.join(skeletonDir, "targeting")
    await fs.ensureDir(targetingDir)

    // Copy default image of targeting
    const targetingTemplateDir = path.join(__dirname, "..", "templates", "targeting");
    const targetingFiles = ["customJS.js", "elementChecker.json", "urlChecker.json"];

    // Verify template files exist
    if (!fs.existsSync(targetingTemplateDir) || !targetingFiles.every(file => fs.existsSync(path.join(targetingTemplateDir, file)))) {
        throw new Error("Template files are missing or templates directory doesn't exist");
    }

    // Copy template files to targeting directory
    await Promise.all(targetingFiles.map(async file => {
        await fs.copyFile(
            path.join(targetingTemplateDir, file),
            path.join(targetingDir, file)
        );
    }));


    // Create targetMet folder
    const targetMetDir = path.join(skeletonDir, "targetMet")
    await fs.ensureDir(targetMetDir)

    // Copy default image of targetMet
    const targetMetTemplateDir = path.join(__dirname, "..", "templates", "targetMet");
    const targetMetFiles = ["customJS.js", "elementChecker.js", "urlChecker.js"];

    // Verify template files exist
    if (!fs.existsSync(targetMetTemplateDir) || !targetMetFiles.every(file => fs.existsSync(path.join(targetMetTemplateDir, file)))) {
        throw new Error("Template files are missing or templates directory doesn't exist");
    }

    // Copy template files to targetMet directory
    await Promise.all(targetMetFiles.map(async file => {
        await fs.copyFile(
            path.join(targetMetTemplateDir, file),
            path.join(targetMetDir, file)
        );
    }));

    console.log(chalk.green("Skeleton folders and files created successfully!"))
}