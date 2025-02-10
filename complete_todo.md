## Complete TODO
------------------------------------------------------------------------------------
Date: 11-FEB-2025
------------------------------------------------------------------------------------
### Except multi-touch test have to check all the test are workable (now working)




------------------------------------------------------------------------------------
Date: 10-FEB-2025
------------------------------------------------------------------------------------
For A/B Tests, AA Tests, and Patch Tests, when a test is created, the targeting folder should be copied from the template and placed inside the test.

If the targeting folder is not available in the template, prompt the user to run ->  npm run cli init, or in another option automatically initialize it for them. Once initialized, the targeting folder will be available in the template, and it can then be copied into the test.

For Multi-Touch Tests, there are two key changes: The template no longer needs to create a separate structure for a multi-touch page since it will be simplified. so, creating multi touch template code will will be removed accordingly.


A multi-touch test consists of multiple or single touchpoints. Users can select their desired touchpoints, then create one or multiple variations. All touchpoints will share the same variation. Currently, this part is fully functional.

but the expected behavior is:

Each touchpoint should have a default variation named "Control."

For Multi-Touch Tests, copy of the targeting folder should be placed under the test name, similar to other test types. aldo Every touchpoint should receive a copy of the targeting folder from the template. Before copying, the system should validate whether the targeting template is available. If not, it should be initialized first and the same validation applies to variation templates, ensuring they exist before use in any type of test. validation for all kind of test


After setting up the test, the system should prompt the user to select an active variation:

In Multi-Touch Tests, selecting a variation (or "Control") will apply the same selection across all touchpoints.

In other test types, users can independently choose any variation or control.

Since multiple folders may exist inside a test or touchpoint, each JSON file inside a variation should include a variable that identifies it as a variation. This ensures clarity when displaying selectable variations.



------------------------------------------------------------------------------------
Date: 9-FEB-2025
------------------------------------------------------------------------------------
### there will be only one template and that for variation. rules: 
    - template > default > 1 index.js, 1 style.scss and 1 info.json
    - later user can make variation style by their own by their own name
    - so when user create test name after that they will be asked by which template they wanna chose but if there is only default template available then we wont ask to question for choosing variation. so for each type of test we will ask for choosing variation type after given test name but for multi-touch test we will ask them to choose variation type after create all touch-point.

### add targeting folder on each test
    - the structure of the targeting there will be a folder which contains some files. those are:
        - elementChecker.json:
            ```
                {
                    "multiple_rules_check_by_condition" : "OR",
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
                        "multiple_rules_check_by_condition": "Use 'multiple_rules_check_by_condition' to define the condition for multiple rules check. Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any of the conditions are met.",
                        "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
                        "selector": "Use 'selector' to define the CSS selector for the element you want to check.",
                        "is_matched": "Use 'is_matched' to define the condition for the element check. Set it to 'true' if the element should be present on the page. Set it to 'false' if the element should not be present on the page.",
                        "waiting_time": "Use 'waiting_time' to define the time in milliseconds to wait for the element to appear on the page.",
                        "total_element_count": "Use 'total_element_count' to define the total number of elements that should match the selector. If the value is greater than 1, the test will pass only if the total number of elements that match the selector is equal to the value."
                    }
                }

            ```
        - customJS.js:
            there will be a export default function which will return true or a callback function.
            ```
                //either return true or call active function with true parameter to make the test active. and checkingTimeOut will wait until this waiting time
                export const checkingTimeOut = 0; // in milliseconds
                export default function activator(active) {
                    // document.body.addEventListener('click', (e) => {
                    //   active(true);
                    // });
                    return true;
                }               

            ```
            - later it will work this way (for me to remainder)
                ```
                    function callingFunction() {
                        let isTestActive = false;

                        // Calling the 'activator' function and passing a callback to handle the click event
                        const value = activator(function (isActivated) {
                            if (isActivated) {
                                isTestActive = true; // Set the flag when active is triggered
                            }
                        });

                        // Check if test is active after calling the 'activator' function
                        setTimeout(() => {
                            if (isTestActive || value) {
                                console.log('Test active');
                            } else {
                                console.log('Test not active');
                            }
                        }, checkingTimeOut); // Delay to allow for the click event to trigger
                    }
                ```
        - urlChecker.json
                ```
                    {
                        "multiple_rules_check_by_condition" : "OR",
                        "targeting_rules": [
                            {
                                "value": "/https?:\\/\\/(www\\.)?[^\\s/$.?#].[^\\s]*/gi",
                                "match_type": "REGEX_MATCHED"
                            }
                        ],
                        "_comment": {
                            "description": "Use 'targeting_rules' to define conditions for matching URLs.",
                            "rules": [
                                "use 'multiple_rules_check_by_condition' to define the condition for multiple rules check. Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any of the conditions are met.",
                                "Use 'EXACTLY_MATCHED' to match the exact URL.",
                                "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
                                "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
                                "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
                                "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
                                "If multiple conditions are added, all will be checked against the target URLs.",
                                "By default, your test will only run under the website's hostname unless specified otherwise."
                            ],
                            "example": {
                                "multiple_rules_check_by_condition" : "OR",
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

                ``` 

    - for any test will add a 

