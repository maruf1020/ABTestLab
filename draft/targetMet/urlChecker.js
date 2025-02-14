export default function checkURLTargeting(rulesConfig) {
  return new Promise((resolve) => {
    if (!rulesConfig.targeting_rules || rulesConfig.targeting_rules.length === 0) {
      resolve({
        finalResult: true,
        message: "No targeting rules provided, allowing all URLs.",
        details: []
      });
      return;
    }

    const currentURL = window.location.href;
    const conditions = rulesConfig.targeting_rules.map((rule) => {
      let isMatched;
      let condition;

      switch (rule.match_type) {
        case "EXACTLY_MATCHED":
          // here we are caring about the trailing slash in the last of the URL
          // isMatched = currentURL === rule.value; 
          // here it doesn't consider the trailing slash in the last of the URL
          isMatched = currentURL.replace(/\/$/, "") === rule.value.replace(/\/$/, "");
          condition = `URL exactly matches ${rule.value}`;
          break;
        case "URL_CONTAINS":
          isMatched = currentURL.includes(rule.value);
          condition = `URL contains ${rule.value}`;
          break;
        case "URL_DOES_NOT_CONTAIN":
          isMatched = !currentURL.includes(rule.value);
          condition = `URL does not contain ${rule.value}`;
          break;
        case "REGEX_MATCHED":
          isMatched = new RegExp(rule.value.replace(/^\/|\/[gimuy]*$/g, ""), "gi").test(currentURL);
          condition = `URL matches regex ${rule.value}`;
          break;
        case "REGEX_DOES_NOT_MATCH":
          isMatched = !new RegExp(rule.value.replace(/^\/|\/[gimuy]*$/g, ""), "gi").test(currentURL);
          condition = `URL does not match regex ${rule.value}`;
          break;
        default:
          isMatched = false;
          condition = `Unknown match type ${rule.match_type}`;
      }

      return {
        url: currentURL,
        condition,
        result: isMatched,
        message: isMatched ? `Condition matched: ${condition}` : `Condition not matched: ${condition}`
      };
    });

    const finalResult =
      rulesConfig.multiple_rules_check_by_condition === "AND"
        ? conditions.every(condition => condition.result)
        : conditions.some(condition => condition.result);

    resolve({
      finalResult,
      message: finalResult ? "All conditions met." : "Some conditions not met.",
      details: conditions
    });
  });
}