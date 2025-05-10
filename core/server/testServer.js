import fs from "fs-extra"
import path from "path"
import http from "http"
import debug from "debug"
import kleur from "kleur"
import chokidar from "chokidar"
import { WebSocketServer } from "ws"
import { ROOT_DIR } from "../global/config.js"
import { fileURLToPath } from "url"

import browserScriptCreator from "./browserScriptCreator.js"
import { bundleVariation, bundleTargeting, getBundlerData } from "../utils/bundler.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const log = debug("ab-testing-cli:testServer")

// Store connected clients
const clients = new Set()

export async function startTestServer(selectedVariations) {
    const testInfo = await Promise.all(
        selectedVariations.map(async (selectedVariation) => {
            if (selectedVariation.testType === "Multi-touch") {
                const touchPointsDir = await getTouchPointsInfo(selectedVariation)
                return touchPointsDir
            } else {
                const variationDir = await getVariationInfo(selectedVariation)
                return variationDir
            }
        }),
    ).then((results) => results.flat())

    const transformedTestInfo = await transformTestInfo(testInfo)

    await browserScriptCreator(transformedTestInfo)

    const server = http.createServer(async (req, res) => {
        if (req.url === "/ab-pilot-script.js") {
            const scriptPath = path.join(__dirname, "..", "client", "browser-Runner.js")
            const content = await fs.readFile(scriptPath, "utf-8")
            res.writeHead(200, { "Content-Type": "application/javascript" })
            res.end(content)
        } else if (req.url === "/ab-test-script.js") {
            const scriptPath = path.join(__dirname, "..", "client", "browser-script.js")
            const content = await fs.readFile(scriptPath, "utf-8")
            res.writeHead(200, { "Content-Type": "application/javascript" })
            res.end(content)
        } else if (req.url === "/websocket-client.js") {
            // Serve a simple WebSocket client instead of socket.io
            const content = `
                window.createWebSocket = function() {
                    return new WebSocket('ws://' + window.location.hostname + ':3000');
                };
            `
            res.writeHead(200, { "Content-Type": "application/javascript" })
            res.end(content)
        } else {
            res.writeHead(404)
            res.end("Not Found")
        }
    })

    // Create WebSocket server
    const wss = new WebSocketServer({ server })

    const watchPaths = transformedTestInfo.testInfo
        .flatMap((test) => [test.variationDir, test.targetingDir, test.parentTargetingDir])
        .filter(Boolean)

    const watcher = chokidar.watch(watchPaths, {
        ignored: /(^|[/\\])\../,
        persistent: true,
    })

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
            } else if (!filePath.includes("compiled") && filePath.includes("targeting")) {
                const initialInfo =
                    transformedTestInfo.testInfo.find((test) => test.targetingDir === path.dirname(filePath)) ||
                    transformedTestInfo.parentTargeting.find((test) => test.parentTargetingDir === path.dirname(filePath))
                const infoList = transformedTestInfo.testInfo.filter((test) => test.targetingDir === path.dirname(filePath))
                await Promise.all(
                    infoList.map(async (info) => {
                        if (info) {
                            transformedTestInfo.testInfo.find((test) => test.id === info.id).targetingFiles = await getTargetingFiles(
                                info.targetingDir,
                            )
                            await browserScriptCreator(transformedTestInfo)
                        }
                    }),
                )
                const infoListParent = transformedTestInfo.parentTargeting.filter(
                    (test) => test.parentTargetingDir === path.dirname(filePath),
                )
                await Promise.all(
                    infoListParent.map(async (info) => {
                        if (info) {
                            transformedTestInfo.parentTargeting.find(
                                (test) => test.parentTargetingId === info.parentTargetingId,
                            ).targetingFiles = await getTargetingFiles(info.parentTargetingDir)
                            await browserScriptCreator(transformedTestInfo)
                        }
                    }),
                )
                if (infoList.length > 0 || infoListParent.length > 0) {
                    // Broadcast to all clients
                    broadcastToClients(
                        JSON.stringify({
                            type: "reload_page",
                            data: initialInfo.hostnames,
                        }),
                    )
                    console.log(kleur.gray(`🎯 Targeting files have been updated`))
                }
            } else if (filePath.includes("compiled") && !filePath.includes("targeting")) {
                const info = transformedTestInfo.testInfo.find((test) => test.compiledDir === path.dirname(filePath))
                if (info) {
                    if (path.extname(filePath) === ".css") {
                        const cssFile = path.join(path.dirname(filePath), "style.css")
                        const css = await fs.readFile(cssFile, "utf-8")
                        // Broadcast update to all clients
                        broadcastToClients(
                            JSON.stringify({
                                type: "update",
                                data: { type: "css", content: css, id: info.id },
                            }),
                        )
                        transformedTestInfo.testInfo.find((test) => test.id === info.id).variationFiles.css = css
                        await browserScriptCreator(transformedTestInfo)
                    } else if (path.extname(filePath) === ".js") {
                        const jsFile = path.join(path.dirname(filePath), "index.js")
                        const js = await fs.readFile(jsFile, "utf-8")
                        // Broadcast update to all clients
                        broadcastToClients(
                            JSON.stringify({
                                type: "update",
                                data: { type: "js", content: js, id: info.id },
                            }),
                        )
                        transformedTestInfo.testInfo.find((test) => test.id === info.id).variationFiles.js = js
                        await browserScriptCreator(transformedTestInfo)
                    }
                }
            }
        })
        .on("error", (error) => log(`Watcher error: ${error}`))

    // Helper function to broadcast to all connected clients
    function broadcastToClients(message) {
        clients.forEach((client) => {
            if (client.readyState === 1) {
                // OPEN
                client.send(message)
            }
        })
    }

    wss.on("connection", async (ws) => {
        log("Browser connected")
        clients.add(ws)

        try {
            const config = await fs.readJson(path.join(process.cwd(), "settings.json"))
            log("Config sent to client:", config)
            ws.send(
                JSON.stringify({
                    type: "config",
                    data: config,
                }),
            )

            //send UI code to client
            const uiJsFilePath = path.join(__dirname, "..", "public", "js", "main", "ui.js")
            const uiCssFilePath = path.join(__dirname, "..", "public", "style", "ui.scss")
            const uiJs = await getBundlerData(uiJsFilePath, uiCssFilePath, false)
            ws.send(
                JSON.stringify({
                    type: "ui",
                    data: uiJs,
                }),
            )
        } catch (error) {
            console.error(`Error reading config: ${error.message}`)
            log(`Error reading config: ${error.message}`)
            ws.send(
                JSON.stringify({
                    type: "config",
                    data: {},
                }),
            )
        }

        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message.toString())

                if (data.type === "checkWebsite") {
                    const { url } = data.data
                    const origin = new URL(url.toString()).origin
                    const IsMatched = transformedTestInfo.testInfo.some((test) =>
                        test.hostnames.some(
                            (hostname) =>
                                origin.replace(/\/$/, "").endsWith(hostname.replace(/\/$/, "")) ||
                                url.replace(/\/$/, "").endsWith(hostname.replace(/\/$/, "")),
                        ),
                    )
                    if (IsMatched) {
                        console.log(kleur.magenta(`connected with the url: ${url}`))
                        ws.send(
                            JSON.stringify({
                                type: "checkWebsiteResponse",
                                data: "Successfully connected with the server",
                            }),
                        )
                    }
                }
            } catch (error) {
                console.error("Error processing message:", error)
            }
        })

        ws.on("close", () => {
            clients.delete(ws)
            log("Browser disconnected")
        })
    })

    // const port = process.env.PORT || 3000;
    const port = 3000
    server.listen(port, () => {
        log(`Test server running on http://localhost:${port}`)
    })
}

