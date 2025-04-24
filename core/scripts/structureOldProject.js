import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

const projectRoot = process.cwd();

const oldPath = path.join(projectRoot, "src");
const newPath = path.join(projectRoot, "websites");
const targetingPath = path.join(projectRoot, "skeleton", "targeting");

export async function structureOldProject() {
    console.log(chalk.yellow("Structuring old project..."));


    //CHANGE THE "src" NAME TO "websites"
    const oldExists = await fs.pathExists(oldPath);
    const newExists = await fs.pathExists(newPath);

    if (!oldExists) {
        console.log(chalk.red(`❌ Source folder does not exist: ${oldPath}`));
        return;
    }

    if (newExists) {
        console.log(chalk.yellow(`⚠️ Destination folder already exists: ${newPath}`));
        return;
    }

    try {
        await fs.rename(oldPath, newPath);
        console.log(chalk.green(`✅ Folder renamed to 'websites'`));
    } catch (err) {
        console.error(chalk.red("❌ Error during renaming:"), err);
        return;
    }

    console.log(chalk.cyan("🔄 Updating all nested info.json files..."));


    // UPDATE ALL WEBSITE FOLDERS "info.json" FILES
    console.log(chalk.cyan("🔄 Updating info.json files in all website folders..."));

    const subfolders = await fs.readdir(newPath);

    for (const folder of subfolders) {
        const folderPath = path.join(newPath, folder);
        const infoPath = path.join(folderPath, "info.json");

        const exists = await fs.pathExists(infoPath);
        if (!exists) {
            console.log(chalk.yellow(`⚠️ Skipping ${folder}: info.json not found.`));
            continue;
        }

        try {
            const data = await fs.readJson(infoPath);
            const { name, lastUpdated } = data;

            const date = new Date(lastUpdated);
            const id = `${lastUpdated}_${Math.floor(1000 + Math.random() * 9000)}_${name}`;
            const isoDate = date.toISOString();
            const readableDate = date.toLocaleString("en-GB", {
                timeZone: "Asia/Dhaka",
                hour12: true,
            });

            const newData = {
                id,
                name,
                hostnames: [name.toLowerCase().replace(/\s+/g, "")],
                createdAt: isoDate,
                createdAtReadable: readableDate,
                lastUpdated: isoDate,
            };

            await fs.writeJson(infoPath, newData, { spaces: 2 });
            console.log(chalk.green(`✅ Updated: ${folder}/info.json`));
        } catch (err) {
            console.error(chalk.red(`❌ Failed to update ${folder}/info.json:`), err);
        }
    }



    // UPDATE ALL TEST FOLDERS "info.json" FILES
    const brands = await fs.readdir(newPath);

    for (const brand of brands) {
        const brandPath = path.join(newPath, brand);
        const isDir = (await fs.stat(brandPath)).isDirectory();
        if (!isDir) continue;

        const testFolders = await fs.readdir(brandPath);

        for (const testFolder of testFolders) {
            const testPath = path.join(brandPath, testFolder);
            const infoPath = path.join(testPath, "info.json");

            const isTestDir = (await fs.stat(testPath)).isDirectory();
            if (!isTestDir || !(await fs.pathExists(infoPath))) continue;

            // ✅ Initialize variations array here
            const variations = [];

            // ✅ Get all variation child folders inside this test folder
            const variationCandidates = await fs.readdir(testPath);

            for (const candidate of variationCandidates) {
                const candidatePath = path.join(testPath, candidate);
                const candidateInfoPath = path.join(candidatePath, "info.json");

                const isCandidateDir = (await fs.stat(candidatePath)).isDirectory();
                if (isCandidateDir && await fs.pathExists(candidateInfoPath)) {
                    variations.push(candidate); // Add valid child folder names to variations
                }
            }

            // Now process the info.json file and update it
            try {
                const data = await fs.readJson(infoPath);
                const { name, lastUpdated } = data;

                const date = new Date(lastUpdated);
                const id = `${lastUpdated}_${Math.floor(1000 + Math.random() * 9000)}_${name}`;
                const isoDate = date.toISOString();
                const readableDate = date.toLocaleString("en-GB", {
                    timeZone: "Asia/Dhaka",
                    hour12: true,
                });

                const updatedData = {
                    id,
                    name,
                    type: "A/B",
                    website: brand,
                    variations, // Pass variations here after collecting valid ones
                    createdAt: isoDate,
                    createdAtReadable: readableDate,
                    lastUpdated: isoDate,
                };

                await fs.writeJson(infoPath, updatedData, { spaces: 2 });

                // Create skeleton directory
                const targetingFolderPath = path.join(testPath, 'targeting');
                await fs.ensureDir(targetingFolderPath);
                await fs.copy(targetingPath, targetingFolderPath, { overwrite: true });

                console.log(chalk.green(`✅ Updated: ${brand}/${testFolder}/info.json`));
            } catch (err) {
                console.error(chalk.red(`❌ Failed to update ${brand}/${testFolder}/info.json:`), err);
            }
        }
    }


    // UPDATE ALL VARIATION FOLDERS "info.json" FILES 
    for (const brand of brands) {
        const brandPath = path.join(newPath, brand);
        const isDir = (await fs.stat(brandPath)).isDirectory();
        if (!isDir) continue;

        const testFolders = await fs.readdir(brandPath);

        for (const testFolder of testFolders) {
            const testPath = path.join(brandPath, testFolder);
            const isTestDir = (await fs.stat(testPath)).isDirectory();
            if (!isTestDir) continue;

            // Get all variation folders inside each test folder
            const variationFolders = await fs.readdir(testPath);

            for (const variation of variationFolders) {
                const variationPath = path.join(testPath, variation);
                const variationInfoPath = path.join(variationPath, "info.json");
                const isVariationDir = (await fs.stat(variationPath)).isDirectory();
                const stylesPath = path.join(variationPath, "styles");
                const compiledPath = path.join(variationPath, "compiled");

                // Check if it's a valid variation folder
                if (isVariationDir && await fs.pathExists(variationInfoPath)) {
                    console.log(chalk.cyan(`Processing variation: ${variation}`));

                    // Create the "compiled" folder inside the variation folder
                    await fs.ensureDir(compiledPath);

                    // Copy "index.js" to the "compiled" folder
                    const indexJsPath = path.join(variationPath, "index.js");
                    if (await fs.pathExists(indexJsPath)) {
                        await fs.copy(indexJsPath, path.join(compiledPath, "index.js"));
                        console.log(chalk.green(`✅ Copied index.js to compiled folder for ${variation}`));
                    }

                    // Copy "index.css" to "compiled" folder and rename it to "style.css"
                    const indexCssPath = path.join(stylesPath, "index.css");
                    if (await fs.pathExists(indexCssPath)) {
                        await fs.copy(indexCssPath, path.join(compiledPath, "style.css"));
                        console.log(chalk.green(`✅ Copied index.css as style.css to compiled folder for ${variation}`));
                    }

                    // Copy "index.scss" to the variation folder and rename it to "style.scss"
                    const indexScssPath = path.join(stylesPath, "index.scss");
                    if (await fs.pathExists(indexScssPath)) {
                        await fs.copy(indexScssPath, path.join(variationPath, "style.scss"));
                        console.log(chalk.green(`✅ Copied index.scss as style.scss to variation folder for ${variation}`));
                    }

                    // Delete the "styles" folder inside the variation folder
                    if (await fs.pathExists(stylesPath)) {
                        await fs.remove(stylesPath);
                        console.log(chalk.green(`✅ Deleted styles folder for ${variation}`));
                    }

                    // Update the "index.js" to remove the import statement
                    const indexJsContent = await fs.readFile(indexJsPath, "utf-8");
                    const updatedIndexJsContent = indexJsContent.replace(
                        /import\s+['"]\.\/styles\/index\.scss['"]\s*;?\s*(\/\*\s*DO NOT IMPORT ANYTHING\s*\*\/)?/g,
                        ''
                    );

                    await fs.writeFile(indexJsPath, updatedIndexJsContent, "utf-8");
                    console.log(chalk.green(`✅ Updated index.js for ${variation}`));

                    // Update the "info.json" file inside the variation folder
                    try {
                        const data = await fs.readJson(variationInfoPath);
                        const { name, lastUpdated } = data;

                        // Convert lastUpdated to the desired format
                        const date = new Date(lastUpdated);
                        const isoDate = date.toISOString();
                        const readableDate = date.toLocaleString("en-GB", {
                            timeZone: "Asia/Dhaka",
                            hour12: true,
                        });

                        const updatedData = {
                            id: `${lastUpdated}_${Math.floor(1000 + Math.random() * 9000)}_${name}`,
                            name,
                            isVariation: true,
                            isTouchPointVariation: false,
                            createdAt: isoDate,
                            createdAtReadable: readableDate,
                            lastUpdated: isoDate,
                        };

                        await fs.writeJson(variationInfoPath, updatedData, { spaces: 2 });
                        console.log(chalk.green(`✅ Updated info.json for ${variation}`));
                    } catch (err) {
                        console.error(chalk.red(`❌ Failed to update info.json for ${variation}:`), err);
                    }
                }
            }
        }
    }


    console.log(chalk.cyan("🎉 All info.json files successfully updated!"));
}



