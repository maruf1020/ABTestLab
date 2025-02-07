import * as sass from "sass";
import fs from "fs-extra";

export async function convertScssToCSS(scssFile, cssFile) {
    try {
        const result = sass.compile(scssFile);
        await fs.writeFile(cssFile, result.css);
        // console.log(`Converted ${scssFile} to ${cssFile}`);       
        console.log(`🎨 Live SCSS to CSS converted 🔥`);
    } catch (error) {
        console.error(`Error converting SCSS to CSS: ${error.message}`);
    }
}