import fs, { copy } from "fs-extra"
import path from "path"
import prompts from "prompts"
import kleur from "kleur"
import { ROOT_DIR, SKELETON_DIR } from "../config.js"
import { initializeSkeleton } from "./init.js"
import { bundleVariation, bundleTargeting } from "./bundler.js"
import { changeVariationsNameOnHistory } from "./historyUtils.js"

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
  } else {
    return true;
  }
}

async function copyTargetingFolder(destination) {
  const targetingTemplateDir = path.join(SKELETON_DIR, "targeting")
  await fs.copy(targetingTemplateDir, path.join(destination, "targeting"))
  const targetingDir = path.join(destination, "targeting")
  await bundleTargeting(targetingDir)

  console.log(kleur.green(`Targeting folder created successfully for test "${destination}".`))
}

async function copyVariationFolder(variationTemplateDir, newVariationDataList) {
  return await Promise.all(newVariationDataList.map(async (newVariationData) => {
    try {
      const { pathDir, isTouchPointVariation, newVariationName, testDir, testInfo, touchPointDir, touchPointInfo, websiteName, testName } = newVariationData;
      const destination = path.join(pathDir, newVariationName);
      await fs.copy(variationTemplateDir, destination);

      const info = {
        id: generateId(newVariationName),
        name: newVariationName,
        isVariation: true,
        isTouchPointVariation,
        createdAt: new Date().toISOString(),
        createdAtReadable: new Date().toLocaleString(),
        lastUpdated: new Date().toISOString()
      };

      await fs.writeJson(path.join(destination, "info.json"), info, { spaces: 2 });

      if (!testInfo.variations.includes(newVariationName)) {
        testInfo.variations.push(newVariationName)
      }
      testInfo.lastUpdated = new Date().toISOString();
      await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 });

      if (isTouchPointVariation) {
        if (!touchPointInfo.variations.includes(newVariationName)) {
          touchPointInfo.variations.push(newVariationName);
        }
        touchPointInfo.lastUpdated = new Date().toISOString();
        await fs.writeJson(path.join(touchPointDir, "info.json"), touchPointInfo, { spaces: 2 });
      }

      await bundleVariation(destination);

      console.log(kleur.green(`Variation "${newVariationName}" created successfully for test "${testName}" in website "${websiteName}".`));

      return info;
    } catch (error) {
      console.error(kleur.red(`Error copying variation: ${error.message}`));
      throw error;
    }
  }));
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

    await copyTargetingFolder(testDir)

    const testInfo = {
      id: generateId(testName),
      name: testName,
      type: testType,
      website: website,
      variations: [],
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    }

    if (testType === "Multi-touch") {
      testInfo.touchPoints = []
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
        await createTouchPoint(website, testName, "control")
        await createVariation(website, testName, variationName)
        break
      case "Patch":
        await createVariation(website, testName, variationName)
        break
    }

    console.log(kleur.green(`Test "${testName}" created successfully for website "${website}".`))

    return testInfo;

  } catch (error) {
    console.error(kleur.red(`Failed to create test: ${error.message}`))
    throw error
  }
}

export async function createVariation(website, test, newVariationName, touchPointName = null) {
  try {
    let newVariationDataList;

    const variationTemplateDir = path.join(SKELETON_DIR, "variation", "default");
    const testDir = path.join(ROOT_DIR, website, test);
    await fs.ensureDir(testDir);
    const testInfo = await fs.readJson(path.join(testDir, "info.json"));

    if (testInfo.type === "Multi-touch") {
      if (touchPointName) {
        const touchPointDir = path.join(testDir, touchPointName);
        await fs.ensureDir(touchPointDir);
        const touchPointInfo = await fs.readJson(path.join(touchPointDir, "info.json"));

        newVariationDataList = [{
          pathDir: touchPointDir,
          isTouchPointVariation: true,
          newVariationName,
          testDir,
          testInfo,
          touchPointDir,
          touchPointInfo,
          websiteName: website,
          testName: test
        }];
      } else {
        newVariationDataList = await Promise.all(
          testInfo.touchPoints.map(async (touchPoint) => {
            const touchPointDir = path.join(testDir, touchPoint);
            await fs.ensureDir(touchPointDir);
            const touchPointInfo = await fs.readJson(path.join(touchPointDir, "info.json"));

            return {
              pathDir: touchPointDir,
              isTouchPointVariation: true,
              newVariationName,
              testDir,
              testInfo,
              touchPointDir,
              touchPointInfo,
              websiteName: website,
              testName: test
            };
          })
        );
      }
    } else {
      newVariationDataList = [{
        pathDir: testDir,
        isTouchPointVariation: false,
        newVariationName,
        testDir,
        testInfo,
        touchPointDir: null,
        touchPointInfo: null,
        websiteName: website,
        testName: test
      }];
    }
    return await copyVariationFolder(variationTemplateDir, newVariationDataList);

  } catch (error) {
    console.error(kleur.red(`Failed to create variation: ${error.message}`));
    throw error;
  }
}

