import { Command } from "commander";

import { getTestInfo } from "../utils/fileUtils.js";
import {
  selectWebsite,
  selectTest,
  selectVariation,
  selectTouchPointAndVariations,
  selectVariationDetails,
  selectTouchPointDetails,
} from "../utils/selectors.js";
import { runCLI } from "../index.js";

export const createCommand = new Command("create")
  .description("Create a new website or test")
  .action(create);

async function create() {
  const selectedWebsite = await selectWebsite(() => runCLI());
  if (typeof selectedWebsite === "string") {
    await handleTestSelection(selectedWebsite);
  }
}

async function handleTestSelection(selectedWebsite) {
  const selectedTest = await selectTest(selectedWebsite, create);
  if (typeof selectedTest === "string") {
    await handleTestDetails(selectedWebsite, selectedTest);
  }
}

async function handleTestDetails(selectedWebsite, selectedTest) {
  const testInfo = await getTestInfo(selectedWebsite, selectedTest);
  if (typeof testInfo === "object" && testInfo !== null && "type" in testInfo) {
    switch (testInfo.type) {
      case "Multi-touch":
        const selectedTouchPoint = await selectTouchPointAndVariations(
          selectedWebsite,
          selectedTest,
          () => handleTestSelection(selectedWebsite)
        );
        if (typeof selectedTouchPoint === "string") {
          if (selectedTouchPoint.includes(" (variation)")) {
            const variationName = selectedTouchPoint.replace(
              " (variation)",
              ""
            );
            const variationDetails = await selectVariationDetails(
              selectedWebsite,
              selectedTest,
              variationName,
              () => handleTestDetails(selectedWebsite, selectedTest)
            );
            if (typeof variationDetails === "string") {
              console.log("Variation Details:", variationDetails);
            }
          } else if (selectedTouchPoint.includes(" (touchPoint)")) {
            const touchPointName = selectedTouchPoint.replace(
              " (touchPoint)",
              ""
            );
            const touchPointDetails = await selectTouchPointDetails(
              selectedWebsite,
              selectedTest,
              touchPointName,
              () => handleTestDetails(selectedWebsite, selectedTest)
            );
            if (typeof touchPointDetails === "string") {
              console.log("TouchPoint Details:", touchPointDetails);
            }
          }
        }
        break;
      case "AA":
      case "A/B":
      case "Patch":
        const selectedVariation = await selectVariation(
          selectedWebsite,
          selectedTest,
          () => handleTestSelection(selectedWebsite)
        );
        if (typeof selectedVariation === "string") {
          const variationDetails = await selectVariationDetails(
            selectedWebsite,
            selectedTest,
            selectedVariation,
            () => handleTestDetails(selectedWebsite, selectedTest)
          );
          if (typeof variationDetails === "string") {
            console.log("Variation Details:", variationDetails);
          }
        }
        break;
      default:
        console.error("Unknown test type");
    }
  } else {
    console.log("Invalid testInfo object");
  }
}
