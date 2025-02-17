import * as sass from "sass";
import fs from "fs-extra";

export async function convertScssToCSS(scssFile, cssFile) {
    try {
        const result = sass.compile(scssFile);
        await fs.writeFile(cssFile, result.css);
    } catch (error) {
        console.error(`Error converting SCSS to CSS: ${error.message}`);
    }
}