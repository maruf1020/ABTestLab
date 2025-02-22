const data = {
  "parentTargeting": [],
  "testInfo": [
    {
      "variationDir": "L:\\Github\\ABTestLab\\websites\\loopearplugs\\Test AA\\new v1.1",
      "compiledDir": "L:\\Github\\ABTestLab\\websites\\loopearplugs\\Test AA\\new v1.1\\compiled",
      "targetingDir": "L:\\Github\\ABTestLab\\websites\\loopearplugs\\Test AA\\targeting",
      "id": "1740236986274_3165_new_v1_1",
      "testType": "AA",
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\tconsole.log(\"----\")\n\n})();"
      },
      "targetingFiles": {
        "customJS.js": "//either return true or call active function with true parameter to make the test active. and checkingTimeOut will wait until this waiting time\r\nexport const checkingTimeOut = 0; // in milliseconds\r\nexport default function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}   ",
        "elementChecker.json": {
          "multiple_rules_check_by_condition": "OR",
          "rules": [],
          "_comments": {
            "EXAMPLE": [
              {
                "selector": "body",
                "is_matched": true,
                "waiting_time": 1000,
                "total_element_count": 1
              },
              {
                "selector": ".grid-plp",
                "is_matched": false,
                "waiting_time": 2000,
                "total_element_count": 1
              }
            ],
            "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
            "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
            "selector": "Define the CSS selector for the element you want to check.",
            "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
            "waiting_time": "Time in milliseconds to wait for the element to appear.",
            "total_element_count": "Number of elements that should match the selector."
          }
        },
        "urlChecker.json": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "/https?:\\/\\/(www\\.)?[^\\s/$.?#].[^\\s]*/gi",
              "match_type": "REGEX_MATCHED"
            }
          ],
          "_comment": {
            "description": "Use 'targeting_rules' to define conditions for matching URLs.",
            "rules": [
              "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
              "Use 'EXACTLY_MATCHED' to match the exact URL.",
              "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
              "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
              "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
              "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
              "If multiple conditions are added, all will be checked against the target URLs.",
              "By default, your test will only run under the website's hostname unless specified otherwise."
            ],
            "example": {
              "multiple_rules_check_by_condition": "OR",
              "targeting_rules": [
                {
                  "value": "https://www.example.com",
                  "match_type": "EXACTLY_MATCHED"
                },
                {
                  "value": "example.com",
                  "match_type": "URL_CONTAINS"
                },
                {
                  "value": "blockedsite.com",
                  "match_type": "URL_DOES_NOT_CONTAIN"
                },
                {
                  "value": "/example\\.com/gi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "/forbidden\\.com/gi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      }
    }
  ]
};
        const headCheckInterval = setInterval(() => {
            if (document.head) {
                clearInterval(headCheckInterval);
                data.testInfo.forEach((test) => {
                    const style = document.createElement("style");
                    style.textContent = test.variationFiles.css;
                    document.head.appendChild(style);
                    eval(test.variationFiles.js);
                });
            }
        }, 10);
        
        
        
    