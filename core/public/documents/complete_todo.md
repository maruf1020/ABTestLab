## Complete TODO
------------------------------------------------------------------------------------
Date: 20-MAR-2025
------------------------------------------------------------------------------------
### allow user to create build files
    - on build there will be a build folder on the variation and that contain
        - a minified css file from style.scss build
        - a minified js file from from index.js file 
        - a clean css file from style.scss build (after build prettier will pretty the code)
        - a clean js file from from index.js file (after build prettier will pretty the code)
        - a js file which contain css and js both. for css we will inject a script tag and on that tag we will inset all the css.
        - On setting command user can on of for different type of file !IMPOTENT

------------------------------------------------------------------------------------
Date: 19-MAR-2025
------------------------------------------------------------------------------------
### allow user to create build files
    - There will be a new command npm run cli build 
        - Select a variation and Build
            - this will allow user to select variation from a website then test then if touch-point available then touch-point point then variation and of touch-point not available then after test directly variation. here control is also a variation.
        - build the last test
            - from history.json if any last test available then only this option will be visible and alow user to build the last test
        - build from history
            - from history user will be able to select test and build that. But here only the options will be shown for single run tests not for group run tests.

------------------------------------------------------------------------------------
Date: 18-MAR-2025
------------------------------------------------------------------------------------
### user can run test from create function
    - hove to provide option to run a test directly from create option
    - need to remove the option start single test from start option (Not sure yet)

------------------------------------------------------------------------------------
Date: 17-MAR-2025
------------------------------------------------------------------------------------
### user can run test from create function
    - have to cleaning the code for start file
        - cleaning code
        - re-usable function
        - make some function export so that later we are able to run test outside the start file
        - need to use fileUtils function as maximum as possible
        - have to remove list.js and testUtil js from from command folder


------------------------------------------------------------------------------------
Date: 16-MAR-2025
------------------------------------------------------------------------------------
### we will create I global command -> npm run cli
 - settings (with a mindful name and a hint also)
        - init (with a mindful name and a hint also)
        - Build (with a mindful name and a hint also)

------------------------------------------------------------------------------------
Date: 15-MAR-2025
------------------------------------------------------------------------------------
### we will create I global command -> npm run cli
    - which will display the main options
        - Start (with a mindful name and a hint also)
             (Here build will be just an option when user select a variation then ask for run, build and info)
        - Create (with a mindful name and a hint also)
       

------------------------------------------------------------------------------------
Date: 14-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - Added an option to rename variation and touch point
    - added an option to see details for variation and touch point
    - added an option to delete any variation and touch point

------------------------------------------------------------------------------------
Date: 12-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - added option to rename variation

------------------------------------------------------------------------------------
Date: 11-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - code re structure

------------------------------------------------------------------------------------
Date: 10-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - For "npm run cli create"
        -confirm that no duplicate website name inside the website list. inside any website there should not be any same name test name. same as inside test there should not same name touch point or test. Also for touch point and test there should not be same name multiple variation. So all will be unique. 

------------------------------------------------------------------------------------
Date: 09-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - For "npm run cli create"
        - created ability to create touch point.
            - for creating any new touch point, automatically added targeting, info and variations which other touch point contain.

------------------------------------------------------------------------------------
Date: 08-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - For "npm run cli create"
        - Added an option for create variation   
            - make it workable

------------------------------------------------------------------------------------
Date: 07-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - For "npm run cli create"
        - Added an option for create variation            

------------------------------------------------------------------------------------
Date: 06-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - update license 
    - Added option for delete, rename, details for touch points and variations

------------------------------------------------------------------------------------
Date: 05-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - make the back and exit feature for all kind of step on create menu 

------------------------------------------------------------------------------------
Date: 04-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - make the back and exit feature for test, variation and touchPoint

------------------------------------------------------------------------------------
Date: 03-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - make the back and exit feature for website and test selection 

