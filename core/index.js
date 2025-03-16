#!/usr/bin/env node

import { program } from "commander";
import prompts from "prompts";
import chalk from "chalk";

// import { listCommand } from "./commands/list.js";
import { initCommand } from "./commands/init.js";
import { startCommand } from "./commands/start.js";
import { createCommand } from "./commands/create.js";
import { settingsCommand } from "./commands/settings.js";

const availableCommands = {
    // list: listCommand,
    create: createCommand,
    start: startCommand,
    init: initCommand,
    settings: settingsCommand,
    exit: () => process.exit(0),
};

const commandAbbreviations = {
    // l: 'list',
    c: 'create',
    s: 'start',
    i: 'init',
    set: 'settings',
    e: 'exit',
};

const userFriendlyNames = {
    // list: 'List all items',
    create: 'Create a new item',
    start: 'Start the server',
    init: 'Initialize project',
    settings: 'Update settings',
    exit: chalk.red('❌ Exit'),
};

program.version("1.0.7").description("A CLI tool for A/B testing directly from a local machine");

program.addCommand(initCommand);
program.addCommand(createCommand);
// program.addCommand(listCommand);
program.addCommand(startCommand);
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