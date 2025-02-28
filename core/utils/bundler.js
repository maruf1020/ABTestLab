import fs from "fs-extra"
import path from "path"
import * as sass from "sass";
import { rollup } from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export async function bundleVariation(variationDir, UpdateFile) {
    try {
        const compiledDir = path.join(variationDir, "compiled")
        await fs.ensureDir(compiledDir)

        // Bundle SCSS
        if (!UpdateFile || UpdateFile === "scss") {
            try {
                const scssFile = path.join(variationDir, "style.scss")
                if (await fs.pathExists(scssFile)) {
                    const result = sass.compile(scssFile, { style: "expanded" }); // Pretty formatting
                    // const result = sass.compile(scssFile, { style: "compressed" }) // Minified
                    await fs.writeFile(path.join(compiledDir, "style.css"), result.css)
                    // console.log("✅ SCSS compiled successfully:", scssFile)
                }
            } catch (error) {
                const errorLines = error.message.split("\n").slice(0, 5).join("\n"); // Get first 5 lines
                console.error(`❌ Error compiling SCSS:\n${errorLines}`);
            }
        }

        // Bundle JS
        if (!UpdateFile || UpdateFile === "js") {
            try {
                const jsFile = path.join(variationDir, "index.js")
                if (await fs.pathExists(jsFile)) {
                    const bundle = await rollup({
                        input: jsFile,
                        plugins: [resolve(), commonjs()],
                        output: {
                            format: "esm", // Ensures the output is not wrapped in an IIFE
                            // format: "iife", // Wraps the output inside an IIFE  (Immediately Invoked Function Expression)
                        },
                    })

                    await bundle.write({
                        file: path.join(compiledDir, "index.js"),
                        format: "esm", // Change format to "esm" for unwrapped output
                    })

                    await bundle.close()
                    // console.log("✅ JS bundled successfully:", jsFile)
                }
            } catch (error) {
                console.error("❌ Error bundling JS:", error)
            }
        }
    } catch (error) {
        console.error("❌ Unexpected error in bundleVariation:", error)
    }
}

export async function bundleTargeting(targetingDir) {
    try {
        const compiledDir = path.join(targetingDir, "compiled")
        await fs.ensureDir(compiledDir)

        // Bundle JS
        const jsFile = path.join(targetingDir, "customJS.js")
        if (!await fs.pathExists(jsFile)) {
            console.error("❌ customJS.js not found in targeting directory:", targetingDir)
            return
        }

        const bundle = await rollup({
            input: jsFile,
            plugins: [resolve(), commonjs()],
            output: {
                format: "esm", // Ensures the output is not wrapped in an IIFE
                // format: "iife", // Wraps the output inside an IIFE  (Immediately Invoked Function Expression)
            },
        })

        await bundle.write({
            file: path.join(compiledDir, "customJS.js"),
            format: "esm", // Change format to "esm" for unwrapped output
        })

        await bundle.close()
    } catch (error) {
        console.error("❌ Error bundling targeting JS:", error)
    }
}
