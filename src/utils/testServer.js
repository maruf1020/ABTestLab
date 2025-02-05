import http from "http"
import { Server } from "socket.io"
import fs from "fs-extra"
import path from "path"
import chokidar from "chokidar"
import { ROOT_DIR } from "../config.js"
import { convertScssToCSS } from "./cssUtils.js"
import debug from "debug"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const log = debug("ab-testing-cli:testServer")

export async function startTestServer(website, test, activeVariation) {
    const server = http.createServer(async (req, res) => {
        const urlParts = req.url.split("/")
        const testId = urlParts[1]
        const fileType = urlParts[2]

        if (req.url === "/ab-test-script.js") {
            const scriptPath = path.join(__dirname, "..", "browser-script.js")
            const content = await fs.readFile(scriptPath, "utf-8")
            res.writeHead(200, { "Content-Type": "application/javascript" })
            res.end(content)
        } else if (testId && (fileType === "css" || fileType === "js")) {
            const testDir = path.join(ROOT_DIR, website, test)
            const variationDir = path.join(testDir, activeVariation)
            const filePath = path.join(variationDir, `style.${fileType}`)

            if (await fs.pathExists(filePath)) {
                const content = await fs.readFile(filePath, "utf-8")
                const contentType = fileType === "css" ? "text/css" : "application/javascript"
                res.writeHead(200, { "Content-Type": contentType })
                res.end(content)
            } else {
                res.writeHead(404)
                res.end("Not Found")
            }
        } else {
            res.writeHead(404)
            res.end("Not Found")
        }
    })

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    })

    const testDir = path.join(ROOT_DIR, website, test)
    const variationDir = path.join(testDir, activeVariation)

    // Watch for file changes
    const watcher = chokidar.watch(variationDir, {
        ignored: /(^|[/\\])\../, // ignore dotfiles
        persistent: true,
    })

    watcher
        .on("change", async (filePath) => {
            log(`File ${filePath} has been changed`)
            const relativePath = path.relative(variationDir, filePath)
            const fileContent = await fs.readFile(filePath, "utf-8")

            if (path.extname(filePath) === ".scss") {
                const cssFile = path.join(path.dirname(filePath), "style.css")
                await convertScssToCSS(filePath, cssFile)
                const css = await fs.readFile(cssFile, "utf-8")
                io.emit("fileChanged", { testId: test, type: "css", path: "style.css", content: css })
            } else if (path.extname(filePath) === ".js") {
                io.emit("fileChanged", { testId: test, type: "js", path: relativePath, content: fileContent })
            }
        })
        .on("error", (error) => log(`Watcher error: ${error}`))

    io.on("connection", (socket) => {
        log("Browser connected")

        socket.on("checkWebsite", async (data, callback) => {
            const { testId, url } = data
            const websiteInfo = await fs.readJson(path.join(ROOT_DIR, website, "info.json"))
            const match = websiteInfo.hostnames.some((hostname) => url.includes(hostname))
            callback({ match, websiteName: websiteInfo.name })
        })

        socket.on("getConfig", async (callback) => {
            try {
                const config = await fs.readJson(path.join(__dirname, "..", "config.json"))
                callback(config)
            } catch (error) {
                log(`Error reading config: ${error.message}`)
                callback({})
            }
        })

        socket.on("requestTestData", async (testId) => {
            try {
                const testData = await getTestData(variationDir)
                socket.emit("testData", { testId, data: testData })
            } catch (error) {
                log(`Error sending test data: ${error.message}`)
            }
        })
    })

    const port = process.env.PORT || 3000
    server.listen(port, () => {
        log(`Test server running on http://localhost:${port}`)
    })
}

async function getTestData(variationDir) {
    const testData = {
        css: {},
        js: {},
    }

    const files = await fs.readdir(variationDir)
    for (const file of files) {
        const filePath = path.join(variationDir, file)
        const stats = await fs.stat(filePath)
        if (stats.isFile()) {
            if (file === "style.css") {
                testData.css[file] = await fs.readFile(filePath, "utf-8")
            } else if (path.extname(file) === ".js") {
                testData.js[file] = await fs.readFile(filePath, "utf-8")
            }
        }
    }

    return testData
}

