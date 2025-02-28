import http from "http"
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
        if (req.url === "/ab-pilot-script.js") {
            const scriptPath = path.join(__dirname, "..", "browser-Runner.js");
            const content = await fs.readFile(scriptPath, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
        } else if (req.url === "/ab-test-script.js") {
            const scriptPath = path.join(__dirname, "..", "browser-script.js");
            const content = await fs.readFile(scriptPath, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
        } else if (req.url === "/socket-io-client.js") {
            const socketIoClientPath = path.join(__dirname, "..", "public", "js", "vendor", "socket-io-client.js");
            const content = await fs.readFile(socketIoClientPath, "utf-8");
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

    const watchPaths = transformedTestInfo.testInfo.map(test => [test.variationDir, test.targetingDir]).flat().filter(Boolean);

    const watcher = chokidar.watch(watchPaths, {
        ignored: /(^|[/\\])\../,
        persistent: true,
    });

    watcher
        .on("change", async (filePath) => {
            log(`File ${filePath} has been changed`)
            // console.log(kleur.yellow(`File has been changed: ${filePath}`))

            if (!filePath.includes("compiled") && !filePath.includes("targeting")) {
                if (filePath.includes("style.scss")) {
                    await bundleVariation(path.dirname(filePath), "scss")
                    console.log(kleur.gray(`🎨 SCSS File has been updated`))
                } else if (filePath.includes("index.js")) {
                    await bundleVariation(path.dirname(filePath), "js")
                    console.log(kleur.gray(`📦 JS File has been updated`))
                }
            } else if (filePath.includes("targeting")) {
                const info = transformedTestInfo.testInfo.find(test => test.targetingDir === path.dirname(filePath))
                const targetingFiles = await getTargetingFiles(info.targetingDir);
                transformedTestInfo.testInfo.find(test => test.id === info.id).targetingFiles = targetingFiles;
                transformedTestInfo.testInfo.find(test => test.id === info.id).targetingFiles = await getTargetingFiles(info.targetingDir);
                await browserScriptCreator(transformedTestInfo);
                io.emit("reload_page");
                console.log(kleur.gray(`🎯 Targeting files have been updated`))
            } else if (filePath.includes("compiled")) {
                const info = transformedTestInfo.testInfo.find(test => test.compiledDir === path.dirname(filePath))
                if (info) {
                    if (path.extname(filePath) === ".css") {
                        const cssFile = path.join(path.dirname(filePath), "style.css")
                        const css = await fs.readFile(cssFile, "utf-8")
                        io.emit("update", { type: "css", content: css, id: info.id })
                        transformedTestInfo.testInfo.find(test => test.id === info.id).variationFiles.css = css
                        await browserScriptCreator(transformedTestInfo);
                    } else if (path.extname(filePath) === ".js") {
                        const jsFile = path.join(path.dirname(filePath), "index.js")
                        const js = await fs.readFile(jsFile, "utf-8")
                        io.emit("update", { type: "js", content: js, id: info.id })
                        transformedTestInfo.testInfo.find(test => test.id === info.id).variationFiles.js = js
                        await browserScriptCreator(transformedTestInfo);
                    }
                }
            }
        })
        .on("error", (error) => log(`Watcher error: ${error}`))


    io.on("connection", async (socket) => {
        log("Browser connected");

        try {
            const config = await fs.readJson(path.join(process.cwd(), "settings.json"));
            log("Config sent to client:", config);

            socket.emit("config", config);

        } catch (error) {
            log(`Error reading config: ${error.message}`);
            socket.emit("config", {});
        }

        socket.on("checkWebsite", async (data, callback) => {
            const { url } = data;
            const origin = new URL(url.toString()).origin;
            const IsMatched = transformedTestInfo.testInfo.some(test => test.hostnames.some(hostname => origin.replace(/\/$/, "").endsWith(hostname.replace(/\/$/, "")) || url.replace(/\/$/, "").endsWith(hostname.replace(/\/$/, ""))));
            if (IsMatched) {
                console.log(kleur.magenta(`connected with the url: ${url}`));
                callback("Successfully connected with the server");
            }
        });
    });

    // const port = process.env.PORT || 3000;
    const port = 3000;
    server.listen(port, () => {
        log(`Test server running on http://localhost:${port}`);
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
    const targetingCheckDir = path.join(ROOT_DIR, "..", "skeleton", "targetMet");

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
            websiteName: item.websiteName,
            testName: item.testName,
            touchPointName: item.touchPointName,
            variationName: item.variationName
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
        // const customJSModule = await import(`file://${customJSPath}?update=${Date.now()}`);
        const customJS = customJSModule.default; // Get the default exported function

        const elementChecker = await fs.readJson(elementCheckerPath);
        const urlChecker = await fs.readJson(urlCheckerPath);

        return {
            "customJS": customJS,
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
            "customJS": customJS,
            "elementChecker": elementChecker,
            "urlChecker": urlChecker
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
            const variationName = info.name;
            const webSiteDir = path.join(ROOT_DIR, selectedVariation.website);
            const webSiteInfo = await fs.readJson(path.join(webSiteDir, "info.json"));
            const hostnames = webSiteInfo.hostnames;
            const websiteName = webSiteInfo.name;
            const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test);
            const testInfo = await fs.readJson(path.join(testDir, "info.json"));
            const testName = testInfo.name;
            const testType = testInfo.type;
            const touchPointName = null;

            return {
                variationDir,
                targetingDir: await fs.existsSync(targetingDir) ? targetingDir : null,
                id,
                hostnames,
                testType,
                websiteName,
                testName,
                touchPointName,
                variationName
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
    const testInfo = await fs.readJson(path.join(testDir, "info.json"));
    const testName = testInfo.name;
    const touchPoints = await fs.readdir(testDir);
    const websiteDir = path.join(ROOT_DIR, selectedVariation.website);
    const websiteInfo = await fs.readJson(path.join(websiteDir, "info.json"));
    const hostnames = websiteInfo.hostnames;
    const websiteName = websiteInfo.name;
    const touchPointsDir = await Promise.all(
        touchPoints.filter(touchPoint => touchPoint !== "targeting" && touchPoint !== "info.json").map(async touchPoint => {
            const touchPointDir = path.join(testDir, touchPoint);
            const touchPointInfoPath = path.join(touchPointDir, "info.json");
            const touchPointInfo = await fs.readJson(touchPointInfoPath);
            const touchPointName = touchPointInfo.name;
            const variationDir = path.join(testDir, touchPoint, selectedVariation.variation);
            const infoPath = path.join(variationDir, "info.json");
            const variationName = selectedVariation.variation;
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
                            hostnames,
                            websiteName,
                            touchPointName,
                            testName,
                            variationName
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