export async function createTouchPoint(website, test, touchPointName) {
  try {
    const testDir = path.join(ROOT_DIR, website, test);
    await fs.ensureDir(testDir);

    const testInfoDir = path.join(testDir, "info.json");
    const testInfo = await fs.readJson(testInfoDir);

    const touchPointDir = path.join(testDir, touchPointName);
    await fs.ensureDir(touchPointDir);
    await copyTargetingFolder(touchPointDir);

    const touchPointInfoDir = path.join(touchPointDir, "info.json");

    const touchPointInfo = {
      id: generateId(touchPointName),
      name: touchPointName,
      isTouchPoint: true,
      variations: [...testInfo.variations], // ✅ Copy variations from testInfo
      createdAt: new Date().toISOString(),
      createdAtReadable: new Date().toLocaleString(),
      lastUpdated: new Date().toISOString(),
    };

    await fs.writeJson(touchPointInfoDir, touchPointInfo, { spaces: 2 });

    testInfo.touchPoints.push(touchPointName);
    await fs.writeJson(testInfoDir, testInfo, { spaces: 2 });

    const availableVariations = testInfo.variations;
    await Promise.all(
      availableVariations.map(async (variationName) =>
        await createVariation(website, test, variationName, touchPointName)
      )
    );

    console.log(kleur.green(`TouchPoint "${touchPointName}" created successfully for test "${test}" in website "${website}".`));

    return touchPointInfo;
  } catch (error) {
    console.error(kleur.red(`Failed to create touchPoint: ${error.message}`));
    throw error;
  }
}


export async function renameVariation(website, test, variation, newName) {
  const info = [];
  try {
    const testDir = path.join(ROOT_DIR, website, test);
    const testInfo = await fs.readJson(path.join(testDir, "info.json"));

    testInfo.variations = testInfo.variations.map((v) => (v === variation ? newName : v));
    testInfo.lastUpdated = new Date().toISOString();
    await fs.writeJson(path.join(testDir, "info.json"), testInfo, { spaces: 2 });

    if (testInfo.type === "Multi-touch") {
      const touchPoints = testInfo.touchPoints;
      if (touchPoints.length >= 1) {
        await Promise.all(touchPoints.map(async (touchPoint) => {
          const VariationDir = path.join(testDir, touchPoint, variation);
          if (await fs.pathExists(VariationDir)) {
            await updateName(VariationDir, newName);
          }
          const touchPointDir = path.join(testDir, touchPoint);
          const touchPointInfo = await fs.readJson(path.join(touchPointDir, "info.json"));
          touchPointInfo.variations = touchPointInfo.variations.map((v) => (v === variation ? newName : v));
          touchPointInfo.lastUpdated = new Date().toISOString();
          await fs.writeJson(path.join(touchPointDir, "info.json"), touchPointInfo, { spaces: 2 });
        }));
      }
    } else {
      const variationDir = path.join(testDir, variation);
      await updateName(variationDir, newName);
    }

    async function updateName(variationDir, newName) {
      const variationInfo = await fs.readJson(path.join(variationDir, "info.json"));
      variationInfo.name = newName;
      variationInfo.lastUpdated = new Date().toISOString();
      info.push(variationInfo);
      await fs.writeJson(path.join(variationDir, "info.json"), variationInfo, { spaces: 2 });
      await fs.rename(variationDir, path.join(path.dirname(variationDir), newName));
    }

    await changeVariationsNameOnHistory({ website, test, variation, testType: testInfo.type }, newName);

    console.log(kleur.green(`Variation "${variation}" renamed to "${newName}" successfully for test "${test}" in website "${website}".`));

    return info;
  } catch (error) {
    console.error(kleur.red(`Failed to rename variation: ${error.message}`));
    throw error;
  }
}
