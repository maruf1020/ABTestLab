import fs from "fs-extra";
import path from "path";
import kleur from "kleur";
import readline from "readline";
import { Command } from "commander";

const settingsPath = path.join(process.cwd(), "settings.json");

export const settingsCommand = new Command("settings")
    .description("Modify CLI settings interactively with arrow navigation and search")
    .action(async () => {
        try {
            const exists = await fs.pathExists(settingsPath);
            if (!exists) {
                console.log(kleur.red(`Settings file not found. Please run "npm run cli init" to initialize the settings.`));
                process.exit(1);
            }

            let settings = await fs.readJson(settingsPath);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);

            let currentField = 0;
            let isEditingValue = false;
            let tempNumber = settings.maxHistoryRecords.toString();
            let searchMode = false;
            let searchQuery = "";

            const fields = [
                {
                    question: "Maximum number of history records to keep",
                    type: "number",
                    key: "maxHistoryRecords",
                    getValue: () => tempNumber
                },
                {
                    question: "Reload page on CSS changes?",
                    type: "boolean",
                    key: "cssReload",
                    getValue: () => settings.cssReload ? "yes" : "no"
                },
                {
                    question: "Reload page on JavaScript changes?",
                    type: "boolean",
                    key: "jsReload",
                    getValue: () => settings.jsReload ? "yes" : "no"
                }
            ];

            const getFilteredFields = () => {
                if (!searchQuery) return fields;
                return fields.filter(field =>
                    field.question.toLowerCase().includes(searchQuery.toLowerCase())
                );
            };

            const render = () => {
                console.clear();
                console.log(kleur.magenta("Use ← → arrows to switch between question/answer"));
                console.log(kleur.magenta("Use ↑ ↓ arrows to navigate questions or change values"));
                console.log(kleur.magenta("Press '/' to search questions (when on question side)"));
                console.log(kleur.magenta("Press Enter to save and exit\n"));

                console.log(`${kleur.cyan("? ")}Please update your settings by following instructions ${kleur.cyan("?")}`);

                if (searchMode) {
                    console.log(kleur.yellow(`Search: ${searchQuery}_`));
                }

                const filteredFields = getFilteredFields();

                if (filteredFields.length === 0) {
                    console.log(kleur.yellow("\nNo matching questions found."));
                    return;
                }

                currentField = Math.min(currentField, filteredFields.length - 1);

                filteredFields.forEach((field, index) => {
                    const isCurrentField = index === currentField;
                    let displayText = "";

                    const questionText = field.question;
                    if (searchQuery) {
                        const regex = new RegExp(`(${searchQuery})`, 'gi');
                        displayText += questionText.replace(regex, match =>
                            kleur.yellow(match)
                        );
                    } else {
                        displayText += isCurrentField && !isEditingValue
                            ? kleur.cyan().bold().underline(questionText) // Added underline here
                            : kleur.white(questionText);
                    }

                    const valueText = field.getValue();
                    displayText += ": " + (isCurrentField && isEditingValue
                        ? kleur.cyan().bold().underline(valueText) // Added underline here
                        : kleur.white(valueText));

                    console.log(`${isCurrentField ? ">   " : "    "}${displayText}`);
                });
            };

            process.stdin.on("keypress", (str, key) => {
                if (key.ctrl && key.name === "c") {
                    process.exit();
                }

                if (searchMode && !isEditingValue) {
                    if (key.name === "escape") {
                        searchMode = false;
                        searchQuery = "";
                    } else if (key.name === "backspace") {
                        searchQuery = searchQuery.slice(0, -1);
                    } else if (key.name === "return") {
                        searchMode = false;
                    } else if (!key.ctrl && !key.meta && str && str.length === 1) {
                        searchQuery += str;
                    }
                    render();
                    return;
                }

                if (key.name === "return") {
                    settings.maxHistoryRecords = parseInt(tempNumber, 10);
                    fs.writeJsonSync(settingsPath, settings, { spaces: 4 });
                    console.log(kleur.green("\nSettings updated successfully!"));
                    process.exit();
                }

                if (!isEditingValue && str === "/") {
                    searchMode = true;
                    searchQuery = "";
                    render();
                    return;
                }

                if (key.name === "left" || key.name === "right") {
                    isEditingValue = !isEditingValue;
                }

                if (key.name === "up" || key.name === "down") {
                    const filteredFields = getFilteredFields();
                    if (!isEditingValue) {
                        currentField = key.name === "up"
                            ? (currentField - 1 + filteredFields.length) % filteredFields.length
                            : (currentField + 1) % filteredFields.length;
                    } else {
                        const field = filteredFields[currentField];
                        if (field.type === "number") {
                            const num = parseInt(tempNumber, 10);
                            tempNumber = String(key.name === "up" ? num + 1 : Math.max(1, num - 1));
                        } else if (field.type === "boolean") {
                            settings[field.key] = !settings[field.key];
                        }
                    }
                }

                if (isEditingValue &&
                    currentField === 0 &&
                    !key.ctrl &&
                    !key.meta &&
                    /^\d$/.test(str)) {
                    tempNumber = tempNumber === "0" ? str : tempNumber + str;
                }

                if (isEditingValue &&
                    currentField === 0 &&
                    key.name === "backspace") {
                    tempNumber = tempNumber.slice(0, -1) || "0";
                }

                render();
            });

            render();

        } catch (error) {
            console.error(kleur.red(`Error updating settings: ${error.message}`));
            process.exit(1);
        }
    });

export default settingsCommand;