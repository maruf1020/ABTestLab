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


    //find the website directory then get the info.json file and get the hostnames
    const webSiteList = selectedVariations.map((selectedVariation) => selectedVariation.website);
    const webSiteInfoList = await Promise.all(webSiteList.map(async (webSite) => {
        return await fs.readJson(path.join(ROOT_DIR, webSite, "info.json"));
    }));
    const hostnamesList = webSiteInfoList.map((webSiteInfo) => webSiteInfo.hostnames).flat().filter((hostname, index, self) => self.indexOf(hostname) === index);

    const testDirList = selectedVariations.map((selectedVariation) =>
        path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test)
    );
    const testInfoList = await Promise.all(testDirList.map(async (testDir) =>
        await fs.readJson(path.join(testDir, "info.json"))
    ));
    const testTypeList = testInfoList.map((testInfo) => testInfo.type);

    const watchPaths = [];
    const touchPoints = {};

    for (let i = 0; i < selectedVariations.length; i++) {
        const selectedVariation = selectedVariations[i];
        const testDir = testDirList[i];
        const testInfo = testInfoList[i];
        const testType = testTypeList[i];
        const isMultiTouch = testType === "Multi-touch";

        if (isMultiTouch) {
            const touchpointDirs = await fs.readdir(testDir);
            for (const touchpoint of touchpointDirs) {
                const touchpointDir = path.join(testDir, touchpoint);
                if ((await fs.stat(touchpointDir)).isDirectory() && touchpoint !== "targeting") {
                    const variationDir = path.join(touchpointDir, selectedVariation.variation);
                    watchPaths.push(variationDir);
                    touchPoints[touchpoint] = {
                        dir: variationDir,
                        variation: selectedVariation.variation,
                        testId: selectedVariation.testId // Use testId here
                    };
                }
            }
        } else {
            const variationDir = path.join(testDir, selectedVariation.variation);
            watchPaths.push(variationDir);
        }
    }

    const watcher = chokidar.watch(watchPaths, {
        ignored: /(^|[/\\])\../,
        persistent: true,
    });

    watcher
        .on("change", async (filePath) => {
            log(`File ${filePath} has been changed`)
            console.log(kleur.yellow(`File has been changed: ${filePath}`))
            let touchPoint = null
            let variationDir = null

            const dir = path.dirname(filePath)
            const activeVariation = path.basename(dir)
            console.log("activeVariation", activeVariation)

            const base = path.basename(process.cwd());
            const baseFromFilePath = dir.split(path.sep).slice(-7)[0]
            const isMultiTouch = base === baseFromFilePath;
            console.log("isMultiTouch", isMultiTouch)
            const testDir = isMultiTouch ? path.join(dir, "..", "..") : path.join(dir, "..")
            console.log("testDir", testDir)
            const webSiteDir = path.join(testDir, "..")
            console.log("webSiteDir", webSiteDir)
            const webSiteInfo = await fs.readJson(path.join(webSiteDir, "info.json"))
            console.log("webSiteInfo", webSiteInfo)
            const hostnames = webSiteInfo.hostnames;
            console.log("hostnames", hostnames)
            const testInfo = {
                website: isMultiTouch ? path.basename(testDir) : path.basename(path.dirname(testDir)),
                test: isMultiTouch ? path.basename(path.dirname(testDir)) : path.basename(testDir),
                touchPoint: isMultiTouch ? dir.split(path.sep).slice(-2)[0] : null,
                variation: activeVariation
            }
            console.log("testInfo", testInfo)

            if (isMultiTouch) {
                touchPoint = dir.split(path.sep).slice(-3)[0]
                if (touchPoint) {
                    const touchpointDir = path.join(testDir, touchPoint)
                    variationDir = path.join(touchpointDir, activeVariation)
                }
            } else {
                variationDir = path.join(testDir, activeVariation)
                console.log("variationDir", variationDir)
            }

            if (!variationDir) {
                console.log(kleur.red("Unable to determine variation directory for changed file: ", filePath))
                log(`Unable to determine variation directory for changed file: ${filePath}`)
                return
            }

            // const relativePath = path.relative(variationDir, filePath)
            // const fileContent = await fs.readFile(filePath, "utf-8")
            // console.log("filePath", filePath)
            // console.log("fileContent", fileContent)


            if (filePath.includes("compiled") && (filePath.includes("style.css") || filePath.includes("index.js"))) {
                if (path.extname(filePath) === ".css") {
                    const cssFile = path.join(path.dirname(filePath), "style.css")
                    // await convertScssToCSS(filePath, cssFile)
                    const css = await fs.readFile(cssFile, "utf-8")
                    io.emit("update", { type: "css", path: "style.css", content: css, touchPoint, hostnames, testInfo })
                } else if (path.extname(filePath) === ".js") {
                    // log(`JavaScript file changed: ${filePath}`)
                    // io.emit("update", { type: "js", path: relativePath, content: fileContent, touchPoint, hostnames, testInfo })
                    const jsFile = path.join(path.dirname(filePath), "index.js")
                    const js = await fs.readFile(jsFile, "utf-8")
                    io.emit("update", { type: "js", path: "index.js", content: js, touchPoint, hostnames, testInfo })
                }

                console.log(kleur.green(`File has been changed for ${testInfo.website} - ${testInfo.test} -  ${testInfo.touchPoint ? testInfo.touchPoint + " - " : ""} ${testInfo.variation} - ${(path.extname(filePath) === ".scss" || path.extname(filePath) === ".css") ? "CSS" : "JS"}`))
            } else {
                if (path.extname(filePath) === ".scss") {
                    await bundleVariation(variationDir, "scss")
                    console.log(variationDir)
                } else if (path.extname(filePath) === ".js") {
                    await bundleVariation(variationDir, "js")
                }
            }
        })
        .on("error", (error) => log(`Watcher error: ${error}`))

    io.on("connection", (socket) => {
        log("Browser connected");

        socket.on("checkWebsite", async (data, callback) => {
            const { url } = data;
            try {
                // const selectedVariation = selectedVariations.find(v => v.testId === testId);
                const applicableVariations = selectedVariations.filter((selectedVariation) => {
                    return hostnamesList.some((hostname) => {
                        return url.replace(/\/$/, "").includes(hostname) &&
                            webSiteInfoList.find((webSiteInfo) => webSiteInfo.name === selectedVariation.website);
                    });
                });
                // if (!selectedVariation) {
                //     log(`No variation found for test ID: ${testId}`);
                //     callback({ match: false });
                //     return;
                // }
                if (applicableVariations.length === 0) {
                    log(`No applicable variation found for URL: ${url}`);
                    callback({ match: false });
                    return;
                }

                // const websiteInfo = await fs.readJson(path.join(ROOT_DIR, selectedVariation.website, "info.json"));
                // const match = websiteInfo.hostnames.some((hostname) => url.includes(hostname));
                // callback({
                //     match,
                //     websiteName: websiteInfo.name,
                //     testId
                // });

                callback({
                    match: true,
                    testInfo: applicableVariations
                });
            } catch (error) {
                log(`Error checking website: ${error.message}`);
                callback({ match: false });
            }
        });

        socket.on("getConfig", async (callback) => {
            try {
                const config = await fs.readJson(path.join(process.cwd(), "settings.json"));
                log("Config sent to client:", config);
                callback(config);
            } catch (error) {
                log(`Error reading config: ${error.message}`);
                callback({});
            }
        });

        socket.on("requestTestData", async (testInfoList) => {
            try {
                let testData = [];
                const requestedVariations = selectedVariations.filter((selectedVariation) => {
                    return testInfoList.some((testInfo) => testInfo.website === selectedVariation.website && testInfo.test === selectedVariation.test && testInfo.variation === selectedVariation.variation);
                });

                if (requestedVariations.length === 0) {
                    log(`No requested variations found`);
                    return;
                }

                for (const selectedVariation of requestedVariations) {
                    const testDir = path.join(ROOT_DIR, selectedVariation.website, selectedVariation.test);
                    const isMultiTouch = testTypeList[selectedVariations.indexOf(selectedVariation)] === "Multi-touch";

                    if (isMultiTouch) {
                        testData.push({
                            files: await getMultiTouchTestData(testDir, selectedVariation.variation),
                            testInfo: selectedVariation,
                            isMultiTouch: true
                        });
                    } else {
                        const variationDir = path.join(testDir, selectedVariation.variation);
                        testData.push({
                            files: await getTestData(variationDir),
                            testInfo: selectedVariation,
                            isMultiTouch: false
                        });
                    }
                }

                socket.emit("testData", {
                    data: testData,
                });

            } catch (error) {
                log(`Error sending test data: ${error.message}`);
            }
        });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        log(`Test server running on http://localhost:${port}`);
    });
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
