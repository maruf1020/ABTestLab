import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import chalk from "chalk"
import { downloadSocketIO } from "../scripts/download-socket-io.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createSettingsFile() {
    const settingsPath = path.join(process.cwd(), "settings.json")
    const defaultSettings = {
        cssReload: false,
        jsReload: true,
        maxHistoryRecords: 10,
        _comments: {
            cssReload:
                "If true, the page will reload when CSS changes are detected. If false, CSS changes will be applied without reloading.",
            jsReload:
                "If true, the page will reload when CSS changes are detected. If false, CSS changes will be applied without reloading.",
            maxHistoryRecords: "The maximum number of history records to keep in the history panel.",
        },
    }

    try {
        await fs.writeJson(settingsPath, defaultSettings, { spaces: 4 })
        console.log(chalk.green("settings.json file created successfully!"))
    } catch (error) {
        console.error(chalk.red(`Failed to create settings.json file: ${error.message}`))
    }
}

export async function initializeSkeleton() {
    try {
        console.log(chalk.yellow("Creating template folders and downloading dependency files..."))

        await downloadSocketIO()
        await createSettingsFile()

        const skeletonDir = path.resolve(__dirname, "..", "..", "skeleton")

        // Create skeleton directory
        await fs.ensureDir(skeletonDir)

        // Create variation template
        const variationDir = path.join(skeletonDir, "variation", "default")
        await fs.ensureDir(variationDir)
        await fs.writeFile(path.join(variationDir, "index.js"), "// JavaScript file for variation logic")
        await fs.writeFile(path.join(variationDir, "style.scss"), "/* SCSS file for variation styling */")
        await fs.writeJson(path.join(variationDir, "info.json"), { name: "Variation Name" })

        // Create targeting folder structure
        const targetingDir = path.join(skeletonDir, "targeting")
        await fs.ensureDir(targetingDir)

        // elementChecker.json
        const elementChecker = {
            "multiple_rules_check_by_condition": "OR",
            "rules": [],
            "_comments": {
                "EXAMPLE": [
                    {
                        "selector": "body",
                        "is_matched": true,
                        "waiting_time": 1000,
                        "total_element_count": 1
                    },
                    {
                        "selector": ".grid-plp",
                        "is_matched": false,
                        "waiting_time": 2000,
                        "total_element_count": 1
                    }
                ],
                "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
                "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
                "selector": "Define the CSS selector for the element you want to check.",
                "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
                "waiting_time": "Time in milliseconds to wait for the element to appear.",
                "total_element_count": "Number of elements that should match the selector."
            }
        }
        await fs.writeJson(path.join(targetingDir, "elementChecker.json"), elementChecker, { spaces: 2 })

        // customJS.js (do not change the format here. if you do it it will change the format in the test. later I will fix this)
        const customJS = `//either return true or call active function with true parameter to make the test active. 
export default function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
}   `
        await fs.writeFile(path.join(targetingDir, "customJS.js"), customJS)

        // urlChecker.json
        const urlChecker = {
            "multiple_rules_check_by_condition": "OR",
            "targeting_rules": [],
            "_comment": {
                "description": "Use 'targeting_rules' to define conditions for matching URLs.",
                "rules": [
                    "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
                    "Use 'EXACTLY_MATCHED' to match the exact URL.",
                    "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
                    "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
                    "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
                    "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
                    "If multiple conditions are added, all will be checked against the target URLs.",
                    "By default, your test will only run under the website's hostname unless specified otherwise."
                ],
                "example": {
                    "multiple_rules_check_by_condition": "OR",
                    "targeting_rules": [
                        {
                            "value": "https://www.example.com",
                            "match_type": "EXACTLY_MATCHED"
                        },
                        {
                            "value": "example.com",
                            "match_type": "URL_CONTAINS"
                        },
                        {
                            "value": "blockedsite.com",
                            "match_type": "URL_DOES_NOT_CONTAIN"
                        },
                        {
                            "value": "/example\\.com/gi",
                            "match_type": "REGEX_MATCHED"
                        },
                        {
                            "value": "/forbidden\\.com/gi",
                            "match_type": "REGEX_DOES_NOT_MATCH"
                        }
                    ]
                }
            }
        }
        await fs.writeJson(path.join(targetingDir, "urlChecker.json"), urlChecker, { spaces: 2 })

        // Create targetMet folder and files
        const targetMetDir = path.join(skeletonDir, "targetMet")
        await fs.ensureDir(targetMetDir)

        // Create customJS.js file
        const customJSFile = `export default function checker(activator) {
    const checkingTimeout = 3000;
    return new Promise((resolve) => {
        const startTime = Date.now();
        const result = {
            status: false,
            messages: [],
            summary: '',
            time: 0,
            details: {
                activationMethod: null,
                checkingTimeout,
                receivedCallback: false,
                executionTime: 0,
                triggeredBy: 'timeout',
                wasImmediate: false
            }
        };

        let isCompleted = false;
        let timeoutId;

        const active = (value) => {
            if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeoutId);

                result.status = value === true;
                result.details.receivedCallback = true;
                result.details.triggeredBy = value ? 'manual_activation' : 'manual_deactivation';
                result.details.activationMethod = 'callback';

                result.messages.push(value ?
                    'Activated through manual callback' :
                    'Deactivated through manual callback'
                );

                finalizeResult();
                resolve(result);
            }
        };

        const finalizeResult = () => {
            result.time = Date.now() - startTime;
            result.details.executionTime = result.time;
            result.summary = result.status ?
                'Active (' + result.details.triggeredBy.replace(/_/g, ' ') + ')' :
                'Inactive (' + result.details.triggeredBy.replace(/_/g, ' ') + ')';
        };

        try {
            const activatorResult = activator(active);

            // Only handle EXPLICIT boolean returns immediately
            if (typeof activatorResult === 'boolean') {
                result.status = activatorResult;
                result.details = {
                    ...result.details,
                    activationMethod: 'immediate',
                    triggeredBy: activatorResult ?
                        'immediate_activation' :
                        'immediate_deactivation',
                    wasImmediate: true
                };
                result.messages.push('Immediate ' + (activatorResult ? 'activation' : 'deactivation') + 'from return value');
                finalizeResult();
                resolve(result);
                return;
            }

            // For non-boolean returns, wait for callback/timeout
            timeoutId = setTimeout(() => {
                if (!isCompleted) {
                    result.messages.push('Timed out after ' + checkingTimeout + 'ms');
                    result.details.triggeredBy = 'timeout';
                    finalizeResult();
                    resolve(result);
                }
            }, checkingTimeout);

        } catch (error) {
            result.messages.push('Activator error: ' + error.message); 
            result.details.triggeredBy = 'error';
            finalizeResult();
            resolve(result);
        }
    });
}


// // Output Format:
// {
//     status: boolean,      // Final activation state
//     messages: string[],   // Sequence of events
//     summary: string,      // One-line conclusion
//     time: number,         // Total execution time
//     details: {
//         activationMethod: null | 'immediate' | 'callback',
//         checkingTimeout: 3000,
//         receivedCallback: boolean,
//         executionTime: number,
//         triggeredBy: 'immediate_activation' | 'immediate_deactivation' |
//                     'manual_activation' | 'manual_deactivation' |
//                     'timeout' | 'error',
//         wasImmediate: boolean
//     }
// }`
        await fs.writeFile(path.join(targetMetDir, "customJS.js"), customJSFile)

        // Create urlChecker.js file
        const urlCheckerFile = `export default function checker(rulesConfig) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const result = {
            status: true,
            messages: [],
            summary: "",
            time: 0,
            details: {
                currentURL: window.location.href,
                conditionType: null,
                rulesEvaluated: [],
            },
        };
    
        // Handle empty rules case
        if (
            !rulesConfig.targeting_rules ||
            rulesConfig.targeting_rules.length === 0
        ) {
            result.messages.push("No targeting rules defined. All URLs are allowed.");
            result.summary = "No targeting rules defined. All URLs are allowed.";
            result.time = Date.now() - startTime;
            resolve(result);
            return;
        }
    
        const currentURL = window.location.href;
        result.details.conditionType =
            rulesConfig.multiple_rules_check_by_condition || "OR";
    
        // Evaluate each rule
        result.details.rulesEvaluated = rulesConfig.targeting_rules.map((rule) => {
            const ruleResult = { rule, pass: false, message: "" };
    
            try {
            switch (rule.match_type) {
                case "EXACTLY_MATCHED":
                ruleResult.pass = currentURL === rule.value;
                ruleResult.message = ruleResult.pass
                    ? 'URL exactly matches " ' + rule.value + ' "' 
                    : 'URL does not exactly match " ' + rule.value + ' "' + '(current: ' + currentURL + ')';
                break;
    
                case "URL_CONTAINS":
                ruleResult.pass = currentURL.includes(rule.value);
                ruleResult.message = ruleResult.pass
                    ? 'URL contains " ' + rule.value + ' "'
                    : 'URL does not contain " ' + rule.value + ' "';
                break;
    
                case "URL_DOES_NOT_CONTAIN":
                ruleResult.pass = !currentURL.includes(rule.value);
                ruleResult.message = ruleResult.pass
                    ? 'URL successfully excluded "' + rule.value + '"'
                    : 'URL contains excluded string "' +rule.value + '"';
                break;
    
                case "REGEX_MATCHED": {
                const cleanedRegex = rule.value.replace(/^\/|\/[gimuy]*$/g, "");
                const regex = new RegExp(cleanedRegex, "gi");
                ruleResult.pass = regex.test(currentURL);
                ruleResult.message = ruleResult.pass
                    ? 'URL matched regex pattern ' + rule.value
                    : 'URL failed to match regex pattern ' + rule.value;
                break;
                }
    
                case "REGEX_DOES_NOT_MATCH": {
                const cleanedRegex = rule.value.replace(/^\/|\/[gimuy]*$/g, "");
                const regex = new RegExp(cleanedRegex, "gi");
                ruleResult.pass = !regex.test(currentURL);
                ruleResult.message = ruleResult.pass
                    ? 'URL correctly excluded by regex pattern ' + rule.value
                    : 'URL matched excluded regex pattern ' + rule.value 
                break;
                }
    
                default:
                ruleResult.message = 'Unknown match type: ' + rule.match_type;
            }
            } catch (error) {
            ruleResult.message = 'Error evaluating rule: ' + error.message;
            }
    
            result.messages.push(ruleResult.message);
            return ruleResult;
        });
    
        // Determine final status
        const passes = result.details.rulesEvaluated.map((r) => r.pass);
        result.status =
            result.details.conditionType === "AND"
            ? passes.every(Boolean)
            : passes.some(Boolean);
    
        // Generate summary
        const ruleCount = result.details.rulesEvaluated.length;
        const passedCount = passes.filter(Boolean).length;
    
        result.summary = result.status
            ? 'Passed - ' + passedCount + '/' + ruleCount + 'rules matched (' + result.details.conditionType + 'condition)'
            : 'Failed - Only ' + passedCount + '/' + ruleCount +  'rules matched (required ' +result.details.conditionType + ')';
    
        // Add timing
        result.time = Date.now() - startTime;
    
        resolve(result);
    });
}
    
    
// // Detailed Output Structure:
// {
//     status: boolean,       // Final result
//     messages: string[],    // Individual rule messages
//     summary: string,       // Overall result summary
//     time: number,          // Execution time in ms
//     details: {             // Detailed diagnostics
//         currentURL: string,
//         conditionType: string,
//         rulesEvaluated: [{
//             rule: RuleConfig,
//             pass: boolean,
//             message: string
//         }]
//     }
// }


// // Example Output:
// {
//     status: true,
//     messages: [
//         "URL contains 'example'",
//         "URL matched regex pattern /example.*/gi"
//     ],
//     summary: "Passed - 2/2 rules matched (OR condition)",
//     time: 12,
//     details: {
//         currentURL: "https://www.example.com/path",
//         conditionType: "OR",
//         rulesEvaluated: [
//             {/* full rule config + pass status + message */}
//         ]
//     }
// }`
        await fs.writeFile(path.join(targetMetDir, "urlChecker.js"), urlCheckerFile)

        // Create elementChecker.js file
        const elementCheckerFile = `export default function checker(rulesConfig) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const result = {
            status: true,
            messages: [],
            summary: '',
            time: 0,
            details: {
                conditionType: rulesConfig.multiple_rules_check_by_condition || 'OR',
                rulesEvaluated: [],
                totalTime: 0,
                totalChecks: 0
            }
        };

        if (!rulesConfig.rules || rulesConfig.rules.length === 0) {
            result.messages.push('No rules defined - running test on all pages');
            result.summary = 'No rules defined. Test will run on all pages.';
            result.time = Date.now() - startTime;
            resolve(result);
            return;
        }

        const ruleChecks = rulesConfig.rules.map((rule) => {
            return new Promise((ruleResolve) => {
            const ruleStartTime = Date.now();
            let intervalId;
            let timeoutId;
            let finalCheckDone = false;
            let checksPerformed = 0;

            const evaluateCondition = (finalCheck = false) => {
                checksPerformed++;
                const elements = document.querySelectorAll(rule.selector);
                const elementCount = elements.length;
                const countMatches = elementCount === rule.total_element_count;

                let pass = false;
                let message = '';

                if (rule.is_matched) {
                    if (countMatches && !finalCheck) {
                        // Immediate success for positive match
                        pass = true;
                        message = 'Element found immediately: ' + rule.selector  +
                        ' (Expected ' + rule.total_element_count + ', Found ' + elementCount + ')';
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    } else if (finalCheck) {
                        // Final check for positive match
                        pass = countMatches;
                        message = pass
                        ? 'Element found after full wait: ' + rule.selector +
                        ' (Expected ' + rule.total_element_count + ', Found ' + elementCount + ')' 
                        : 'Element not found after ' + rule.waiting_time + 'ms: ' + rule.selector +
                        'Expected ' + rule.total_element_count + ', Found ' + elementCount + ')';
                    }
                } else {
                    if (countMatches && !finalCheck) {
                        // Immediate failure for negative match
                        pass = false;
                        message = 'Unwanted element found immediately: ' + rule.selector  +
                        ' (Found ' + elementCount +  'when expecting none)';
                        clearTimeout(timeoutId);
                        clearInterval(intervalId);
                    } else if (finalCheck) {
                        // Final check for negative match
                        pass = !countMatches;
                        message = pass
                        ? 'No unwanted elements after ' + rule.waiting_time + 'ms: ' + rule.selector
                        : 'Unwanted elements persisted: ' + rule.selector  +
                        ' (Found ' + elementCount +  'when expecting none)';
                    }
                }

                if (message) {
                    ruleResolve({
                        ...rule,
                        pass,
                        time: Date.now() - ruleStartTime,
                        checksPerformed,
                        finalElementCount: elementCount,
                        message
                    });
                    finalCheckDone = true;
                }
            };

            // Initial immediate check
            evaluateCondition();

            // Only set up interval if not already resolved
            if (!finalCheckDone) {
                intervalId = setInterval(evaluateCondition, 100);
                timeoutId = setTimeout(() => {
                    clearInterval(intervalId);
                    if (!finalCheckDone) evaluateCondition(true);
                }, rule.waiting_time);
            }
            });
        });

        Promise.allSettled(ruleChecks).then((results) => {
            const resolvedRules = results.map(r => r.value);

            result.details.rulesEvaluated = resolvedRules;
            result.details.totalTime = Date.now() - startTime;
            result.details.totalChecks = resolvedRules.reduce((sum, rule) => sum + rule.checksPerformed, 0);

            resolvedRules.forEach(rule => {
                result.messages.push(rule.message);
            });

            const passStatuses = resolvedRules.map(r => r.pass);
            result.status = result.details.conditionType === "AND"
            ? passStatuses.every(Boolean)
            : passStatuses.some(Boolean);

            const passedCount = passStatuses.filter(Boolean).length;
            result.summary = result.status
            ? 'Passed - ' + passedCount + '/' + resolvedRules.length +  'rules met'
            : 'Failed - ' + passedCount + '/' + resolvedRules.length +  'rules met';

            result.time = result.details.totalTime;
            resolve(result);
        });
    });
}


// // Detailed Output Structure:
// {
//     status: boolean,       // Final test result
//     messages: string[],    // Individual rule status messages
//     summary: string,       // Consolidated result summary
//     time: number,          // Total execution time in ms
//     details: {
//         conditionType: string, // 'AND'/'OR'
//         totalChecks: number,   // Total number of DOM checks performed
//         totalTime: number,    // Total execution time in ms
//         rulesEvaluated: [     // Detailed results for each rule
//             {
//                 // Original rule configuration
//                 selector: string,
//                 is_matched: boolean,
//                 waiting_time: number,
//                 total_element_count: number,
                
//                 // Result details
//                 pass: boolean,
//                 message: string,
//                 time: number,     // Time taken for this specific rule check
//                 checksPerformed: number, // Number of DOM checks for this rule
//                 finalElementCount: number // Elements found at resolution time
//             }
//         ]
//     }
// }

// // Example Output:
// {
//     status: false,
//     messages: [
//         "Element found immediately: #header (Expected 1, Found 1)",
//         "Unwanted element found immediately: .popup (Found 1 when expecting none)"
//     ],
//     summary: "Failed - 1/2 rules met",
//     time: 25,
//     details: {
//         conditionType: "AND",
//         totalChecks: 2,
//         totalTime: 25,
//         rulesEvaluated: [
//             {
//                 selector: "#header",
//                 is_matched: true,
//                 waiting_time: 10000,
//                 total_element_count: 1,
//                 pass: true,
//                 message: "Element found immediately: #header (Expected 1, Found 1)",
//                 time: 5,
//                 checksPerformed: 1,
//                 finalElementCount: 1
//             },
//             {
//                 selector: ".popup",
//                 is_matched: false,
//                 waiting_time: 5000,
//                 total_element_count: 1,
//                 pass: false,
//                 message: "Unwanted element found immediately: .popup (Found 1 when expecting none)",
//                 time: 8,
//                 checksPerformed: 1,
//                 finalElementCount: 1
//             }
//         ]
//     }
// }`
        await fs.writeFile(path.join(targetMetDir, "elementChecker.js"), elementCheckerFile)

        console.log(chalk.green("All the Skeleton folders and Files are created successfully!"))
    } catch (error) {
        console.error(chalk.red(`Failed to create template folders: ${error.message}`))
        throw error
    }
}

