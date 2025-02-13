import fs from "fs-extra"
import path from "path"
import https from "https"
import { fileURLToPath } from "url"
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const socketIoUrl = "https://cdn.socket.io/4.5.4/socket.io.min.js"
const outputPath = path.join(__dirname, "..", "public", "js", "vendor", "socket-io-client.js")

export function downloadSocketIO() {
    return new Promise((resolve, reject) => {
        https
            .get(socketIoUrl, (response) => {
                let data = ""
                response.on("data", (chunk) => {
                    data += chunk
                })
                response.on("end", async () => {
                    try {
                        await fs.ensureDir(path.dirname(outputPath))
                        fs.writeFile(outputPath, data, (err) => {
                            if (err) {
                                console.error("Error saving Socket.IO client:", err)
                                reject(err)
                            } else {
                                console.log(chalk.green("Socket.IO client saved successfully!"));
                                resolve()
                            }
                        })
                    } catch (err) {
                        console.error("Error ensuring directory exists:", err)
                        reject(err)
                    }
                })
            })
            .on("error", (err) => {
                console.error("Error downloading Socket.IO client:", err)
                reject(err)
            })
    })
}