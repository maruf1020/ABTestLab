export default function checkURLTargeting(rulesConfig) {
  return new Promise((resolve) => {
    if (!rulesConfig.targeting_rules || rulesConfig.targeting_rules.length === 0) {
      resolve(true); // If no rules, allow all URLs
      return;
    }

    const currentURL = window.location.href;
    const conditions = rulesConfig.targeting_rules.map((rule) => {
      switch (rule.match_type) {
        case "EXACTLY_MATCHED":
          return currentURL === rule.value;
        case "URL_CONTAINS":
          return currentURL.includes(rule.value);
        case "URL_DOES_NOT_CONTAIN":
          return !currentURL.includes(rule.value);
        case "REGEX_MATCHED":
          return new RegExp(rule.value.replace(/^\/|\/[gimuy]*$/g, ""), "gi").test(currentURL);
        case "REGEX_DOES_NOT_MATCH":
          return !new RegExp(rule.value.replace(/^\/|\/[gimuy]*$/g, ""), "gi").test(currentURL);
        default:
          return false;
      }
    });

    const result =
      rulesConfig.multiple_rules_check_by_condition === "AND"
        ? conditions.every(Boolean)
        : conditions.some(Boolean);

    resolve(result);
  });
}