async function transformTestInfo(testInfo) {
    const parentTargetingMap = new Map()

    // Process items with parentTargetingId
    const itemsWithParentTargeting = testInfo.filter((item) => item.parentTargetingId)

    for (const item of itemsWithParentTargeting) {
        if (!parentTargetingMap.has(item.parentTargetingId)) {
            const targetingFiles = await getTargetingFiles(item.parentTargetingDir)
            parentTargetingMap.set(item.parentTargetingId, {
                targeting: item.parentTargetingDir,
                parentTargetingDir: item.parentTargetingDir,
                parentTargetingId: item.parentTargetingId,
                variationIdList: [],
                hostnames: item.hostnames,
                targetingFiles,
            })
        }
        parentTargetingMap.get(item.parentTargetingId).variationIdList.push(item.id)
    }
    const targetingCheckDir = path.join(ROOT_DIR, "..", "skeleton", "targetMet")

    // Process all testInfo items
    const finalTestInfo = await Promise.all(
        testInfo.map(async (item) => ({
            variationDir: item.variationDir,
            compiledDir: path.join(item.variationDir, "compiled"),
            targetingDir: item.targetingDir,
            parentTargetingDir: item.parentTargetingDir,
            id: item.id,
            testType: item.testType,
            hostnames: item.hostnames,
            variationFiles: await getVariationFiles(item.variationDir),
            targetingFiles: await getTargetingFiles(item.targetingDir),
            websiteName: item.websiteName,
            testName: item.testName,
            touchPointName: item.touchPointName,
            variationName: item.variationName,
        })),
    )

    return {
        parentTargeting: Array.from(parentTargetingMap.values()),
        targetMet: await getTargetMetFiles(targetingCheckDir),
        testInfo: finalTestInfo,
    }
}

