import fs from 'fs-extra';
import path from 'path';
import kleur from 'kleur';
import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';

const settingsPath = path.join(process.cwd(), 'settings.json');

export const settingsCommand = new Command('settings')
    .description('Modify CLI settings interactively with arrow navigation and search')
    .action(async () => {
        let exit = false;
        let settings;

        try {
            const exists = await fs.pathExists(settingsPath);
            if (!exists) {
                console.log(kleur.red(`Settings file not found. Please run "npm run cli init" to initialize the settings.`));
                process.exit(1);
            }

            settings = await fs.readJson(settingsPath);

            while (!exit) {
                const response = await prompts({
                    type: 'select',
                    name: 'setting',
                    message: 'Select setting to modify or choose an option:',
                    choices: [
                        { title: chalk.cyan('📚 History records count: ') + `${chalk.blue(settings.maxHistoryRecords)}`, value: 'maxHistoryRecords' },
                        { title: chalk.cyan('🎨 CSS Reload: ') + `${settings.cssReload ? chalk.green('Yes') : chalk.red('No')}`, value: 'cssReload' },
                        { title: chalk.cyan('🖼️  Display UI: ') + `${settings.displayUI ? chalk.green('Yes') : chalk.red('No')}`, value: 'displayUI' },
                        { title: chalk.cyan('📜 JS Reload: ') + `${settings.jsReload ? chalk.green('Yes') : chalk.red('No')}`, value: 'jsReload' },
                        { title: chalk.cyan('📦 Bundler Settings'), value: 'bundlerSettings' },
                        { title: chalk.magenta('🔙 Back'), value: 'back' },
                        { title: chalk.green('💾 Save and Exit'), value: 'saveExit' },
                        { title: chalk.red('❌ Exit'), value: 'exit' }
                    ]
                });

                if (response.setting === 'exit') {
                    exit = true;
                    process.exit(0);
                }

                if (response.setting === 'saveExit') {
                    await fs.writeJson(settingsPath, settings, { spaces: 4 });

                    console.log(kleur.green('Settings saved successfully!'));
                    exit = true;
                    process.exit(0);
                }

                if (response.setting === 'back') {
                    continue;
                }

                if (response.setting === 'bundlerSettings') {
                    let bundlerExit = false;
                    while (!bundlerExit) {
                        const bundlerOptions = [
                            { title: `${chalk.cyan("📦 Generate Pure JS:")} ${settings.bundler.generatePureJS ? chalk.green('Yes') : chalk.red('No')}`, value: 'generatePureJS' },
                            { title: `${chalk.cyan("📦 Generate Pure CSS:")} ${settings.bundler.generatePureCSS ? chalk.green('Yes') : chalk.red('No')}`, value: 'generatePureCSS' },
                            { title: `${chalk.cyan("📦 Generate Minified JS:")} ${settings.bundler.generateMinifiedJS ? chalk.green('Yes') : chalk.red('No')}`, value: 'generateMinifiedJS' },
                            { title: `${chalk.cyan("📦 Generate Minified CSS:")} ${settings.bundler.generateMinifiedCSS ? chalk.green('Yes') : chalk.red('No')}`, value: 'generateMinifiedCSS' },
                            { title: `${chalk.cyan("📦 Generate JS with CSS:")} ${settings.bundler.generateJSWithCSS ? chalk.green('Yes') : chalk.red('No')}`, value: 'generateJSWithCSS' },
                            { title: `${chalk.cyan("📦 Generate Minified JS with Minified CSS:")} ${settings.bundler.generateMinifiedJSWithCSS ? chalk.green('Yes') : chalk.red('No')}`, value: 'generateMinifiedJSWithCSS' },
                            { title: chalk.magenta('🔙 Back'), value: 'back' },
                            { title: chalk.red('❌ Exit'), value: 'exit' }
                        ];

                        const bundlerResponse = await prompts({
                            type: 'select',
                            name: 'bundlerSetting',
                            message: 'Select a bundler setting to modify:',
                            choices: bundlerOptions
                        });

                        if (bundlerResponse.bundlerSetting === 'exit') {
                            bundlerExit = true;
                            exit = true;
                            console.log(kleur.blue('See you soon!'));
                            process.exit(0);
                        }

                        if (bundlerResponse.bundlerSetting === 'back') {
                            bundlerExit = true;
                            continue;
                        }

                        const settingKey = bundlerResponse.bundlerSetting;

                        const toggleResponse = await prompts({
                            type: 'select',
                            name: 'newValue',
                            message: `Set ${settingKey} to:`,
                            choices: [
                                { title: chalk.green('✅ Yes'), value: true },
                                { title: chalk.red('🔴 No'), value: false },
                                { title: chalk.magenta('🔙 Back'), value: 'back' },
                                { title: chalk.red('❌ Exit'), value: 'exit' }
                            ]
                        });

                        if (toggleResponse.newValue === 'exit') {
                            bundlerExit = true;
                            exit = true;
                            console.log(kleur.blue('See you soon!'));
                            process.exit(0);
                        }

                        if (toggleResponse.newValue === 'back') {
                            continue;
                        }

                        settings.bundler[settingKey] = toggleResponse.newValue;
                    }
                }

                let newValue;

                if (response.setting === 'maxHistoryRecords') {
                    const historyResponse = await prompts({
                        type: 'number',
                        name: 'maxHistoryRecords',
                        message: 'Choose a new value for maximum number of history records (1 - 20):',
                        min: 1,
                        max: 20,
                        initial: settings.maxHistoryRecords,
                        validate: value => (value >= 1 && value <= 20 ? true : 'Please choose a number between 1 and 20')
                    });

                    if (historyResponse.maxHistoryRecords === undefined) {
                        continue;
                    }

                    newValue = historyResponse.maxHistoryRecords;
                    settings.maxHistoryRecords = newValue;
                } else if (response.setting === 'cssReload' || response.setting === 'jsReload' || response.setting === 'displayUI') {
                    const reloadResponse = await prompts({
                        type: 'select',
                        name: 'reload',
                        message: `Choose new value for ${response.setting === 'cssReload' ? 'CSS' : response.setting === 'jsReload' ? 'JS' : 'UI'} reload:`,
                        choices: [
                            { title: chalk.green('✅ Yes'), value: true },
                            { title: chalk.red('🔴 No'), value: false },
                            { title: chalk.magenta('🔙 Back'), value: 'back' },
                            { title: chalk.red('❌ Exit'), value: 'exit' }
                        ]
                    });

                    if (reloadResponse.reload === 'exit') {
                        exit = true;
                        console.log(kleur.blue('See you soon!'));
                        process.exit(0);
                    }

                    if (reloadResponse.reload === 'back') {
                        continue;
                    }

                    newValue = reloadResponse.reload;
                    settings[response.setting] = newValue;
                }
            }
        } catch (error) {
            console.error(kleur.red(`Error updating settings: ${error.message}`));
            process.exit(1);
        }
    });

export default settingsCommand;
