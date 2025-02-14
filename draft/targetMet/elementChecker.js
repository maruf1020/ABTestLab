export default function checker(rulesConfig) {
  return new Promise((resolve) => {
    if (!rulesConfig.rules.length) {
      resolve({
        finalResult: true,
        message: "No rules provided, test runs on all pages.",
        details: []
      });
      return;
    }

    let checks = rulesConfig.rules.map((rule) => {
      return new Promise((ruleResolve) => {
        let elapsedTime = 0;
        const intervalTime = 100; // Check every 100ms

        const intervalId = setInterval(() => {
          const elements = document.querySelectorAll(rule.selector);
          const isMatched = elements.length === rule.total_element_count;

          if (rule.is_matched === isMatched) {
            clearInterval(intervalId);
            ruleResolve({
              selector: rule.selector,
              condition: `Expected ${rule.total_element_count} elements`,
              result: true,
              message: `Condition matched for selector: ${rule.selector}`
            });
          }

          elapsedTime += intervalTime;
          if (elapsedTime >= rule.waiting_time) {
            clearInterval(intervalId);
            ruleResolve({
              selector: rule.selector,
              condition: `Expected ${rule.total_element_count} elements`,
              result: false,
              message: `Condition not matched for selector: ${rule.selector}`
            });
          }
        }, intervalTime);
      });
    });

    Promise.allSettled(checks).then((results) => {
      const outcomes = results.map((result) => result.value);
      const finalResult = rulesConfig.multiple_rules_check_by_condition === "AND"
        ? outcomes.every(outcome => outcome.result)
        : outcomes.some(outcome => outcome.result);

      resolve({
        finalResult,
        message: finalResult ? "Conditions met with ${rulesConfig.multiple_rules_check_by_condition} condition" : "Some conditions not met",
        details: outcomes
      });
    });
  });
}