------------------------------------------------------------------------------------
Date: 02-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required     
    - change file structure 

------------------------------------------------------------------------------------
Date: 01-MAR-2025
------------------------------------------------------------------------------------
### Enhancement required  
    - Have to set two global variable 
        - one will only contain the variation information but internal task.
        - Another will be abTestPilot for user, where they will see the test details.

------------------------------------------------------------------------------------
Date: 28-FEB-2025
------------------------------------------------------------------------------------
### Enhancement required  
    - Reload webpage when update targeting  
        - we have to add a compiled folder for custom js targeting. (Will dop later)      
        - Have to provide ability to make a reload on the webpage when user update targeting.

------------------------------------------------------------------------------------
Date: 27-FEB-2025
------------------------------------------------------------------------------------
Transfer config information to the browser side for detecting reload feature. 


------------------------------------------------------------------------------------
Date: 26-FEB-2025
------------------------------------------------------------------------------------
### have to created checker (targeting check) main function meaningful and a proper mapper which will allow any upgradation workable


------------------------------------------------------------------------------------
Date: 25-FEB-2025
------------------------------------------------------------------------------------
### re-create and enhance folder and file structure 


------------------------------------------------------------------------------------
Date: 24-FEB-2025
------------------------------------------------------------------------------------
### create teo separate browser script for run test more faster.  
    - One file will inject the initial test for fast inject code to the DOM
    - Another will inject after for gating live changes.



------------------------------------------------------------------------------------
Date: 23-FEB-2025
------------------------------------------------------------------------------------
### Allow user to import from different files to work with on any variation. (work with bundler )
- Instead of that we will create a compiled folder.
        - when a test will run it will do the DOM update only is detect any change inside compiled folder. tough watchPaths will be still same but inside `.on("change", async (filePath) => {` we will decide that should we need to call update the DOM or not.

------------------------------------------------------------------------------------
Date: 22-FEB-2025
------------------------------------------------------------------------------------
### Allow user to import from different files to work with on any variation. (work with bundler )
- Instead of that we will create a compiled folder.
        - any changes on index.js or style.scss file on any variation will again do bundler and update it inside compiler.


------------------------------------------------------------------------------------
Date: 21-FEB-2025
------------------------------------------------------------------------------------
### Allow user to import from different files to work with on any variation. (work with bundler )
- Instead of that we will create a compiled folder.
        - We will use the variation data from the compiled files.


------------------------------------------------------------------------------------
Date: 20-FEB-2025
------------------------------------------------------------------------------------
### Allow user to import from different files to work with on any variation. (work with bundler )
- Instead of that we will create a compiled folder.
        - compiled folder will be created each time when a variation will be created         


------------------------------------------------------------------------------------
Date: 19-FEB-2025
------------------------------------------------------------------------------------
### Allow user to import from different files to work with on any variation. (work with bundler )
    - We will no longer include any css file inside the variation. 



------------------------------------------------------------------------------------
Date: 18-FEB-2025
------------------------------------------------------------------------------------
### Allow user to import from different files to work with on any variation. (work with bundler )
    - user will be able to import any module for scss or js file.



------------------------------------------------------------------------------------
Date: 17-FEB-2025
------------------------------------------------------------------------------------
### have to work on targeting
    - Here I have to marge the initial development branch with master and and create another branch for enhancement targeting. 

    - group test look should look like this which we have done on 

    - viewTestHistory: but only on the group test.



