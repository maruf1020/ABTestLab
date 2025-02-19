import fs from "fs-extra"
import path from "path"
import sass from "sass"
import { rollup } from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export async function bundleVariation(variationDir, UpdateFile) {
    const compiledDir = path.join(variationDir, "compiled")
    await fs.ensureDir(compiledDir)

    // Bundle SCSS
    if (!UpdateFile || UpdateFile === "scss") {
        const scssFile = path.join(variationDir, "style.scss")
        if (await fs.pathExists(scssFile)) {
            const result = sass.compile(scssFile, { style: "compressed" })
            await fs.writeFile(path.join(compiledDir, "style.css"), result.css)
        }
    }

    // Bundle JS
    if (!UpdateFile || UpdateFile === "js") {
        const jsFile = path.join(variationDir, "index.js")
        if (await fs.pathExists(jsFile)) {
            const bundle = await rollup({
                input: jsFile,
                plugins: [resolve(), commonjs()],
            })

            await bundle.write({
                file: path.join(compiledDir, "index.js"),
                format: "iife",
                name: "abTestVariation",
            })

            await bundle.close()
        }
    }
}

