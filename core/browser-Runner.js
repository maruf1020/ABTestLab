const abTestPilotMainInformation = {
  "parentTargeting": [
    {
      "parentTargetingId": "1740237333087_6929_cart_and_burger_menu_Multi_touch",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "variationIdList": [
        "1740237333065_7364_variaiton_2",
        "1740237332985_4921_variaiton_2"
      ]
    },
    {
      "parentTargetingId": "1740236935261_9094_Multi_touch_Home_and_Menu",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "variationIdList": [
        "1740236935165_3415_v03",
        "1740236935235_5022_v03"
      ]
    }
  ],
  "testInfo": [
    {
      "hostnames": [
        "www.bulgari.com",
        "stg.bulgari.com"
      ],
      "id": "1740237412021_6883_variation_1",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "testType": "A/B",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    },
    {
      "hostnames": [
        "www.bulgari.com",
        "stg.bulgari.com"
      ],
      "id": "1740237333065_7364_variaiton_2",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    },
    {
      "hostnames": [
        "www.bulgari.com",
        "stg.bulgari.com"
      ],
      "id": "1740237332985_4921_variaiton_2",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    },
    {
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "id": "1740236935165_3415_v03",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    },
    {
      "hostnames": [
        "www.loopearplugs.com"
      ],
      "id": "1740236935235_5022_v03",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    },
    {
      "hostnames": [
        "https://snocks.com/"
      ],
      "id": "1740236712786_9660_v01",
      "targetingFiles": {
        "customJS": "function activator(active) {\r\n    // document.body.addEventListener('click', (e) => {\r\n    //   active(true);\r\n    // });\r\n    return true;\r\n}",
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
      },
      "testType": "AA",
      "variationFiles": {
        "css": "",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    }
  ],
  "targetMet": {
    "customJS": "function checker(activator) {\r\n    const checkingTimeout = 3000;\r\n    return new Promise((resolve) => {\r\n        const startTime = Date.now();\r\n        const result = {\r\n            status: false,\r\n            messages: [],\r\n            summary: '',\r\n            time: 0,\r\n            details: {\r\n                activationMethod: null,\r\n                checkingTimeout,\r\n                receivedCallback: false,\r\n                executionTime: 0,\r\n                triggeredBy: 'timeout',\r\n                wasImmediate: false\r\n            }\r\n        };\r\n\r\n        let isCompleted = false;\r\n        let timeoutId;\r\n\r\n        const active = (value) => {\r\n            if (!isCompleted) {\r\n                isCompleted = true;\r\n                clearTimeout(timeoutId);\r\n\r\n                result.status = value === true;\r\n                result.details.receivedCallback = true;\r\n                result.details.triggeredBy = value ? 'manual_activation' : 'manual_deactivation';\r\n                result.details.activationMethod = 'callback';\r\n\r\n                result.messages.push(value ?\r\n                    'Activated through manual callback' :\r\n                    'Deactivated through manual callback'\r\n                );\r\n\r\n                finalizeResult();\r\n                resolve(result);\r\n            }\r\n        };\r\n\r\n        const finalizeResult = () => {\r\n            result.time = Date.now() - startTime;\r\n            result.details.executionTime = result.time;\r\n            result.summary = result.status ?\r\n                `Active (${result.details.triggeredBy.replace(/_/g, ' ')})` :\r\n                `Inactive (${result.details.triggeredBy.replace(/_/g, ' ')})`;\r\n        };\r\n\r\n        try {\r\n            const activatorResult = activator(active);\r\n\r\n            // Only handle EXPLICIT boolean returns immediately\r\n            if (typeof activatorResult === 'boolean') {\r\n                result.status = activatorResult;\r\n                result.details = {\r\n                    ...result.details,\r\n                    activationMethod: 'immediate',\r\n                    triggeredBy: activatorResult ?\r\n                        'immediate_activation' :\r\n                        'immediate_deactivation',\r\n                    wasImmediate: true\r\n                };\r\n                result.messages.push(`Immediate ${activatorResult ? 'activation' : 'deactivation'} from return value`);\r\n                finalizeResult();\r\n                resolve(result);\r\n                return;\r\n            }\r\n\r\n            // For non-boolean returns, wait for callback/timeout\r\n            timeoutId = setTimeout(() => {\r\n                if (!isCompleted) {\r\n                    result.messages.push(`Timed out after ${checkingTimeout}ms`);\r\n                    result.details.triggeredBy = 'timeout';\r\n                    finalizeResult();\r\n                    resolve(result);\r\n                }\r\n            }, checkingTimeout);\r\n\r\n        } catch (error) {\r\n            result.messages.push(`Activator error: ${error.message}`);\r\n            result.details.triggeredBy = 'error';\r\n            finalizeResult();\r\n            resolve(result);\r\n        }\r\n    });\r\n}",
    "elementChecker": "function checker(rulesConfig) {\r\n  return new Promise((resolve) => {\r\n    const startTime = Date.now();\r\n    const result = {\r\n      status: true,\r\n      messages: [],\r\n      summary: '',\r\n      time: 0,\r\n      details: {\r\n        conditionType: rulesConfig.multiple_rules_check_by_condition || 'OR',\r\n        rulesEvaluated: [],\r\n        totalTime: 0,\r\n        totalChecks: 0\r\n      }\r\n    };\r\n\r\n    if (!rulesConfig.rules || rulesConfig.rules.length === 0) {\r\n      result.messages.push('No rules defined - running test on all pages');\r\n      result.summary = 'No rules defined. Test will run on all pages.';\r\n      result.time = Date.now() - startTime;\r\n      resolve(result);\r\n      return;\r\n    }\r\n\r\n    const ruleChecks = rulesConfig.rules.map((rule) => {\r\n      return new Promise((ruleResolve) => {\r\n        const ruleStartTime = Date.now();\r\n        let intervalId;\r\n        let timeoutId;\r\n        let finalCheckDone = false;\r\n        let checksPerformed = 0;\r\n\r\n        const evaluateCondition = (finalCheck = false) => {\r\n          checksPerformed++;\r\n          const elements = document.querySelectorAll(rule.selector);\r\n          const elementCount = elements.length;\r\n          const countMatches = elementCount === rule.total_element_count;\r\n\r\n          let pass = false;\r\n          let message = '';\r\n\r\n          if (rule.is_matched) {\r\n            if (countMatches && !finalCheck) {\r\n              // Immediate success for positive match\r\n              pass = true;\r\n              message = `Element found immediately: ${rule.selector} ` +\r\n                `(Expected ${rule.total_element_count}, Found ${elementCount})`;\r\n              clearTimeout(timeoutId);\r\n              clearInterval(intervalId);\r\n            } else if (finalCheck) {\r\n              // Final check for positive match\r\n              pass = countMatches;\r\n              message = pass\r\n                ? `Element found after full wait: ${rule.selector} ` +\r\n                `(Expected ${rule.total_element_count}, Found ${elementCount})`\r\n                : `Element not found after ${rule.waiting_time}ms: ${rule.selector} ` +\r\n                `(Expected ${rule.total_element_count}, Found ${elementCount})`;\r\n            }\r\n          } else {\r\n            if (countMatches && !finalCheck) {\r\n              // Immediate failure for negative match\r\n              pass = false;\r\n              message = `Unwanted element found immediately: ${rule.selector} ` +\r\n                `(Found ${elementCount} when expecting none)`;\r\n              clearTimeout(timeoutId);\r\n              clearInterval(intervalId);\r\n            } else if (finalCheck) {\r\n              // Final check for negative match\r\n              pass = !countMatches;\r\n              message = pass\r\n                ? `No unwanted elements after ${rule.waiting_time}ms: ${rule.selector}`\r\n                : `Unwanted elements persisted: ${rule.selector} ` +\r\n                `(Found ${elementCount} when expecting none)`;\r\n            }\r\n          }\r\n\r\n          if (message) {\r\n            ruleResolve({\r\n              ...rule,\r\n              pass,\r\n              time: Date.now() - ruleStartTime,\r\n              checksPerformed,\r\n              finalElementCount: elementCount,\r\n              message\r\n            });\r\n            finalCheckDone = true;\r\n          }\r\n        };\r\n\r\n        // Initial immediate check\r\n        evaluateCondition();\r\n\r\n        // Only set up interval if not already resolved\r\n        if (!finalCheckDone) {\r\n          intervalId = setInterval(evaluateCondition, 100);\r\n          timeoutId = setTimeout(() => {\r\n            clearInterval(intervalId);\r\n            if (!finalCheckDone) evaluateCondition(true);\r\n          }, rule.waiting_time);\r\n        }\r\n      });\r\n    });\r\n\r\n    Promise.allSettled(ruleChecks).then((results) => {\r\n      const resolvedRules = results.map(r => r.value);\r\n\r\n      result.details.rulesEvaluated = resolvedRules;\r\n      result.details.totalTime = Date.now() - startTime;\r\n      result.details.totalChecks = resolvedRules.reduce((sum, rule) => sum + rule.checksPerformed, 0);\r\n\r\n      resolvedRules.forEach(rule => {\r\n        result.messages.push(rule.message);\r\n      });\r\n\r\n      const passStatuses = resolvedRules.map(r => r.pass);\r\n      result.status = result.details.conditionType === \"AND\"\r\n        ? passStatuses.every(Boolean)\r\n        : passStatuses.some(Boolean);\r\n\r\n      const passedCount = passStatuses.filter(Boolean).length;\r\n      result.summary = result.status\r\n        ? `Passed - ${passedCount}/${resolvedRules.length} rules met`\r\n        : `Failed - ${passedCount}/${resolvedRules.length} rules met`;\r\n\r\n      result.time = result.details.totalTime;\r\n      resolve(result);\r\n    });\r\n  });\r\n}",
    "urlChecker": "function checker(rulesConfig) {\r\n  return new Promise((resolve) => {\r\n    const startTime = Date.now();\r\n    const result = {\r\n      status: true,\r\n      messages: [],\r\n      summary: \"\",\r\n      time: 0,\r\n      details: {\r\n        currentURL: window.location.href,\r\n        conditionType: null,\r\n        rulesEvaluated: [],\r\n      },\r\n    };\r\n\r\n    // Handle empty rules case\r\n    if (\r\n      !rulesConfig.targeting_rules ||\r\n      rulesConfig.targeting_rules.length === 0\r\n    ) {\r\n      result.messages.push(\"No targeting rules defined. All URLs are allowed.\");\r\n      result.summary = \"No targeting rules defined. All URLs are allowed.\";\r\n      result.time = Date.now() - startTime;\r\n      resolve(result);\r\n      return;\r\n    }\r\n\r\n    const currentURL = window.location.href;\r\n    result.details.conditionType =\r\n      rulesConfig.multiple_rules_check_by_condition || \"OR\";\r\n\r\n    // Evaluate each rule\r\n    result.details.rulesEvaluated = rulesConfig.targeting_rules.map((rule) => {\r\n      const ruleResult = { rule, pass: false, message: \"\" };\r\n\r\n      try {\r\n        switch (rule.match_type) {\r\n          case \"EXACTLY_MATCHED\":\r\n            ruleResult.pass = currentURL === rule.value;\r\n            ruleResult.message = ruleResult.pass\r\n              ? `URL exactly matches '${rule.value}'`\r\n              : `URL does not exactly match '${rule.value}' (current: ${currentURL})`;\r\n            break;\r\n\r\n          case \"URL_CONTAINS\":\r\n            ruleResult.pass = currentURL.includes(rule.value);\r\n            ruleResult.message = ruleResult.pass\r\n              ? `URL contains '${rule.value}'`\r\n              : `URL does not contain '${rule.value}'`;\r\n            break;\r\n\r\n          case \"URL_DOES_NOT_CONTAIN\":\r\n            ruleResult.pass = !currentURL.includes(rule.value);\r\n            ruleResult.message = ruleResult.pass\r\n              ? `URL successfully excluded '${rule.value}'`\r\n              : `URL contains excluded string '${rule.value}'`;\r\n            break;\r\n\r\n          case \"REGEX_MATCHED\": {\r\n            const cleanedRegex = rule.value.replace(/^\\/|\\/[gimuy]*$/g, \"\");\r\n            const regex = new RegExp(cleanedRegex, \"gi\");\r\n            ruleResult.pass = regex.test(currentURL);\r\n            ruleResult.message = ruleResult.pass\r\n              ? `URL matched regex pattern ${rule.value}`\r\n              : `URL failed to match regex pattern ${rule.value}`;\r\n            break;\r\n          }\r\n\r\n          case \"REGEX_DOES_NOT_MATCH\": {\r\n            const cleanedRegex = rule.value.replace(/^\\/|\\/[gimuy]*$/g, \"\");\r\n            const regex = new RegExp(cleanedRegex, \"gi\");\r\n            ruleResult.pass = !regex.test(currentURL);\r\n            ruleResult.message = ruleResult.pass\r\n              ? `URL correctly excluded by regex pattern ${rule.value}`\r\n              : `URL matched excluded regex pattern ${rule.value}`;\r\n            break;\r\n          }\r\n\r\n          default:\r\n            ruleResult.message = `Unknown match type: ${rule.match_type}`;\r\n        }\r\n      } catch (error) {\r\n        ruleResult.message = `Error evaluating rule: ${error.message}`;\r\n      }\r\n\r\n      result.messages.push(ruleResult.message);\r\n      return ruleResult;\r\n    });\r\n\r\n    // Determine final status\r\n    const passes = result.details.rulesEvaluated.map((r) => r.pass);\r\n    result.status =\r\n      result.details.conditionType === \"AND\"\r\n        ? passes.every(Boolean)\r\n        : passes.some(Boolean);\r\n\r\n    // Generate summary\r\n    const ruleCount = result.details.rulesEvaluated.length;\r\n    const passedCount = passes.filter(Boolean).length;\r\n\r\n    result.summary = result.status\r\n      ? `Passed - ${passedCount}/${ruleCount} rules matched (${result.details.conditionType} condition)`\r\n      : `Failed - Only ${passedCount}/${ruleCount} rules matched (required ${result.details.conditionType})`;\r\n\r\n    // Add timing\r\n    result.time = Date.now() - startTime;\r\n\r\n    resolve(result);\r\n  });\r\n}"
  }
}
        abTestPilotMainInformation.testInfo.forEach(item => {            
            item.targetingFiles.customJS = eval(`(${item.targetingFiles.customJS})`);
        });
        abTestPilotMainInformation.parentTargeting.forEach(item => {
            item.targetingFiles.customJS = eval(`(${item.targetingFiles.customJS})`);
        });        
        abTestPilotMainInformation.targetMet.customJS = eval(`(${abTestPilotMainInformation.targetMet.customJS})`);
        abTestPilotMainInformation.targetMet.elementChecker = eval(`(${abTestPilotMainInformation.targetMet.elementChecker})`);
        abTestPilotMainInformation.targetMet.urlChecker = eval(`(${abTestPilotMainInformation.targetMet.urlChecker})`);      
        
        const abTestPilotApplicableTestsBasedOnTheWebsite = abTestPilotMainInformation.testInfo.filter(item => {
            return item.hostnames.some(hostname => {
                const hostnameWithoutSlash = hostname.split("")[hostname.length - 1] === "/" ? hostname.slice(0, -1) : hostname;
                const originWithoutSlash = window.location.origin.split("")[window.location.origin.length - 1] === "/" ? window.location.origin.slice(0, -1) : window.location.origin;
                return hostnameWithoutSlash.includes(originWithoutSlash) || originWithoutSlash.includes(hostnameWithoutSlash);
            });
        });

        const abTestPilotParentTargetingIDs = abTestPilotMainInformation.parentTargeting.map(item => item.variationIdList).flat();

        const abTestPilotWithoutParentTargetingTests = abTestPilotApplicableTestsBasedOnTheWebsite.filter(item => !abTestPilotParentTargetingIDs.includes(item.id));

        const abTestPilotWithParentTargetingTests = abTestPilotApplicableTestsBasedOnTheWebsite.filter(item => abTestPilotParentTargetingIDs.includes(item.id));

        const abTestPilotApplicableParentTargeting = abTestPilotMainInformation.parentTargeting.filter(item => {
            return item.variationIdList.some(id => {
                return abTestPilotWithParentTargetingTests.some(test => test.id === id);
            });
        });

        function abTestPilotTargetMet(targetMetFiles, targetingFiles) {
            return Promise.all([
                targetMetFiles.customJS(targetingFiles.customJS),
                targetMetFiles.elementChecker(targetingFiles.elementChecker),
                targetMetFiles.urlChecker(targetingFiles.urlChecker)
            ]);
        }

        abTestPilotApplicableParentTargeting.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {
                if(result.every(item => item.status === true)) {
                    abTestPilotMainInformation.testInfo.filter(test => item.variationIdList.includes(test.id)).forEach(test => {
                        abTestPilotTargetMet(abTestPilotMainInformation.targetMet, test.targetingFiles).then(result => {
                            if(result.every(item => item.status === true)) {
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
                        });
                    })
                }
            });
        });

        abTestPilotWithoutParentTargetingTests.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {
                if(result.every(item => item.status === true)) {
                    const style = document.createElement("style");
                    style.innerHTML = item.variationFiles.css;
                    style.type = "text/css";
                    style.id = item.id;
                    document.head.appendChild(style);

                    const script = document.createElement("script");
                    script.innerHTML = item.variationFiles.js;
                    script.type = "text/javascript";
                    script.id = item.id;
                    document.head.appendChild(script);
                }
            });
        });       

    