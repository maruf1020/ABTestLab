import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { downloadSocketIO } from "../scripts/download-socket-io.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeSkeleton() {
    try {
        console.log(chalk.yellow("Creating template folders and downloading dependency files..."));

        await downloadSocketIO();

        const skeletonDir = path.resolve(__dirname, "..", "..", "skeleton");

        // Create skeleton directory
        await fs.ensureDir(skeletonDir);

        // Create variation template
        const variationDir = path.join(skeletonDir, "variation");
        await fs.ensureDir(variationDir);
        await fs.writeFile(path.join(variationDir, "index.js"), "// JavaScript file for variation logic");
        await fs.writeFile(path.join(variationDir, "style.scss"), "/* SCSS file for variation styling */");
        await fs.writeJson(path.join(variationDir, "info.json"), { name: "Variation Name" });

        // Create targeting folder structure
        const targetingDir = path.join(skeletonDir, "targeting");
        await fs.ensureDir(targetingDir);

        // elementChecker.json
        const elementChecker = {
            multiple_rules_check_by_condition: "OR",
            rules: [],
            _comments: {
                EXAMPLE: [
                    { selector: "body", is_matched: true, waiting_time: 1000, total_element_count: 1 },
                    { selector: ".grid-plp", is_matched: false, waiting_time: 2000, total_element_count: 1 }
                ],
                "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
                "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
                "selector": "Define the CSS selector for the element you want to check.",
                "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
                "waiting_time": "Time in milliseconds to wait for the element to appear.",
                "total_element_count": "Number of elements that should match the selector."
            }
        };
        await fs.writeJson(path.join(targetingDir, "elementChecker.json"), elementChecker, { spaces: 2 });

        // customJS.js (do not change the format here. if you do it it will change the format in the test. later I will fix this)
        const customJS = `//either return true or call active function with true parameter to make the test active. and checkingTimeOut will wait until this waiting time
export const checkingTimeOut = 0; // in milliseconds
export default function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
}   `;
        await fs.writeFile(path.join(targetingDir, "customJS.js"), customJS);

        // urlChecker.json
        const urlChecker = {
            multiple_rules_check_by_condition: "OR",
            targeting_rules: [
                { value: "/https?:\\/\\/(www\\.)?[^\\s/$.?#].[^\\s]*/gi", match_type: "REGEX_MATCHED" }
            ],
            _comment: {
                description: "Use 'targeting_rules' to define conditions for matching URLs.",
                rules: [
                    "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
                    "Use 'EXACTLY_MATCHED' to match the exact URL.",
                    "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
                    "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
                    "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
                    "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
                    "If multiple conditions are added, all will be checked against the target URLs.",
                    "By default, your test will only run under the website's hostname unless specified otherwise."
                ],
                example: {
                    multiple_rules_check_by_condition: "OR",
                    targeting_rules: [
                        { value: "https://www.example.com", match_type: "EXACTLY_MATCHED" },
                        { value: "example.com", match_type: "URL_CONTAINS" },
                        { value: "blockedsite.com", match_type: "URL_DOES_NOT_CONTAIN" },
                        { value: "/example\\.com/gi", match_type: "REGEX_MATCHED" },
                        { value: "/forbidden\\.com/gi", match_type: "REGEX_DOES_NOT_MATCH" }
                    ]
                }
            }
        };
        await fs.writeJson(path.join(targetingDir, "urlChecker.json"), urlChecker, { spaces: 2 });

        console.log(chalk.green("Template folders created successfully!"));
    } catch (error) {
        console.error(chalk.red(`Failed to create template folders: ${error.message}`));
        throw error;
    }
}