------------------------------------------------------------------------------------
Date: 16-FEB-2025
------------------------------------------------------------------------------------
### Update "view test history" 
    - with history list there will be a back and exit button on view test history 
    - when come to this command then table will be look like this but the condition is:
        - Single-run test without multi-touch: No Touch-point column, no Group Test column.
        - Single-run test with multi-touch: Includes a Touch-point column but no Group Test column.
        - Group-run test without multi-touch: Includes a Group Test column but no Touch-point column.
        - Group-run test with multi-touch: Includes both Touch-point and Group Test columns.
    - change the name "Run Multiple Tests" to "Run Group Tests"
    - Also provide option to select a group selection and run tests as a group accordingly.
    - if last test is a group test then give user provide ad ability to run group wise again.
    - on "Run Group Tests" there will be 3 options:
        - create group test
            - Allow user to choose and run the test. which feature is currently available directly under the "Run Multiple Tests" options.
        - run from History
            - Here user will see the list of single run test from history array and later user can multiselect them and create a group. And run that group of test.
        - View group test History
            - here user will see the list of group wise running test history and can run that again.

------------------------------------------------------------------------------------
Date: 16-FEB-2025
------------------------------------------------------------------------------------
### have to make the multi test run at the same time workable 

------------------------------------------------------------------------------------
Date: 15-FEB-2025
------------------------------------------------------------------------------------
### Have to update the "Run last active test more powerful"
    - The option name will be changed to "Latest test" from "Run Last Active Test". if users choose "Latest test" test then they will see the following options:  "Run Latest test", "Change variation" (here user will be able to change the variation under the same test, user will see a variation list and after choosing variation the test will imidiately run), "change test" (here user will be able to change the test under same website, they will see the test list, after choosing test they will see the variation list and after choosing variation the test will start automatically). "Change variation" and "change test" will be shown if the last run test is ran only a single test, this two feature wont be applicable if last running test is a list of test. if last run test is a a group of tests then user will see the only one option "Run Last Active Tests" when they choose "Latest test".

### added settings command to see and update settings

------------------------------------------------------------------------------------
Date: 13-FEB-2025
------------------------------------------------------------------------------------
### Have to use ID instead of name.
    - currently I am using name everywhere, like checking, comparing, or handle any kind of operation using the test name, variation name, touch point name, test name, website name etc but I should use an ID for each thing, like when I will create website, test, variation, touch point etc then with name I also need to include an ID and later everywhere for create start run server (clint side , server side) and everywhere I should handle operation not using name but IDs.  

### Have to add a default skelton  

### have to move the public and script folder inside the src folder and their code accordingly 

### Have to create files for target met


------------------------------------------------------------------------------------
Date: 11-FEB-2025
------------------------------------------------------------------------------------
### Except multi-touch test have to check all the test are workable ( working)
### multi touch test is also working




------------------------------------------------------------------------------------
Date: 10-FEB-2025
------------------------------------------------------------------------------------
    - For A/B Tests, AA Tests, and Patch Tests, when a test is created, the targeting folder should be copied from the template and placed inside the test.

    - If the targeting folder is not available in the template, prompt the user to run ->  npm run cli init, or in another option automatically initialize it for them. Once initialized, the targeting folder will be available in the template, and it can then be copied into the test.

    - For Multi-Touch Tests, there are two key changes: The template no longer needs to create a separate structure for a multi-touch page since it will be simplified. so, creating multi touch template code will will be removed accordingly.


    - A multi-touch test consists of multiple or single touchpoints. Users can select their desired touchpoints, then create one or multiple variations. All touchpoints will share the same variation. Currently, this part is fully functional.

    - but the expected behavior is:

    - Each touchpoint should have a default variation named "Control."

    - For Multi-Touch Tests, copy of the targeting folder should be placed under the test name, similar to other test types. aldo Every touchpoint should receive a copy of the targeting folder from the template. Before copying, the system should validate whether the targeting template is available. If not, it should be initialized first and the same validation applies to variation templates, ensuring they exist before use in any type of test. validation for all kind of test


    - After setting up the test, the system should prompt the user to select an active variation:

    - In Multi-Touch Tests, selecting a variation (or "Control") will apply the same selection across all touch points.

    - In other test types, users can independently choose any variation or control.

    - Since multiple folders may exist inside a test or touch point, each JSON file inside a variation should include a variable that identifies it as a variation. This ensures clarity when displaying selectable variations.



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