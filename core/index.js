#!/usr/bin/env node

import { program } from "commander";
import prompts from "prompts";
import { listCommand } from "./commands/list.js";
import { initCommand } from "./commands/init.js";
import { startCommand } from "./commands/start.js";
import { createCommand } from "./commands/create.js";
import { settingsCommand } from "./commands/settings.js";

const availableCommands = {
    list: listCommand,
    init: initCommand,
    start: startCommand,
    create: createCommand,
    settings: settingsCommand,
};

const commandAbbreviations = {
    l: 'list',
    i: 'init',
    s: 'start',
    c: 'create',
    set: 'settings',
};

const userFriendlyNames = {
    list: 'List all items',
    init: 'Initialize project',
    start: 'Start the server',
    create: 'Create a new item',
    settings: 'Update settings',
};

program.version("1.0.7").description("A CLI tool for A/B testing directly from a local machine");

program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(listCommand);
program.addCommand(startCommand);
program.addCommand(settingsCommand);

async function promptUser() {
    const response = await prompts({
        type: 'select',
        name: 'command',
        message: 'Select a command to run',
        choices: Object.keys(availableCommands).map(command => ({ title: userFriendlyNames[command], value: command })),
    });

    if (response.command) {
        program.parse(["node", "cli", response.command]);
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
            program.parse(["node", "cli", command]);
        } else {
            console.error(`Unknown command: ${args[0]}`);
            process.exit(1);
        }
    }
}

runCLI();