async function getVariationFiles(variationDir) {
    const compiledDir = path.join(variationDir, "compiled")
    const cssFile = path.join(compiledDir, "style.css")
    const jsFile = path.join(compiledDir, "index.js")

    try {
        const css = await fs.readFile(cssFile, "utf-8")
        const js = await fs.readFile(jsFile, "utf-8")

        return {
            css,
            js,
        }
    } catch (error) {
        console.error("Error reading variation files:", error)
        return {
            css: "",
            js: "",
        }
    }
}

async function getTargetingFiles(targetingDir) {
    if (!targetingDir) {
        return null
    }

    const elementCheckerPath = path.join(targetingDir, "elementChecker.json")
    const urlCheckerPath = path.join(targetingDir, "urlChecker.json")
    // const compiledPath = path.join(targetingDir, "compiled", "customJS.js");

    try {
        // Dynamically import customJS.js
        // const customJSModule = await import(`file://${customJSPath}`);
        // // const customJSModule = await import(`file://${customJSPath}?update=${Date.now()}`);
        // const customJS = customJSModule.default; // Get the default exported function

        // Check if the file exists and delete it if it does
        // if (fs.existsSync(compiledPath)) {
        //     fs.unlinkSync(compiledPath);
        // }

        await bundleTargeting(targetingDir)
        const BundleTargetingPath = path.join(targetingDir, "compiled", "customJS.js")
        // const customJSModule = await import(`file://${BundleTargetingPath}`);
        const customJSModule = await import(`file://${BundleTargetingPath}?update=${Date.now()}`)
        const customJS = customJSModule.default

        const elementChecker = await fs.readJson(elementCheckerPath)
        const urlChecker = await fs.readJson(urlCheckerPath)

        return {
            customJS: customJS,
            elementChecker,
            urlChecker,
        }
    } catch (error) {
        console.error("Error reading targeting files:", error)
        return {
            customJS: () => { }, // Return an empty function as a fallback
            elementChecker: {},
            urlChecker: {},
        }
    }
}

async function getTargetMetFiles(targetingCheckDir) {
    if (!targetingCheckDir) {
        return null
    }

    const customJSPath = path.join(targetingCheckDir, "customJS.js")
    const elementCheckerPath = path.join(targetingCheckDir, "elementChecker.js")
    const urlCheckerPath = path.join(targetingCheckDir, "urlChecker.js")

    try {
        // Dynamically import customJS.js
        const customJSModule = await import(`file://${customJSPath}`)
        const elementCheckerModule = await import(`file://${elementCheckerPath}`)
        const urlCheckerModule = await import(`file://${urlCheckerPath}`)

        const customJS = customJSModule.default
        const elementChecker = elementCheckerModule.default
        const urlChecker = urlCheckerModule.default

        return {
            customJS: customJS,
            elementChecker: elementChecker,
            urlChecker: urlChecker,
        }
    } catch (error) {
        console.error("Error reading targeting files:", error)
        return {
            customJS: () => { }, // Return an empty function as a fallback
            elementChecker: {},
            urlChecker: {},
        }
    }
}

