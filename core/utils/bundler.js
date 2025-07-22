import * as sass from "sass";
import fs from "fs-extra";
import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import { rollup } from "rollup";
import chalk from "chalk";
import prettier from "prettier";
import { SETTINGS_FILE } from "../global/config.js";
import json from "@rollup/plugin-json";

async function formatFile(filePath) {
  try {
    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath, "utf8");

    let formatted;

    if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
      // Use babel parser for JavaScript and TypeScript
      formatted = await prettier.format(content, { parser: "babel" });
    } else if (ext === ".css") {
      // Use css parser for CSS files
      formatted = await prettier.format(content, { parser: "css" });
    } else if (ext === ".html") {
      // Use html parser for HTML files
      formatted = await prettier.format(content, { parser: "html" });
    } else {
      console.warn(`Unsupported file type for Prettier: ${filePath}`);
      return;
    }

    // Write the formatted content back to the file
    await fs.writeFile(filePath, formatted);
  } catch (err) {
    console.warn(
      chalk.yellow(`⚠️ Could not format ${filePath}: ${err.message}`)
    );
  }
}

export async function getBundlerData(
  jsFilePath,
  scssFilePath,
  isMinified = false
) {
  try {
    // Compile SCSS to CSS
    let cssContent = "";
    if (await fs.pathExists(scssFilePath)) {
      const sassOptions = isMinified
        ? { style: "compressed" }
        : { style: "expanded" };
      const result = sass.compile(scssFilePath, sassOptions);
      cssContent = result.css;
    } else {
      console.warn(chalk.yellow(`⚠️ SCSS file not found: ${scssFilePath}`));
    }

    // Bundle JS
    let jsContent = "";
    if (await fs.pathExists(jsFilePath)) {
      const bundle = await rollup({
        input: jsFilePath,
        plugins: [resolve(), json()],
        output: {
          format: "esm",
        },
      });

      const { output } = await bundle.generate({
        format: "esm",
        plugins: isMinified ? [terser()] : [],
      });

      jsContent = output[0].code;
      await bundle.close();
    } else {
      console.warn(chalk.yellow(`⚠️ JS file not found: ${jsFilePath}`));
    }

    // Create the self-invoking function with the waitForElem utility and compiled code
    const bundledCode = `
(function() {
    // Utility function to wait for elements
    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    // CSS injection function
    function mainCss() {
        var styles = document.createElement("style");
        styles.setAttribute("type", "text/css");
        document.head.appendChild(styles).textContent =
            "" +
            ${JSON.stringify(cssContent)} +
            "";
    };
    waitForElem('head', mainCss);

    // JS code
    ${jsContent}
})();`;

    return bundledCode;
  } catch (error) {
    console.error(chalk.red("❌ Error in getBundlerData:"), error);
    throw error;
  }
}

