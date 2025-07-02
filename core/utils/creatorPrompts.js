import prompts from "prompts";

import {
  createTest,
  createTouchPoint,
  createVariation,
  createWebsite,
} from "./creators.js";
import {
  getTestInfo,
  listTests,
  listTouchPoints,
  listWebsites,
} from "./fileUtils.js";

import chalk from "chalk";

export async function createNewWebsiteWithPrompt() {
  const websites = await listWebsites();
  const createResponse = await prompts([
    {
      type: "text",
      name: "websiteName",
      message: "Enter the name of the new website:",
      validate: (input) => {
        const trimmedInput = input.trim();
        const validNamePattern = /^[a-zA-Z0-9\-_ ]+$/;
        if (trimmedInput === "") {
          return "Website name cannot be empty";
        }
        if (!validNamePattern.test(trimmedInput)) {
          const invalidChars = [
            ...new Set(trimmedInput.replace(/[a-zA-Z0-9\-_ ]/g, "")),
          ].join(", ");
          return `Website name contains invalid characters: ${invalidChars}`;
        }
        if (websites.includes(trimmedInput)) {
          return "Website name already exists";
        }
        return true;
      },
    },
    {
      type: "text",
      name: "hostnames",
      message:
        "Enter the website host(s) or URL(s) (separate multiple with commas and don't forget to remove trailing slash (/) e.g. example.com, www.example.com, blog.example.com, https://www.example.com):",
      validate: (input) => {
        const trimmedInput = input.trim();
        if (trimmedInput === "") {
          return "At least one hostname or URL is required";
        }
        const hostnames = trimmedInput
          .split(",")
          .map((hostname) => hostname.trim());
        //we are not allowing ip address. for IF address we can use below regex
        // /^(?:(https?|wss?):\/\/)?((?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.?[A-Za-z]{2,63}|((25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)))(:\d{1,5})?$/;
        const validHostnamePattern =
          /^(?:(https?|wss?):\/\/)?(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.?[A-Za-z]{2,63}(:\d{1,5})?$/;
        const invalidHostnames = hostnames.filter(
          (hostname) => !validHostnamePattern.test(hostname)
        );
        if (invalidHostnames.length > 0) {
          return `Invalid hostnames or URLs: ${invalidHostnames.join(", ")}`;
        }
        return true;
      },
    },
  ]);

  const { websiteName, hostnames } = createResponse;

  const hostnameList = hostnames.split(",").map((host) => host.trim());

  try {
    return await createWebsite(websiteName, hostnameList);
  } catch (error) {
    console.error(chalk.red(`Failed to create website: ${error.message}`));
    return null;
  }
}

export async function createNewTestWithPrompt(website) {
  const testList = await listTests(website);
  const createResponse = await prompts([
    {
      type: "text",
      name: "testName",
      message: "Enter the name of the new test:",
      validate: (input) => {
        const trimmedInput = input.trim();
        const validNamePattern = /^[a-zA-Z0-9\-_ ]+$/;
        if (trimmedInput === "") {
          return "Test name cannot be empty";
        }
        if (!validNamePattern.test(trimmedInput)) {
          const invalidChars = [
            ...new Set(trimmedInput.replace(/[a-zA-Z0-9\-_ ]/g, "")),
          ].join(", ");
          return `Test name contains invalid characters: ${invalidChars}`;
        }
        if (testList.includes(trimmedInput)) {
          return "Test name already exists";
        }
        return true;
      },
    },
    {
      type: "select",
      name: "testType",
      message: "Select the test type:",
      choices: ["A/B", "AA", "Multi-touch", "Patch"].map((type) => ({
        title: type,
        value: type,
      })),
    },
    {
      type: (prev) => (prev === "Multi-touch" ? "text" : null),
      name: "touchPointName",
      message: "Enter the touch point name:",
      validate: (input) =>
        input.trim() !== "" || "Touch point name cannot be empty",
    },
    {
      type: "text",
      name: "variationName",
      message: "Enter the variation name:",
      validate: (input) =>
        input.trim() !== "" || "Variation name cannot be empty",
    },
  ]);

  const { testName, testType, touchPointName, variationName } = createResponse;

  if (
    !testName ||
    !testType ||
    (testType === "Multi-touch" && !touchPointName) ||
    !variationName
  )
    return null;

  try {
    return await createTest(
      website,
      testName,
      testType,
      touchPointName,
      variationName
    );
  } catch (error) {
    console.error(chalk.red(`Failed to create test: ${error.message}`));
  }
}

export async function createNewTouchPointWithPrompt(website, testName) {
  const touchPointList = await listTouchPoints(website, testName);
  const createResponse = await prompts([
    {
      type: "text",
      name: "touchPointName",
      message: "Enter the name of the new touch point:",
      validate: (input) => {
        const trimmedInput = input.trim();
        if (touchPointList.includes(trimmedInput)) {
          return "Touch point name already exists";
        }
        return trimmedInput !== "" || "Touch point name cannot be empty";
      },
    },
  ]);

  const { touchPointName } = createResponse;

  try {
    return await createTouchPoint(website, testName, touchPointName);
  } catch (error) {
    console.error(chalk.red(`Failed to create touch point: ${error.message}`));
  }
}

export async function createNewVariationWithPrompt(website, testName) {
  const testInfo = await getTestInfo(website, testName);
  const createResponse = await prompts([
    {
      type: "text",
      name: "variationName",
      message: "Enter the name of the new variation:",
      validate: (input) => {
        const trimmedInput = input.trim();
        if (testInfo.variations.some((v) => v.name === trimmedInput)) {
          return "Variation name already exists";
        }
        return trimmedInput !== "" || "Variation name cannot be empty";
      },
    },
  ]);

  const { variationName } = createResponse;

  try {
    return await createVariation(website, testName, variationName);
  } catch (error) {
    console.error(chalk.red(`Failed to create variation: ${error.message}`));
  }
}