async function getVariationInfo(selectedVariation) {
    const variationDir = path.join(
        ROOT_DIR,
        selectedVariation.website,
        selectedVariation.test,
        selectedVariation.variation,
    )
    const infoPath = path.join(variationDir, "info.json")
    const targetingDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test, "targeting")

    try {
        // Check if info file exists
        if (await fs.existsSync(infoPath)) {
            const info = await fs.readJson(infoPath)
            const id = info.id
            const variationName = info.name
            const webSiteDir = path.join(ROOT_DIR, selectedVariation.website)
            const webSiteInfo = await fs.readJson(path.join(webSiteDir, "info.json"))
            const hostnames = webSiteInfo.hostnames
            const websiteName = webSiteInfo.name
            const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test)
            const testInfo = await fs.readJson(path.join(testDir, "info.json"))
            const testName = testInfo.name
            const testType = testInfo.type
            const touchPointName = null

            return {
                variationDir,
                targetingDir: (await fs.existsSync(targetingDir)) ? targetingDir : null,
                id,
                hostnames,
                testType,
                websiteName,
                testName,
                touchPointName,
                variationName,
            }
        }
        return null
    } catch (error) {
        console.error(`Error reading info file:`, error)
        return null
    }
}

async function getTouchPointsInfo(selectedVariation) {
    const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test)
    const testInfo = await fs.readJson(path.join(testDir, "info.json"))
    const testName = testInfo.name
    const touchPoints = await fs.readdir(testDir)
    const websiteDir = path.join(ROOT_DIR, selectedVariation.website)
    const websiteInfo = await fs.readJson(path.join(websiteDir, "info.json"))
    const hostnames = websiteInfo.hostnames
    const websiteName = websiteInfo.name
    const touchPointsDir = await Promise.all(
        touchPoints
            .filter((touchPoint) => touchPoint !== "targeting" && touchPoint !== "info.json")
            .map(async (touchPoint) => {
                const touchPointDir = path.join(testDir, touchPoint)
                const touchPointInfoPath = path.join(touchPointDir, "info.json")
                const touchPointInfo = await fs.readJson(touchPointInfoPath)
                const touchPointName = touchPointInfo.name
                const variationDir = path.join(testDir, touchPoint, selectedVariation.variation)
                const infoPath = path.join(variationDir, "info.json")
                const variationName = selectedVariation.variation
                const targetingDir = path.join(testDir, touchPoint, "targeting")
                const parentTargetingDir = path.join(testDir, "targeting")
                let parentTargetingId = null

                try {
                    // Check if info file exists
                    if (await fs.existsSync(infoPath)) {
                        const info = await fs.readJson(infoPath)
                        if (info.id) {
                            // Get parent targeting info
                            const parentInfoPath = path.join(testDir, "info.json")
                            if (await fs.existsSync(parentInfoPath)) {
                                const parentInfo = await fs.readJson(parentInfoPath)
                                parentTargetingId = parentInfo.id
                            }

                            return {
                                variationDir,
                                targetingDir: (await fs.existsSync(targetingDir)) ? targetingDir : null,
                                id: info.id,
                                parentTargetingDir: (await fs.existsSync(parentTargetingDir)) ? parentTargetingDir : null,
                                parentTargetingId,
                                testType: selectedVariation.testType,
                                hostnames,
                                websiteName,
                                touchPointName,
                                testName,
                                variationName,
                            }
                        }
                    }
                    return null
                } catch (error) {
                    console.error(`Error reading info file for ${touchPoint}:`, error)
                    return null
                }
            }),
    ).then((results) => results.filter(Boolean))
    return touchPointsDir
}
