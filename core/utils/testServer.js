import http, { get } from "http"
import { Server } from "socket.io"
import fs from "fs-extra"
import path from "path"
import chokidar from "chokidar"
import { ROOT_DIR } from "../config.js"
import debug from "debug"
import { fileURLToPath } from "url"
import kleur from "kleur"
import { bundleVariation } from "./bundler.js"
import browserScriptCreator from "./browserScriptCreator.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const log = debug("ab-testing-cli:testServer")

export async function startTestServer(selectedVariations) {

    const testInfo = await Promise.all(selectedVariations.map(async selectedVariation => {
        if (selectedVariation.testType === "Multi-touch") {
            const touchPointsDir = await getTouchPointsDir(selectedVariation);
            return touchPointsDir;
        } else {
            const variationDir = await getVariationDir(selectedVariation);
            return variationDir;
        }
    })).then(results => results.flat());

    const transformedTestInfo = await transformTestInfo(testInfo);

    await browserScriptCreator(transformedTestInfo);

    const server = http.createServer(async (req, res) => {
        if (req.url === "/ab-test-script.js") {
            const scriptPath = path.join(__dirname, "..", "browser-script.js");
            const content = await fs.readFile(scriptPath, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
        } else if (req.url === "/socket-io-client.js") {
            const socketIoClientPath = path.join(__dirname, "..", "public", "js", "vendor", "socket-io-client.js");
            const content = await fs.readFile(socketIoClientPath, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
        } else if (req.url === "/ab-pilot-script.js") {
            const scriptPath = path.join(__dirname, "..", "browser-Runner.js");
            const content = await fs.readFile(scriptPath, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    });

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    //want to start the server here
    server.listen(3000, () => {
        log("Server running on http://localhost:3000");
    });
}
async function transformTestInfo(testInfo) {
    const parentTargetingMap = new Map();

    // Process items with parentTargetingId
    const itemsWithParentTargeting = testInfo.filter(item => item.parentTargetingId);

    for (const item of itemsWithParentTargeting) {
        if (!parentTargetingMap.has(item.parentTargetingId)) {
            const targetingFiles = await getTargetingFiles(item.parentTargeting);
            parentTargetingMap.set(item.parentTargetingId, {
                targeting: item.parentTargeting,
                parentTargetingId: item.parentTargetingId,
                variationIdList: [],
                targetingFiles
            });
        }
        parentTargetingMap.get(item.parentTargetingId).variationIdList.push(item.id);
    }
    const targetingCheckDir = path.join(ROOT_DIR, "..", "skeleton", "default", "targetMet");

    // Process all testInfo items
    const finalTestInfo = await Promise.all(
        testInfo.map(async item => ({
            variationDir: item.variationDir,
            compiledDir: path.join(item.variationDir, "compiled"),
            targetingDir: item.targetingDir,
            id: item.id,
            testType: item.testType,
            hostnames: item.hostnames,
            variationFiles: await getVariationFiles(item.variationDir),
            targetingFiles: await getTargetingFiles(item.targetingDir),
        }))
    );

    return {
        parentTargeting: Array.from(parentTargetingMap.values()),
        targetMet: await getTargetMetFiles(targetingCheckDir),
        testInfo: finalTestInfo,
    };
}

async function getVariationFiles(variationDir) {
    const compiledDir = path.join(variationDir, "compiled");
    const cssFile = path.join(compiledDir, "style.css");
    const jsFile = path.join(compiledDir, "index.js");

    try {
        const css = await fs.readFile(cssFile, "utf-8")
        const js = await fs.readFile(jsFile, "utf-8")

        return {
            css,
            js
        };
    } catch (error) {
        console.error("Error reading variation files:", error);
        return {
            css: "",
            js: ""
        };
    }
}

async function getTargetingFiles(targetingDir) {
    if (!targetingDir) {
        return null;
    }

    const customJSPath = path.join(targetingDir, "customJS.js");
    const elementCheckerPath = path.join(targetingDir, "elementChecker.json");
    const urlCheckerPath = path.join(targetingDir, "urlChecker.json");

    try {
        // Dynamically import customJS.js
        const customJSModule = await import(`file://${customJSPath}`);
        const customJS = customJSModule.default; // Get the default exported function

        const elementChecker = await fs.readJson(elementCheckerPath);
        const urlChecker = await fs.readJson(urlCheckerPath);

        return {
            "customJS": customJS.toString(),
            elementChecker,
            urlChecker
        };
    } catch (error) {
        console.error("Error reading targeting files:", error);
        return {
            customJS: () => { }, // Return an empty function as a fallback
            elementChecker: {},
            urlChecker: {}
        };
    }
}

async function getTargetMetFiles(targetingCheckDir) {
    if (!targetingCheckDir) {
        return null;
    }

    const customJSPath = path.join(targetingCheckDir, "customJS.js");
    const elementCheckerPath = path.join(targetingCheckDir, "elementChecker.js");
    const urlCheckerPath = path.join(targetingCheckDir, "urlChecker.js");

    try {
        // Dynamically import customJS.js
        const customJSModule = await import(`file://${customJSPath}`);
        const elementCheckerModule = await import(`file://${elementCheckerPath}`);
        const urlCheckerModule = await import(`file://${urlCheckerPath}`);

        const customJS = customJSModule.default;
        const elementChecker = elementCheckerModule.default;
        const urlChecker = urlCheckerModule.default;

        return {
            "customJS": customJS.toString(),
            "elementChecker": elementChecker.toString(),
            "urlChecker": urlChecker.toString()
        };
    } catch (error) {
        console.error("Error reading targeting files:", error);
        return {
            customJS: () => { }, // Return an empty function as a fallback
            elementChecker: {},
            urlChecker: {}
        };
    }
}

async function getVariationDir(selectedVariation) {
    const variationDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test, selectedVariation.variation);
    const infoPath = path.join(variationDir, "info.json");
    const targetingDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test, "targeting");

    try {
        // Check if info file exists
        if (await fs.existsSync(infoPath)) {
            const info = await fs.readJson(infoPath);
            const id = info.id;
            const webSiteDir = path.join(ROOT_DIR, selectedVariation.website);
            const webSiteInfo = await fs.readJson(path.join(webSiteDir, "info.json"));
            const hostnames = webSiteInfo.hostnames;
            const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test);
            const testInfo = await fs.readJson(path.join(testDir, "info.json"));
            const testType = testInfo.type;

            return {
                variationDir,
                targetingDir: await fs.existsSync(targetingDir) ? targetingDir : null,
                id,
                hostnames,
                testType
            };
        }
        return null;
    } catch (error) {
        console.error(`Error reading info file:`, error);
        return null;
    }
}

async function getTouchPointsDir(selectedVariation) {
    const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test);
    const touchPoints = await fs.readdir(testDir);
    const websiteDir = path.join(ROOT_DIR, selectedVariation.website);
    const websiteInfo = await fs.readJson(path.join(websiteDir, "info.json"));
    const hostnames = websiteInfo.hostnames;
    const touchPointsDir = await Promise.all(
        touchPoints.filter(touchPoint => touchPoint !== "targeting").map(async touchPoint => {
            const variationDir = path.join(testDir, touchPoint, selectedVariation.variation);
            const infoPath = path.join(variationDir, "info.json");
            const targetingDir = path.join(testDir, touchPoint, "targeting");
            const parentTargetingDir = path.join(testDir, "targeting");
            let parentTargetingId = null;

            try {
                // Check if info file exists
                if (await fs.existsSync(infoPath)) {
                    const info = await fs.readJson(infoPath);
                    if (info.id) {
                        // Get parent targeting info
                        const parentInfoPath = path.join(testDir, "info.json");
                        if (await fs.existsSync(parentInfoPath)) {
                            const parentInfo = await fs.readJson(parentInfoPath);
                            parentTargetingId = parentInfo.id;
                        }

                        return {
                            variationDir,
                            targetingDir: await fs.existsSync(targetingDir) ? targetingDir : null,
                            id: info.id,
                            parentTargeting: await fs.existsSync(parentTargetingDir) ? parentTargetingDir : null,
                            parentTargetingId,
                            testType: selectedVariation.testType,
                            hostnames
                        };
                    }
                }
                return null;
            } catch (error) {
                console.error(`Error reading info file for ${touchPoint}:`, error);
                return null;
            }
        })
    ).then(results => results.filter(Boolean));
    return touchPointsDir;
}
