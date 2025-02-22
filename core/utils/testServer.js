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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const log = debug("ab-testing-cli:testServer")

// export async function startTestServer(website, test, activeVariation) {
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

    const coreDir = path.join(__dirname, "..");

    // inside coreDir I will create a file called browser-Runner.js
    // there I will write the code add all the code from transformTestInfo
    // from transformTestInfo I will take the testInfo and from there I will the variation files
    // variation files contain the css and js files
    // for css I will create a document.createElement("style") and append it to the head
    // for js I will eval the js code / execute it
    // but in the top I have to create a wait function that will frequently check if the head is available
    // the frequency will be 10ms
    // if the head is available then it will append the css and js files

    const browserRunnerPath = path.join(coreDir, "browser-runner.js");
    fs.writeFileSync(browserRunnerPath, `const data = ${JSON.stringify(transformedTestInfo, null, 2)};
        const headCheckInterval = setInterval(() => {
            if (document.head) {
                clearInterval(headCheckInterval);
                data.testInfo.forEach((test) => {
                    const style = document.createElement("style");
                    style.textContent = test.variationFiles.css;
                    document.head.appendChild(style);
                    eval(test.variationFiles.js);

                });
            }
        }, 10);      
        
    `);

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
                targetingFiles: await getTargetingFiles(item.targetingDir)
            }))
        );

        return {
            parentTargeting: Array.from(parentTargetingMap.values()),
            testInfo: finalTestInfo
        };
    }

    async function getVariationFiles(variationDir) {
        const compiledDir = path.join(variationDir, "compiled");
        const cssFile = path.join(compiledDir, "style.css");
        const jsFile = path.join(compiledDir, "index.js");

        try {
            const css = await fs.readFile(cssFile, "utf-8")
            // .then(content => content.replace(/\\r\\n/g, '\n')
            //     .replace(/\\n/g, '\n')
            //     .replace(/\\t/g, '\t'));
            const js = await fs.readFile(jsFile, "utf-8")
            // .then(content => content.replace(/\\r\\n/g, '\n')
            //     .replace(/\\n/g, '\n')
            //     .replace(/\\t/g, '\t'));

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
        const targetingFiles = await fs.readdir(targetingDir);
        const targeting = {};

        for (const file of targetingFiles) {
            const filePath = path.join(targetingDir, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile()) {
                const content = await fs.readFile(filePath, "utf-8");

                // Format based on file extension
                const extension = path.extname(file);
                if (extension === ".json") {
                    try {
                        targeting[file] = JSON.parse(content);
                    } catch (error) {
                        targeting[file] = content; // Return raw content if JSON parsing fails
                    }
                } else if (extension === ".js") {
                    // Return formatted JavaScript code
                    targeting[file] = content
                    // .replace(/\\r\\n/g, '\n')
                    //     .replace(/\\n/g, '\n')
                    //     .replace(/\\t/g, '\t');
                } else {
                    targeting[file] = content;
                }
            }
        }

        return targeting;
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

    // //find the website directory then get the info.json file and get the hostnames
    // const webSiteList = selectedVariations.map((selectedVariation) => selectedVariation.website);
    // const webSiteInfoList = await Promise.all(webSiteList.map(async (webSite) => {
    //     return await fs.readJson(path.join(ROOT_DIR, webSite, "info.json"));
    // }));
    // const hostnamesList = webSiteInfoList.map((webSiteInfo) => webSiteInfo.hostnames).flat().filter((hostname, index, self) => self.indexOf(hostname) === index);

    // const testDirList = selectedVariations.map((selectedVariation) =>
    //     path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test)
    // );
    // const testInfoList = await Promise.all(testDirList.map(async (testDir) =>
    //     await fs.readJson(path.join(testDir, "info.json"))
    // ));
    // const testTypeList = testInfoList.map((testInfo) => testInfo.type);

    // const watchPaths = [];
    // const touchPoints = {};

    // for (let i = 0; i < selectedVariations.length; i++) {
    //     const selectedVariation = selectedVariations[i];
    //     const testDir = testDirList[i];
    //     const testInfo = testInfoList[i];
    //     const testType = testTypeList[i];
    //     const isMultiTouch = testType === "Multi-touch";

    //     if (isMultiTouch) {
    //         const touchpointDirs = await fs.readdir(testDir);
    //         for (const touchpoint of touchpointDirs) {
    //             const touchpointDir = path.join(testDir, touchpoint);
    //             if ((await fs.stat(touchpointDir)).isDirectory() && touchpoint !== "targeting") {
    //                 const variationDir = path.join(touchpointDir, selectedVariation.variation);
    //                 watchPaths.push(variationDir);
    //                 touchPoints[touchpoint] = {
    //                     dir: variationDir,
    //                     variation: selectedVariation.variation,
    //                     testId: selectedVariation.testId // Use testId here
    //                 };
    //             }
    //         }
    //     } else {
    //         const variationDir = path.join(testDir, selectedVariation.variation);
    //         watchPaths.push(variationDir);
    //     }
    // }

    // const watcher = chokidar.watch(watchPaths, {
    //     ignored: /(^|[/\\])\../,
    //     persistent: true,
    // });

    // watcher
    //     .on("change", async (filePath) => {
    //         log(`File ${filePath} has been changed`)
    //         console.log(kleur.yellow(`File has been changed: ${filePath}`))
    //         let touchPoint = null
    //         let variationDir = null

    //         const dir = path.dirname(filePath)
    //         const activeVariation = path.basename(dir)
    //         console.log("activeVariation", activeVariation)

    //         const base = path.basename(process.cwd());
    //         const baseFromFilePath = dir.split(path.sep).slice(-7)[0]
    //         const isMultiTouch = base === baseFromFilePath;
    //         console.log("isMultiTouch", isMultiTouch)
    //         const testDir = isMultiTouch ? path.join(dir, "..", "..") : path.join(dir, "..")
    //         console.log("testDir", testDir)
    //         const webSiteDir = path.join(testDir, "..")
    //         console.log("webSiteDir", webSiteDir)
    //         const webSiteInfo = await fs.readJson(path.join(webSiteDir, "info.json"))
    //         console.log("webSiteInfo", webSiteInfo)
    //         const hostnames = webSiteInfo.hostnames;
    //         console.log("hostnames", hostnames)
    //         const testInfo = {
    //             website: isMultiTouch ? path.basename(testDir) : path.basename(path.dirname(testDir)),
    //             test: isMultiTouch ? path.basename(path.dirname(testDir)) : path.basename(testDir),
    //             touchPoint: isMultiTouch ? dir.split(path.sep).slice(-2)[0] : null,
    //             variation: activeVariation
    //         }
    //         console.log("testInfo", testInfo)

    //         if (isMultiTouch) {
    //             touchPoint = dir.split(path.sep).slice(-3)[0]
    //             if (touchPoint) {
    //                 const touchpointDir = path.join(testDir, touchPoint)
    //                 variationDir = path.join(touchpointDir, activeVariation)
    //             }
    //         } else {
    //             variationDir = path.join(testDir, activeVariation)
    //             console.log("variationDir", variationDir)
    //         }

    //         if (!variationDir) {
    //             console.log(kleur.red("Unable to determine variation directory for changed file: ", filePath))
    //             log(`Unable to determine variation directory for changed file: ${filePath}`)
    //             return
    //         }

    //         // const relativePath = path.relative(variationDir, filePath)
    //         // const fileContent = await fs.readFile(filePath, "utf-8")
    //         // console.log("filePath", filePath)
    //         // console.log("fileContent", fileContent)


    //         if (filePath.includes("compiled") && (filePath.includes("style.css") || filePath.includes("index.js"))) {
    //             if (path.extname(filePath) === ".css") {
    //                 const cssFile = path.join(path.dirname(filePath), "style.css")
    //                 // await convertScssToCSS(filePath, cssFile)
    //                 const css = await fs.readFile(cssFile, "utf-8")
    //                 io.emit("update", { type: "css", path: "style.css", content: css, touchPoint, hostnames, testInfo })
    //             } else if (path.extname(filePath) === ".js") {
    //                 // log(`JavaScript file changed: ${filePath}`)
    //                 // io.emit("update", { type: "js", path: relativePath, content: fileContent, touchPoint, hostnames, testInfo })
    //                 const jsFile = path.join(path.dirname(filePath), "index.js")
    //                 const js = await fs.readFile(jsFile, "utf-8")
    //                 io.emit("update", { type: "js", path: "index.js", content: js, touchPoint, hostnames, testInfo })
    //             }

    //             console.log(kleur.green(`File has been changed for ${testInfo.website} - ${testInfo.test} -  ${testInfo.touchPoint ? testInfo.touchPoint + " - " : ""} ${testInfo.variation} - ${(path.extname(filePath) === ".scss" || path.extname(filePath) === ".css") ? "CSS" : "JS"}`))
    //         } else {
    //             if (path.extname(filePath) === ".scss") {
    //                 await bundleVariation(variationDir, "scss")
    //                 console.log(variationDir)
    //             } else if (path.extname(filePath) === ".js") {
    //                 await bundleVariation(variationDir, "js")
    //             }
    //         }
    //     })
    //     .on("error", (error) => log(`Watcher error: ${error}`))

    // io.on("connection", (socket) => {
    //     log("Browser connected");

    //     socket.on("checkWebsite", async (data, callback) => {
    //         const { url } = data;
    //         try {
    //             // const selectedVariation = selectedVariations.find(v => v.testId === testId);
    //             const applicableVariations = selectedVariations.filter((selectedVariation) => {
    //                 return hostnamesList.some((hostname) => {
    //                     return url.replace(/\/$/, "").includes(hostname) &&
    //                         webSiteInfoList.find((webSiteInfo) => webSiteInfo.name === selectedVariation.website);
    //                 });
    //             });
    //             // if (!selectedVariation) {
    //             //     log(`No variation found for test ID: ${testId}`);
    //             //     callback({ match: false });
    //             //     return;
    //             // }
    //             if (applicableVariations.length === 0) {
    //                 log(`No applicable variation found for URL: ${url}`);
    //                 callback({ match: false });
    //                 return;
    //             }

    //             // const websiteInfo = await fs.readJson(path.join(ROOT_DIR, selectedVariation.website, "info.json"));
    //             // const match = websiteInfo.hostnames.some((hostname) => url.includes(hostname));
    //             // callback({
    //             //     match,
    //             //     websiteName: websiteInfo.name,
    //             //     testId
    //             // });

    //             callback({
    //                 match: true,
    //                 testInfo: applicableVariations
    //             });
    //         } catch (error) {
    //             log(`Error checking website: ${error.message}`);
    //             callback({ match: false });
    //         }
    //     });

    //     socket.on("getConfig", async (callback) => {
    //         try {
    //             const config = await fs.readJson(path.join(process.cwd(), "settings.json"));
    //             log("Config sent to client:", config);
    //             callback(config);
    //         } catch (error) {
    //             log(`Error reading config: ${error.message}`);
    //             callback({});
    //         }
    //     });

    //     socket.on("requestTestData", async (testInfoList) => {
    //         try {
    //             let testData = [];
    //             const requestedVariations = selectedVariations.filter((selectedVariation) => {
    //                 return testInfoList.some((testInfo) => testInfo.website === selectedVariation.website && testInfo.test === selectedVariation.test && testInfo.variation === selectedVariation.variation);
    //             });

    //             if (requestedVariations.length === 0) {
    //                 log(`No requested variations found`);
    //                 return;
    //             }

    //             for (const selectedVariation of requestedVariations) {
    //                 const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test);
    //                 const isMultiTouch = testTypeList[selectedVariations.indexOf(selectedVariation)] === "Multi-touch";

    //                 if (isMultiTouch) {
    //                     testData.push({
    //                         files: await getMultiTouchTestData(testDir, selectedVariation.variation),
    //                         testInfo: selectedVariation,
    //                         isMultiTouch: true
    //                     });
    //                 } else {
    //                     const variationDir = path.join(testDir, selectedVariation.variation);
    //                     testData.push({
    //                         files: await getTestData(variationDir),
    //                         testInfo: selectedVariation,
    //                         isMultiTouch: false
    //                     });
    //                 }
    //             }

    //             socket.emit("testData", {
    //                 data: testData,
    //             });

    //         } catch (error) {
    //             log(`Error sending test data: ${error.message}`);
    //         }
    //     });
    // });

    // const port = process.env.PORT || 3000;
    // server.listen(port, () => {
    //     log(`Test server running on http://localhost:${port}`);
    // });
}

async function getMultiTouchTestData(testDir, activeVariation) {
    const testData = {};
    const touchpointDirs = await fs.readdir(testDir);

    for (const touchpoint of touchpointDirs) {
        const touchpointDir = path.join(testDir, touchpoint);
        if ((await fs.stat(touchpointDir)).isDirectory() && touchpoint !== "targeting") {
            const variationDir = path.join(touchpointDir, activeVariation, "compiled");
            testData[touchpoint] = await getTestData(variationDir);
        }
    }
    return testData;
}

async function getTestData(variationDir) {
    const testData = {
        css: {},
        js: {},
    };

    const compiledDir = path.join(variationDir, "compiled");
    const files = await fs.readdir(compiledDir);
    for (const file of files) {
        const filePath = path.join(compiledDir, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
            if (file === "style.css") {
                const css = await fs.readFile(filePath, "utf-8");
                testData.css[file] = css;
            } else if (path.extname(file) === ".js") {
                const js = await fs.readFile(filePath, "utf-8");
                testData.js[file] = js;
            }
        }
    }
    return testData;
}
