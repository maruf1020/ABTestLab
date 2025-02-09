## TODO
### there will be only one template and that for variation. rules: 
    - template > default > 1 index.js, 1 style.scss and 1 info.json
    - later user can make variation style by their own by their own name
    - so when user create test name after that they will be asked by which template they wanna chose but if there is only default template available then we wont ask to question for choosing variation. so for each type of test we will ask for choosing variation type after given test name but for multi-touch test we will ask them to choose variation type after create all touch-point.

### add targeting folder on each test
    - the structure of the targeting there will be a folder which contains some files. those are:
        - elementChecker.json:
            ```
                {
                    "rules": [],
                    "_comments": {
                        "basic": "Use multiple objects in the same format to define multiple conditions.",
                        "example": [
                            {
                                "selector": "body",
                                "isMatch": true,
                                "waitingTime": 1000,
                                "totalElementNumber": 1
                            },
                            {
                                "selector": ".grid-plp",
                                "isMatch": false,
                                "waitingTime": 2000,
                                "totalElementNumber": 1
                            }
                        ],
                        "selector": "The custom element selector will go here.",
                        "isMatch": "If false, the test won't bucket if this element is in the DOM; if true, the test runs if the element is present.",
                        "waitingTime": "The waiting time in milliseconds before checking the element.",
                        "totalElementNumber": "The expected number of elements that should match the condition."
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
                        "regex": "/https?:\\/\\/(www\\.)?[^\\s/$.?#].[^\\s]*/gi",
                        "targetUrls": [],
                        "_comment": {
                            "basic": "Use the regex expression to match against all websites. The regex will be tested against each URL in the 'targetUrls' array.",
                            "rules": [
                                "The regex should be case-insensitive (use 'gi' flags).",
                                "Target URLs should be provided as an array of strings.",
                                "This regex is designed to match any website URL starting with 'http' or 'https'.",
                                "Make sure to test the regex against each URL to see if it matches.",
                                "If you enter the value in both places then both condition will be checked",
                                "By default your test will only run the only under your website hostname"
                            ],
                            "example": {
                                "regex": "/example\\.com/gi",
                                "targetUrls": [
                                    "https://www.example.com",
                                    "http://another-site.org",
                                    "https://subdomain.example.net"
                                ]
                            }
                        }
                    }

                ``` 

    - for any test will add a 

