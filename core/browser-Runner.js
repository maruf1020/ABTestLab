const abTestPilotMainInformation = {
  "parentTargeting": [
    {
      "parentTargetingId": "1740609025638_8293_PDP_and_Header_for_all",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "variationIdList": [
        "1740609025523_2952_variation_1",
        "1740609025593_8820_variation_1"
      ]
    },
    {
      "parentTargetingId": "1740607397056_9807_multi_touch_Test",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "variationIdList": [
        "1740607397012_360_v01",
        "1740607396941_4528_v01",
        "1740607396865_2272_v01"
      ]
    }
  ],
  "testInfo": [
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1740608965521_3072_v01",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "A\u002FB",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      },
      "websiteName": "bulgari",
      "testName": "Ab test",
      "touchPointName": null,
      "variationName": "v01"
    },
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1740609025523_2952_variation_1",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      },
      "websiteName": "bulgari",
      "testName": "PDP and Header for all",
      "touchPointName": "Header",
      "variationName": "variation 1"
    },
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1740609025593_8820_variation_1",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      },
      "websiteName": "bulgari",
      "testName": "PDP and Header for all",
      "touchPointName": "PDP",
      "variationName": "variation 1"
    },
    {
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "id": "1740607397012_360_v01",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      },
      "websiteName": "loopearplugs",
      "testName": "multi touch Test",
      "touchPointName": "Menu",
      "variationName": "v01"
    },
    {
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "id": "1740607396941_4528_v01",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      },
      "websiteName": "loopearplugs",
      "testName": "multi touch Test",
      "touchPointName": "PDP",
      "variationName": "v01"
    },
    {
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "id": "1740607396865_2272_v01",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      },
      "websiteName": "loopearplugs",
      "testName": "multi touch Test",
      "touchPointName": "home",
      "variationName": "v01"
    },
    {
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "id": "1740599107479_9490_v01",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
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
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
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
                  "value": "https:\u002F\u002Fwww.example.com",
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
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "A\u002FB",
      "variationFiles": {
        "css": "body {\n  background-color: red;\n  color: white;\n  font-size: 20px;\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  text-align: center;\n}\n\nh1 {\n  font-size: 40px;\n  font-weight: bold;\n}\n\nh2 {\n  font-size: 30px;\n  background-color: rgb(228, 70, 175);\n  border: 10px solid rgb(131, 8, 84);\n}",
        "js": "console.log(\"Hello, World!!!!\");\n"
      },
      "websiteName": "loopearplugs",
      "testName": "test AB",
      "touchPointName": null,
      "variationName": "v01"
    }
  ],
  "targetMet": {
    "customJS": function checker(activator) {
    const checkingTimeout = 3000;
    return new Promise((resolve) => {
        const startTime = Date.now();
        const result = {
            status: false,
            messages: [],
            summary: '',
            time: 0,
            details: {
                activationMethod: null,
                checkingTimeout,
                receivedCallback: false,
                executionTime: 0,
                triggeredBy: 'timeout',
                wasImmediate: false
            }
        };

        let isCompleted = false;
        let timeoutId;

        const active = (value) => {
            if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeoutId);

                result.status = value === true;
                result.details.receivedCallback = true;
                result.details.triggeredBy = value ? 'manual_activation' : 'manual_deactivation';
                result.details.activationMethod = 'callback';

                result.messages.push(value ?
                    'Activated through manual callback' :
                    'Deactivated through manual callback'
                );

                finalizeResult();
                resolve(result);
            }
        };

        const finalizeResult = () => {
            result.time = Date.now() - startTime;
            result.details.executionTime = result.time;
            result.summary = result.status ?
                `Active (${result.details.triggeredBy.replace(/_/g, ' ')})` :
                `Inactive (${result.details.triggeredBy.replace(/_/g, ' ')})`;
        };

        try {
            const activatorResult = activator(active);

            // Only handle EXPLICIT boolean returns immediately
            if (typeof activatorResult === 'boolean') {
                result.status = activatorResult;
                result.details = {
                    ...result.details,
                    activationMethod: 'immediate',
                    triggeredBy: activatorResult ?
                        'immediate_activation' :
                        'immediate_deactivation',
                    wasImmediate: true
                };
                result.messages.push(`Immediate ${activatorResult ? 'activation' : 'deactivation'} from return value`);
                finalizeResult();
                resolve(result);
                return;
            }

            // For non-boolean returns, wait for callback/timeout
            timeoutId = setTimeout(() => {
                if (!isCompleted) {
                    result.messages.push(`Timed out after ${checkingTimeout}ms`);
                    result.details.triggeredBy = 'timeout';
                    finalizeResult();
                    resolve(result);
                }
            }, checkingTimeout);

        } catch (error) {
            result.messages.push(`Activator error: ${error.message}`);
            result.details.triggeredBy = 'error';
            finalizeResult();
            resolve(result);
        }
    });
},
    "elementChecker": function checker(rulesConfig) {
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
},
    "urlChecker": function checker(rulesConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const result = {
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
  }
}
        let abTestPilot = {};
        function abTestPilotFilterTestsByHostname(testInfo) {
            return testInfo.filter(item => {
                return item.hostnames.some(hostname => {
                    const hostnameWithoutSlash = hostname.endsWith("/") ? hostname.slice(0, -1) : hostname;
                    const originWithoutSlash = window.location.origin.endsWith("/") ? window.location.origin.slice(0, -1) : window.location.origin;
                    return hostnameWithoutSlash.includes(originWithoutSlash) || originWithoutSlash.includes(hostnameWithoutSlash);
                });
            });
        }

        function abTestPilotFilterTestsByParentTargeting(testInfo, parentTargeting) {
            const parentTargetingIDs = parentTargeting.map(item => item.variationIdList).flat();
            const testsWithParentTargeting = testInfo.filter(item => parentTargetingIDs.includes(item.id));
            const testsWithoutParentTargeting = testInfo.filter(item => !parentTargetingIDs.includes(item.id));
            return { testsWithParentTargeting, testsWithoutParentTargeting };
        }

        function abTestPilotGetApplicableParentTargeting(parentTargeting, testsWithParentTargeting) {
            return parentTargeting.filter(item => {
                return item.variationIdList.some(id => {
                    return testsWithParentTargeting.some(test => test.id === id);
                });
            });
        }

        async function abTestPilotTargetMet(targetMetFiles, targetingFiles) {
            const results = await Promise.all([
                targetMetFiles.customJS(targetingFiles.customJS),
                targetMetFiles.elementChecker(targetingFiles.elementChecker),
                targetMetFiles.urlChecker(targetingFiles.urlChecker)
            ]);
            return results;
        }

        function abTestPilotApplyTestVariation(test) {
            const style = document.createElement("style");
            style.innerHTML = test.variationFiles.css;
            style.type = "text/css";
            style.id = test.id;
            document.head.appendChild(style);

            const script = document.createElement("script");
            script.innerHTML = test.variationFiles.js;
            script.type = "text/javascript";
            script.id = test.id;
            document.head.appendChild(script);
        }

        async function abTestPilotProcessTests(tests, targetMet) {
            for (const test of tests) {
                const result = await abTestPilotTargetMet(targetMet, test.targetingFiles);
                abTestPilot[test.id] = {
                    status: result.every(item => item.status === true) ? "Active" : "Inactive",
                    targetingDetails: result,
                    id: test.id,
                    websiteName : test.websiteName,
                    testName : test.testName,
                    variationName : test.variationName,
                    testType : test.testType
                }
                if(test.touchPointName) {
                    abTestPilot[test.id].touchPointName = test.touchPointName;
                }
                if (result.every(item => item.status === true)) {
                    abTestPilotApplyTestVariation(test);
                }
            }
        }

        const abTestPilotApplicableTestsBasedOnTheWebsite = abTestPilotFilterTestsByHostname(abTestPilotMainInformation.testInfo);
        const { testsWithParentTargeting, testsWithoutParentTargeting } = abTestPilotFilterTestsByParentTargeting(abTestPilotApplicableTestsBasedOnTheWebsite, abTestPilotMainInformation.parentTargeting);
        const abTestPilotApplicableParentTargeting = abTestPilotGetApplicableParentTargeting(abTestPilotMainInformation.parentTargeting, testsWithParentTargeting);

        abTestPilotApplicableParentTargeting.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {
                if (result.every(item => item.status === true)) {
                    const applicableTests = abTestPilotMainInformation.testInfo.filter(test => item.variationIdList.includes(test.id));
                    abTestPilotProcessTests(applicableTests, abTestPilotMainInformation.targetMet);
                }
            });
        });

        abTestPilotProcessTests(testsWithoutParentTargeting, abTestPilotMainInformation.targetMet);    

    