#!/usr/bin/env node

import { program } from "commander"
import { createCommand } from "./commands/create.js"
import { listCommand } from "./commands/list.js"

program.version("1.0.0").description("A CLI tool for A/B testing directly from a local machine")

program.addCommand(createCommand)
program.addCommand(listCommand)

program.parse(process.argv)

