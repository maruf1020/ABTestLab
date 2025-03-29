#!/usr/bin/env node

import { program } from "commander";
import prompts from "prompts";
import chalk from "chalk";

import { initCommand } from "./commands/init.js";
import { startCommand } from "./commands/start.js";
import { buildCommand } from "./commands/build.js";
import { createCommand } from "./commands/create.js";
import { settingsCommand } from "./commands/settings.js";

const availableCommands = {
    start: startCommand,
    build: buildCommand,
    create: createCommand,
    init: initCommand,
    settings: settingsCommand,
    exit: () => process.exit(0),
};

const commandAbbreviations = {
    s: 'start',
    b: 'build',
    c: 'create',
    i: 'init',
    set: 'settings',
    e: 'exit',
};

const userFriendlyNames = {
    start: chalk.green('🚀 Start the server'),
    build: chalk.green('📦 Build Test'),
    create: chalk.green('➕ Create a new item'),
    init: chalk.yellowBright('🛠️  Initialize project'),
    settings: chalk.blueBright('⚙️  Update settings'),
    exit: chalk.red('❌ Exit'),
};

program.version("1.0.7").description("A CLI tool for A/B testing directly from a local machine");

program.addCommand(startCommand);
program.addCommand(buildCommand);
program.addCommand(createCommand);
program.addCommand(initCommand);
program.addCommand(settingsCommand);

async function promptUser() {
    const response = await prompts({
        type: 'autocomplete',
        name: 'command',
        message: 'Select a command to run',
        choices: Object.keys(availableCommands).map(command => ({ title: userFriendlyNames[command], value: command })),
        suggest: (input, choices) =>
            Promise.resolve(
                choices.filter(choice =>
                    choice.title.toLowerCase().includes(input.toLowerCase()) // Match anywhere
                )
            ),

    });

    if (response.command) {
        if (response.command === 'exit') {
            process.exit(0);
        } else {
            program.parse(["node", "cli", response.command]);
        }
    }
}

export function runCLI() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        promptUser();
    } else {
        let command = args[0];
        if (commandAbbreviations[command]) {
            command = commandAbbreviations[command];
        }
        if (availableCommands[command]) {
            if (command === 'exit') {
                process.exit(0);
            } else {
                program.parse(["node", "cli", command]);
            }
        } else {
            console.error(`Unknown command: ${args[0]}`);
            process.exit(1);
        }
    }
}

runCLI();