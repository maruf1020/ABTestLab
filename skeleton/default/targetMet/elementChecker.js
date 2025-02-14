export default function checker(rulesConfig) {
  return new Promise((resolve) => {
    if (!rulesConfig.rules.length) {
      resolve(true); // If no rules, run the test on all pages
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
            ruleResolve(true);
          }

          elapsedTime += intervalTime;
          if (elapsedTime >= rule.waiting_time) {
            clearInterval(intervalId);
            ruleResolve(false);
          }
        }, intervalTime);
      });
    });

    Promise.allSettled(checks).then((results) => {
      const outcomes = results.map((result) => result.value);

      if (rulesConfig.multiple_rules_check_by_condition === "AND") {
        resolve(outcomes.every(Boolean)); // Pass only if all are true
      } else {
        resolve(outcomes.some(Boolean)); // Pass if any one is true
      }
    });
  });
}