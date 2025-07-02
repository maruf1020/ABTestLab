export default function checker(rulesConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const result = {
      type: "urlChecker",
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
              ? `URL exactly matches '${rule.value}'`
              : `URL does not exactly match '${rule.value}' (current: ${currentURL})`;
            break;

          case "URL_CONTAINS":
            ruleResult.pass = currentURL.includes(rule.value);
            ruleResult.message = ruleResult.pass
              ? `URL contains '${rule.value}'`
              : `URL does not contain '${rule.value}'`;
            break;

          case "URL_DOES_NOT_CONTAIN":
            ruleResult.pass = !currentURL.includes(rule.value);
            ruleResult.message = ruleResult.pass
              ? `URL successfully excluded '${rule.value}'`
              : `URL contains excluded string '${rule.value}'`;
            break;

          case "REGEX_MATCHED": {
            const cleanedRegex = rule.value.replace(/^\/|\/[gimuy]*$/g, "");
            const regex = new RegExp(cleanedRegex, "gi");
            ruleResult.pass = regex.test(currentURL);
            ruleResult.message = ruleResult.pass
              ? `URL matched regex pattern ${rule.value}`
              : `URL failed to match regex pattern ${rule.value}`;
            break;
          }

          case "REGEX_DOES_NOT_MATCH": {
            const cleanedRegex = rule.value.replace(/^\/|\/[gimuy]*$/g, "");
            const regex = new RegExp(cleanedRegex, "gi");
            ruleResult.pass = !regex.test(currentURL);
            ruleResult.message = ruleResult.pass
              ? `URL correctly excluded by regex pattern ${rule.value}`
              : `URL matched excluded regex pattern ${rule.value}`;
            break;
          }

          default:
            ruleResult.message = `Unknown match type: ${rule.match_type}`;
        }
      } catch (error) {
        ruleResult.message = `Error evaluating rule: ${error.message}`;
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
      ? `Passed - ${passedCount}/${ruleCount} rules matched (${result.details.conditionType} condition)`
      : `Failed - Only ${passedCount}/${ruleCount} rules matched (required ${result.details.conditionType})`;

    // Add timing
    result.time = Date.now() - startTime;

    resolve(result);
  });
}

// // Detailed Output Structure:
// {
//   status: boolean,       // Final result
//   messages: string[],    // Individual rule messages
//   summary: string,       // Overall result summary
//   time: number,          // Execution time in ms
//   details: {             // Detailed diagnostics
//     currentURL: string,
//     conditionType: string,
//     rulesEvaluated: [{
//       rule: RuleConfig,
//       pass: boolean,
//       message: string
//     }]
//   }
// }

// // Example Output:
// {
//   status: true,
//   messages: [
//     "URL contains 'example'",
//     "URL matched regex pattern /example.*/gi"
//   ],
//   summary: "Passed - 2/2 rules matched (OR condition)",
//   time: 12,
//   details: {
//     currentURL: "https://www.example.com/path",
//     conditionType: "OR",
//     rulesEvaluated: [
//       {/* full rule config + pass status + message */}
//     ]
//   }
// }
