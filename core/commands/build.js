import debug from "debug";
import kleur from "kleur";
import chalk from "chalk";
import prompts from "prompts";
import { Command } from "commander";

import { handleLatestTest, viewTestHistory } from "../utils/buildUtils.js";
import { loadHistory } from "../utils/historyUtils.js";
import { runCLI } from "../index.js";

const log = debug("ab-testing-cli:build");

export const buildCommand = new Command("build")
  .description("Build a test")
  .option("-w, --website <name>", "Specify the website name")
  .option("-t, --test <name>", "Specify the test name")
  .action(async (options) => {
    try {
      await mainMenu(options);
    } catch (error) {
      console.error(kleur.red(`Error: ${error.message}`));
      log(`Stack trace: ${error.stack}`);
    }
  });

async function mainMenu(options) {
  const history = await loadHistory();
  if (history.length < 1) {
    console.log(
      kleur.red(
        "No tests found on the history. Either build a test by  navigate test list or run a single test to create a history."
      )
    );
    runCLI();
    return null;
  }

  while (true) {
    const { action } = await prompts({
      type: "autocomplete",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { title: chalk.green("🕒 Latest Test"), value: "latest" },
        { title: chalk.green("📚 View Test History"), value: "history" },
        { title: chalk.magenta("🔙 Back"), value: "back" },
        { title: chalk.red("❌ Exit"), value: "exit" },
      ],
      suggest: (input, choices) =>
        Promise.resolve(
          choices.filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase())
          )
        ),
    });

    switch (action) {
      case "latest":
        await handleLatestTest(history[0], () => mainMenu());
        return;
      case "history":
        await viewTestHistory(history, "singleTest", () => mainMenu());
        return;
      case "back":
        runCLI();
        return null;
      case "exit":
        console.log(kleur.blue("See you soon!"));
        process.exit(0);
    }
  }
}
