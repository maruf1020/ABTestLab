export default function checker(rulesConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const result = {
      status: true,
      messages: [],
      summary: '',
      time: 0,
      details: {
        conditionType: rulesConfig.multiple_rules_check_by_condition || 'OR',
        rulesEvaluated: [],
        totalTime: 0,
        totalChecks: 0
      }
    };

    if (!rulesConfig.rules || rulesConfig.rules.length === 0) {
      result.messages.push('No rules defined - running test on all pages');
      result.summary = 'No rules defined. Test will run on all pages.';
      result.time = Date.now() - startTime;
      resolve(result);
      return;
    }

    const ruleChecks = rulesConfig.rules.map((rule) => {
      return new Promise((ruleResolve) => {
        const ruleStartTime = Date.now();
        let intervalId;
        let timeoutId;
        let finalCheckDone = false;
        let checksPerformed = 0;

        const evaluateCondition = (finalCheck = false) => {
          checksPerformed++;
          const elements = document.querySelectorAll(rule.selector);
          const elementCount = elements.length;
          const countMatches = elementCount === rule.total_element_count;

          let pass = false;
          let message = '';

          if (rule.is_matched) {
            if (countMatches && !finalCheck) {
              // Immediate success for positive match
              pass = true;
              message = `Element found immediately: ${rule.selector} ` +
                `(Expected ${rule.total_element_count}, Found ${elementCount})`;
              clearTimeout(timeoutId);
              clearInterval(intervalId);
            } else if (finalCheck) {
              // Final check for positive match
              pass = countMatches;
              message = pass
                ? `Element found after full wait: ${rule.selector} ` +
                `(Expected ${rule.total_element_count}, Found ${elementCount})`
                : `Element not found after ${rule.waiting_time}ms: ${rule.selector} ` +
                `(Expected ${rule.total_element_count}, Found ${elementCount})`;
            }
          } else {
            if (countMatches && !finalCheck) {
              // Immediate failure for negative match
              pass = false;
              message = `Unwanted element found immediately: ${rule.selector} ` +
                `(Found ${elementCount} when expecting none)`;
              clearTimeout(timeoutId);
              clearInterval(intervalId);
            } else if (finalCheck) {
              // Final check for negative match
              pass = !countMatches;
              message = pass
                ? `No unwanted elements after ${rule.waiting_time}ms: ${rule.selector}`
                : `Unwanted elements persisted: ${rule.selector} ` +
                `(Found ${elementCount} when expecting none)`;
            }
          }

          if (message) {
            ruleResolve({
              ...rule,
              pass,
              time: Date.now() - ruleStartTime,
              checksPerformed,
              finalElementCount: elementCount,
              message
            });
            finalCheckDone = true;
          }
        };

        // Initial immediate check
        evaluateCondition();

        // Only set up interval if not already resolved
        if (!finalCheckDone) {
          intervalId = setInterval(evaluateCondition, 100);
          timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            if (!finalCheckDone) evaluateCondition(true);
          }, rule.waiting_time);
        }
      });
    });

    Promise.allSettled(ruleChecks).then((results) => {
      const resolvedRules = results.map(r => r.value);

      result.details.rulesEvaluated = resolvedRules;
      result.details.totalTime = Date.now() - startTime;
      result.details.totalChecks = resolvedRules.reduce((sum, rule) => sum + rule.checksPerformed, 0);

      resolvedRules.forEach(rule => {
        result.messages.push(rule.message);
      });

      const passStatuses = resolvedRules.map(r => r.pass);
      result.status = result.details.conditionType === "AND"
        ? passStatuses.every(Boolean)
        : passStatuses.some(Boolean);

      const passedCount = passStatuses.filter(Boolean).length;
      result.summary = result.status
        ? `Passed - ${passedCount}/${resolvedRules.length} rules met`
        : `Failed - ${passedCount}/${resolvedRules.length} rules met`;

      result.time = result.details.totalTime;
      resolve(result);
    });
  });
}


// // Detailed Output Structure:
// {
//   status: boolean,       // Final test result
//   messages: string[],    // Individual rule status messages
//   summary: string,       // Consolidated result summary
//   time: number,          // Total execution time in ms
//   details: {
//     conditionType: string, // 'AND'/'OR'
//     totalChecks: number,   // Total number of DOM checks performed
//     totalTime: number,    // Total execution time in ms
//     rulesEvaluated: [     // Detailed results for each rule
//       {
//         // Original rule configuration
//         selector: string,
//         is_matched: boolean,
//         waiting_time: number,
//         total_element_count: number,
        
//         // Result details
//         pass: boolean,
//         message: string,
//         time: number,     // Time taken for this specific rule check
//         checksPerformed: number, // Number of DOM checks for this rule
//         finalElementCount: number // Elements found at resolution time
//       }
//     ]
//   }
// }

// // Example Output:
// {
//   status: false,
//   messages: [
//     "Element found immediately: #header (Expected 1, Found 1)",
//     "Unwanted element found immediately: .popup (Found 1 when expecting none)"
//   ],
//   summary: "Failed - 1/2 rules met",
//   time: 25,
//   details: {
//     conditionType: "AND",
//     totalChecks: 2,
//     totalTime: 25,
//     rulesEvaluated: [
//       {
//         selector: "#header",
//         is_matched: true,
//         waiting_time: 10000,
//         total_element_count: 1,
//         pass: true,
//         message: "Element found immediately: #header (Expected 1, Found 1)",
//         time: 5,
//         checksPerformed: 1,
//         finalElementCount: 1
//       },
//       {
//         selector: ".popup",
//         is_matched: false,
//         waiting_time: 5000,
//         total_element_count: 1,
//         pass: false,
//         message: "Unwanted element found immediately: .popup (Found 1 when expecting none)",
//         time: 8,
//         checksPerformed: 1,
//         finalElementCount: 1
//       }
//     ]
//   }
// }