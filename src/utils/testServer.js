import http from "http"
import { Server } from "socket.io"
import fs from "fs-extra"
import path from "path"
import { ROOT_DIR } from "../config.js"
import { convertScssToCSS } from "./cssUtils.js"

export async function startTestServer(website, test, activeVariation) {
    const server = http.createServer()
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    })

    const testDir = path.join(ROOT_DIR, website, test)
    const variationDir = path.join(testDir, activeVariation)

    io.on("connection", (socket) => {
        console.log("Browser connected")

        socket.on("requestTestData", async () => {
            try {
                const cssFile = path.join(variationDir, "style.css")
                const jsFile = path.join(variationDir, "index.js")

                let css = ""
                let js = ""

                if (await fs.pathExists(cssFile)) {
                    css = await fs.readFile(cssFile, "utf-8")
                }

                if (await fs.pathExists(jsFile)) {
                    js = await fs.readFile(jsFile, "utf-8")
                }

                socket.emit("testData", { css, js })
            } catch (error) {
                console.error(`Error sending test data: ${error.message}`)
            }
        })

        socket.on("fileChanged", async (data) => {
            try {
                if (data.type === "scss") {
                    const scssFile = path.join(variationDir, "style.scss")
                    const cssFile = path.join(variationDir, "style.css")
                    await fs.writeFile(scssFile, data.content)
                    await convertScssToCSS(scssFile, cssFile)
                    const css = await fs.readFile(cssFile, "utf-8")
                    socket.emit("cssUpdated", { css })
                } else if (data.type === "js") {
                    const jsFile = path.join(variationDir, "index.js")
                    await fs.writeFile(jsFile, data.content)
                    socket.emit("jsUpdated")
                }
            } catch (error) {
                console.error(`Error handling file change: ${error.message}`)
            }
        })
    })

    const port = 3000
    server.listen(port, () => {
        console.log(`Test server running on http://localhost:${port}`)
    })
}

