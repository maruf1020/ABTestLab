import * as sass from "sass";
import fs from "fs-extra"
import path from "path"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs"
import { rollup } from "rollup"
import chalk from "chalk"
import prettier from "prettier";

async function formatFile(filePath) {
    try {
        const ext = path.extname(filePath);
        const content = await fs.readFile(filePath, "utf8");

        let formatted;

        if (ext === '.js' || ext === '.jsx' || ext === '.ts' || ext === '.tsx') {
            // Use babel parser for JavaScript and TypeScript
            formatted = await prettier.format(content, { parser: "babel" });
        } else if (ext === '.css') {
            // Use css parser for CSS files
            formatted = await prettier.format(content, { parser: "css" });
        } else if (ext === '.html') {
            // Use html parser for HTML files
            formatted = await prettier.format(content, { parser: "html" });
        } else {
            console.warn(`Unsupported file type for Prettier: ${filePath}`);
            return;
        }

        // Write the formatted content back to the file
        await fs.writeFile(filePath, formatted);
        console.log(`Formatted ${filePath}`);

    } catch (err) {
        console.warn(chalk.yellow(`⚠️ Could not format ${filePath}: ${err.message}`));
    }
}

export async function bundleVariation(variationDir, UpdateFile) {
    console.log("🔨 Bundling variation:", variationDir)
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
                        plugins: [resolve()],
                        // plugins: [resolve(), commonjs()],
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

export async function buildVariation(variationDir) {
    try {
        const buildDir = path.join(variationDir, "build");
        await fs.ensureDir(buildDir);

        const scssFile = path.join(variationDir, "style.scss");
        const jsFile = path.join(variationDir, "index.js");

        const outputConfig = {
            generatePureJS: true,
            generatePureCSS: true,
            generateMinifiedJS: true,
            generateMinifiedCSS: true,
            generateJSWithCSS: true,
            generateMinifiedJSWithCSS: true
        };

        // 1️⃣ Compile SCSS (Generate all CSS files)
        if (await fs.pathExists(scssFile)) {
            const expandedCSS = sass.compile(scssFile, { style: "expanded" }).css;
            const minifiedCSS = sass.compile(scssFile, { style: "compressed" }).css;

            await fs.writeFile(path.join(buildDir, "styles.css"), expandedCSS);
            await fs.writeFile(path.join(buildDir, "styles.min.css"), minifiedCSS);
            await formatFile(path.join(buildDir, "styles.css")); // Format styles.css
        }

        // 2️⃣ Bundle JavaScript (Generate all JS files)
        if (await fs.pathExists(jsFile)) {
            const bundle = await rollup({
                input: jsFile,
                plugins: [resolve()],
            });

            await bundle.write({
                file: path.join(buildDir, "index.js"),
                format: "esm"
            });

            await formatFile(path.join(buildDir, "index.js")); // Format index.js

            const minifiedBundle = await bundle.generate({
                format: "esm",
                plugins: [terser()]
            });

            await fs.writeFile(path.join(buildDir, "index.min.js"), minifiedBundle.output[0].code);
            await bundle.close();
        }

        // 3️⃣ Inject CSS into JavaScript
        if (await fs.pathExists(scssFile) && await fs.pathExists(jsFile)) {
            const jsContent = await fs.readFile(path.join(buildDir, "index.js"), "utf8");
            const cssContent = await fs.readFile(path.join(buildDir, "styles.css"), "utf8");

            const styleInjectorScript = (css) => `
                (function() {
                    var interval = setInterval(function() {
                        if (document.head) { // Check if <head> exists
                            clearInterval(interval); // Stop checking once found

                            setTimeout(function() { // Wait 5 seconds before injecting
                                var style = document.createElement("style");
                                style.innerHTML = \`${css.replace(/`/g, "\\`")}\`;
                                document.head.appendChild(style);
                            }, 5000); // Inject after 5 seconds
                        }
                    }, 100); // Check every 100ms for <head>
                })();
            `;

            // Create `index.with-css.js`
            await fs.writeFile(path.join(buildDir, "index.with-css.js"), styleInjectorScript(cssContent) + jsContent);
            await formatFile(path.join(buildDir, "index.with-css.js")); // Format index.with-css.js

            // Create `index.with-css.min.js`
            const minifiedJSWithCSS = await rollup({
                input: path.join(buildDir, "index.with-css.js"),
                plugins: [resolve(), terser()],
            });

            const minifiedOutput = await minifiedJSWithCSS.generate({
                format: "esm",
                plugins: [terser()],
            });

            await fs.writeFile(path.join(buildDir, "index.with-css.min.js"), minifiedOutput.output[0].code);
            await minifiedJSWithCSS.close();
        }

        // 4️⃣ Clean Up Unwanted Files
        const filesToRemove = {
            "styles.css": !outputConfig.generatePureCSS,
            "styles.min.css": !outputConfig.generateMinifiedCSS,
            "index.js": !outputConfig.generatePureJS,
            "index.min.js": !outputConfig.generateMinifiedJS,
            "index.with-css.js": !outputConfig.generateJSWithCSS,
            "index.with-css.min.js": !outputConfig.generateMinifiedJSWithCSS
        };

        for (const [file, shouldRemove] of Object.entries(filesToRemove)) {
            if (shouldRemove) {
                await fs.remove(path.join(buildDir, file));
            }
        }

        console.log(chalk.green("✅ Build process completed successfully!"));
    } catch (error) {
        console.error(chalk.red("❌ Error during build process:"), error);
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
            plugins: [resolve()],
            // plugins: [resolve(), commonjs()],
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