export async function bundleVariation(variationDir, UpdateFile) {
  try {
    const compiledDir = path.join(variationDir, "compiled");
    await fs.ensureDir(compiledDir);

    // Bundle SCSS
    if (!UpdateFile || UpdateFile === "scss") {
      try {
        const scssFile = path.join(variationDir, "style.scss");
        if (await fs.pathExists(scssFile)) {
          const result = sass.compile(scssFile, { style: "expanded" }); // Pretty formatting
          // const result = sass.compile(scssFile, { style: "compressed" }) // Minified
          await fs.writeFile(path.join(compiledDir, "style.css"), result.css);
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
        const jsFile = path.join(variationDir, "index.js");
        if (await fs.pathExists(jsFile)) {
          const bundle = await rollup({
            input: jsFile,
            plugins: [resolve(), json()],
            // plugins: [resolve()],
            // plugins: [resolve(), commonjs()],
            output: {
              format: "esm", // Ensures the output is not wrapped in an IIFE
              // format: "iife", // Wraps the output inside an IIFE  (Immediately Invoked Function Expression)
            },
          });

          await bundle.write({
            file: path.join(compiledDir, "index.js"),
            format: "esm", // Change format to "esm" for unwrapped output
          });

          await bundle.close();
          // console.log("✅ JS bundled successfully:", jsFile)
        }
      } catch (error) {
        console.error("❌ Error bundling JS:", error);
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error in bundleVariation:", error);
  }
}

export async function buildVariation(variationDir) {
  try {
    console.log(chalk.yellow("🔨 Start Building files..."));
    const buildDir = path.join(variationDir, "build");
    await fs.ensureDir(buildDir);

    const scssFile = path.join(variationDir, "style.scss");
    const jsFile = path.join(variationDir, "index.js");

    const settingJson = await fs.readJson(SETTINGS_FILE);
    const outputConfig = settingJson.bundler;

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
        plugins: [resolve(), json()],
      });

      await bundle.write({
        file: path.join(buildDir, "index.js"),
        format: "esm",
      });

      await formatFile(path.join(buildDir, "index.js")); // Format index.js

      const minifiedBundle = await bundle.generate({
        format: "esm",
        plugins: [terser()],
      });

      await fs.writeFile(
        path.join(buildDir, "index.min.js"),
        minifiedBundle.output[0].code
      );
      await bundle.close();
    }

    // 3️⃣ Inject CSS into JavaScript
    if ((await fs.pathExists(scssFile)) && (await fs.pathExists(jsFile))) {
      const jsContent = await fs.readFile(
        path.join(buildDir, "index.js"),
        "utf8"
      );
      const cssContent = await fs.readFile(
        path.join(buildDir, "styles.css"),
        "utf8"
      );

      const styleInjectorScript = (css) => `
                (function() {
                    var interval = setInterval(function() {
                        if (document.head) { // Check if <head> exists
                            clearInterval(interval); // Stop checking once found                            
                            var style = document.createElement("style");
                            style.innerHTML = \`${css.replace(/`/g, "\\`")}\`;
                            document.head.appendChild(style);
                            setTimeout(() => {
                              clearInterval(interval); // Clear the interval after 5 seconds
                            }, 5000);                     
                        }
                    }, 100); // Check every 100ms for <head>
                })();
            `;

      // Create `index.with-css.js`
      await fs.writeFile(
        path.join(buildDir, "index.with-css.js"),
        styleInjectorScript(cssContent) + jsContent
      );
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

      await fs.writeFile(
        path.join(buildDir, "index.with-css.min.js"),
        minifiedOutput.output[0].code
      );
      await minifiedJSWithCSS.close();
    }

    // 4️⃣ Clean Up Unwanted Files
    const filesToRemove = {
      "styles.css": !outputConfig.generatePureCSS,
      "styles.min.css": !outputConfig.generateMinifiedCSS,
      "index.js": !outputConfig.generatePureJS,
      "index.min.js": !outputConfig.generateMinifiedJS,
      "index.with-css.js": !outputConfig.generateJSWithCSS,
      "index.with-css.min.js": !outputConfig.generateMinifiedJSWithCSS,
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
    const compiledDir = path.join(targetingDir, "compiled");
    await fs.ensureDir(compiledDir);

    // Bundle JS
    const jsFile = path.join(targetingDir, "customJS.js");
    if (!(await fs.pathExists(jsFile))) {
      console.error(
        "❌ customJS.js not found in targeting directory:",
        targetingDir
      );
      return;
    }

    const bundle = await rollup({
      input: jsFile,
      plugins: [resolve()],
      // plugins: [resolve(), commonjs()],
      output: {
        format: "esm", // Ensures the output is not wrapped in an IIFE
        // format: "iife", // Wraps the output inside an IIFE  (Immediately Invoked Function Expression)
      },
    });

    await bundle.write({
      file: path.join(compiledDir, "customJS.js"),
      format: "esm", // Change format to "esm" for unwrapped output
    });

    await bundle.close();
  } catch (error) {
    console.error("❌ Error bundling targeting JS:", error);
  }
}
