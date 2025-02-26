const abTestPilotMainInformation = {
  "parentTargeting": [],
  "testInfo": [
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1740526673575_2104_V01",
      "targetingFiles": {
        "customJS": "function activator(active) {\n    // document.body.addEventListener('click', (e) => {\n    //   active(true);\n    // });\n    return true;\n}",
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
          "targeting_rules": [],
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
        "css": "body {\r\n    display: none;\r\n}",
        "js": "(function () {\n\t'use strict';\n\n\n\n})();\n"
      }
    }
  ],
  "targetMet": {
    "customJS": "function checker(activator) {\n    const checkingTimeout = 3000;\n    return new Promise((resolve) => {\n        const startTime = Date.now();\n        const result = {\n            status: false,\n            messages: [],\n            summary: '',\n            time: 0,\n            details: {\n                activationMethod: null,\n                checkingTimeout,\n                receivedCallback: false,\n                executionTime: 0,\n                triggeredBy: 'timeout',\n                wasImmediate: false\n            }\n        };\n\n        let isCompleted = false;\n        let timeoutId;\n\n        const active = (value) => {\n            if (!isCompleted) {\n                isCompleted = true;\n                clearTimeout(timeoutId);\n\n                result.status = value === true;\n                result.details.receivedCallback = true;\n                result.details.triggeredBy = value ? 'manual_activation' : 'manual_deactivation';\n                result.details.activationMethod = 'callback';\n\n                result.messages.push(value ?\n                    'Activated through manual callback' :\n                    'Deactivated through manual callback'\n                );\n\n                finalizeResult();\n                resolve(result);\n            }\n        };\n\n        const finalizeResult = () => {\n            result.time = Date.now() - startTime;\n            result.details.executionTime = result.time;\n            result.summary = result.status ?\n                'Active (' + result.details.triggeredBy.replace(/_/g, ' ') + ')' :\n                'Inactive (' + result.details.triggeredBy.replace(/_/g, ' ') + ')';\n        };\n\n        try {\n            const activatorResult = activator(active);\n\n            // Only handle EXPLICIT boolean returns immediately\n            if (typeof activatorResult === 'boolean') {\n                result.status = activatorResult;\n                result.details = {\n                    ...result.details,\n                    activationMethod: 'immediate',\n                    triggeredBy: activatorResult ?\n                        'immediate_activation' :\n                        'immediate_deactivation',\n                    wasImmediate: true\n                };\n                result.messages.push('Immediate ' + (activatorResult ? 'activation' : 'deactivation') + 'from return value');\n                finalizeResult();\n                resolve(result);\n                return;\n            }\n\n            // For non-boolean returns, wait for callback/timeout\n            timeoutId = setTimeout(() => {\n                if (!isCompleted) {\n                    result.messages.push('Timed out after ' + checkingTimeout + 'ms');\n                    result.details.triggeredBy = 'timeout';\n                    finalizeResult();\n                    resolve(result);\n                }\n            }, checkingTimeout);\n\n        } catch (error) {\n            result.messages.push('Activator error: ' + error.message); \n            result.details.triggeredBy = 'error';\n            finalizeResult();\n            resolve(result);\n        }\n    });\n}",
    "elementChecker": "function checker(rulesConfig) {\n    return new Promise((resolve) => {\n        const startTime = Date.now();\n        const result = {\n            status: true,\n            messages: [],\n            summary: '',\n            time: 0,\n            details: {\n                conditionType: rulesConfig.multiple_rules_check_by_condition || 'OR',\n                rulesEvaluated: [],\n                totalTime: 0,\n                totalChecks: 0\n            }\n        };\n\n        if (!rulesConfig.rules || rulesConfig.rules.length === 0) {\n            result.messages.push('No rules defined - running test on all pages');\n            result.summary = 'No rules defined. Test will run on all pages.';\n            result.time = Date.now() - startTime;\n            resolve(result);\n            return;\n        }\n\n        const ruleChecks = rulesConfig.rules.map((rule) => {\n            return new Promise((ruleResolve) => {\n            const ruleStartTime = Date.now();\n            let intervalId;\n            let timeoutId;\n            let finalCheckDone = false;\n            let checksPerformed = 0;\n\n            const evaluateCondition = (finalCheck = false) => {\n                checksPerformed++;\n                const elements = document.querySelectorAll(rule.selector);\n                const elementCount = elements.length;\n                const countMatches = elementCount === rule.total_element_count;\n\n                let pass = false;\n                let message = '';\n\n                if (rule.is_matched) {\n                    if (countMatches && !finalCheck) {\n                        // Immediate success for positive match\n                        pass = true;\n                        message = 'Element found immediately: ' + rule.selector  +\n                        ' (Expected ' + rule.total_element_count + ', Found ' + elementCount + ')';\n                        clearTimeout(timeoutId);\n                        clearInterval(intervalId);\n                    } else if (finalCheck) {\n                        // Final check for positive match\n                        pass = countMatches;\n                        message = pass\n                        ? 'Element found after full wait: ' + rule.selector +\n                        ' (Expected ' + rule.total_element_count + ', Found ' + elementCount + ')' \n                        : 'Element not found after ' + rule.waiting_time + 'ms: ' + rule.selector +\n                        'Expected ' + rule.total_element_count + ', Found ' + elementCount + ')';\n                    }\n                } else {\n                    if (countMatches && !finalCheck) {\n                        // Immediate failure for negative match\n                        pass = false;\n                        message = 'Unwanted element found immediately: ' + rule.selector  +\n                        ' (Found ' + elementCount +  'when expecting none)';\n                        clearTimeout(timeoutId);\n                        clearInterval(intervalId);\n                    } else if (finalCheck) {\n                        // Final check for negative match\n                        pass = !countMatches;\n                        message = pass\n                        ? 'No unwanted elements after ' + rule.waiting_time + 'ms: ' + rule.selector\n                        : 'Unwanted elements persisted: ' + rule.selector  +\n                        ' (Found ' + elementCount +  'when expecting none)';\n                    }\n                }\n\n                if (message) {\n                    ruleResolve({\n                        ...rule,\n                        pass,\n                        time: Date.now() - ruleStartTime,\n                        checksPerformed,\n                        finalElementCount: elementCount,\n                        message\n                    });\n                    finalCheckDone = true;\n                }\n            };\n\n            // Initial immediate check\n            evaluateCondition();\n\n            // Only set up interval if not already resolved\n            if (!finalCheckDone) {\n                intervalId = setInterval(evaluateCondition, 100);\n                timeoutId = setTimeout(() => {\n                    clearInterval(intervalId);\n                    if (!finalCheckDone) evaluateCondition(true);\n                }, rule.waiting_time);\n            }\n            });\n        });\n\n        Promise.allSettled(ruleChecks).then((results) => {\n            const resolvedRules = results.map(r => r.value);\n\n            result.details.rulesEvaluated = resolvedRules;\n            result.details.totalTime = Date.now() - startTime;\n            result.details.totalChecks = resolvedRules.reduce((sum, rule) => sum + rule.checksPerformed, 0);\n\n            resolvedRules.forEach(rule => {\n                result.messages.push(rule.message);\n            });\n\n            const passStatuses = resolvedRules.map(r => r.pass);\n            result.status = result.details.conditionType === \"AND\"\n            ? passStatuses.every(Boolean)\n            : passStatuses.some(Boolean);\n\n            const passedCount = passStatuses.filter(Boolean).length;\n            result.summary = result.status\n            ? 'Passed - ' + passedCount + '/' + resolvedRules.length +  'rules met'\n            : 'Failed - ' + passedCount + '/' + resolvedRules.length +  'rules met';\n\n            result.time = result.details.totalTime;\n            resolve(result);\n        });\n    });\n}",
    "urlChecker": "function checker(rulesConfig) {\n    return new Promise((resolve) => {\n        const startTime = Date.now();\n        const result = {\n            status: true,\n            messages: [],\n            summary: \"\",\n            time: 0,\n            details: {\n                currentURL: window.location.href,\n                conditionType: null,\n                rulesEvaluated: [],\n            },\n        };\n    \n        // Handle empty rules case\n        if (\n            !rulesConfig.targeting_rules ||\n            rulesConfig.targeting_rules.length === 0\n        ) {\n            result.messages.push(\"No targeting rules defined. All URLs are allowed.\");\n            result.summary = \"No targeting rules defined. All URLs are allowed.\";\n            result.time = Date.now() - startTime;\n            resolve(result);\n            return;\n        }\n    \n        const currentURL = window.location.href;\n        result.details.conditionType =\n            rulesConfig.multiple_rules_check_by_condition || \"OR\";\n    \n        // Evaluate each rule\n        result.details.rulesEvaluated = rulesConfig.targeting_rules.map((rule) => {\n            const ruleResult = { rule, pass: false, message: \"\" };\n    \n            try {\n            switch (rule.match_type) {\n                case \"EXACTLY_MATCHED\":\n                ruleResult.pass = currentURL === rule.value;\n                ruleResult.message = ruleResult.pass\n                    ? 'URL exactly matches \" ' + rule.value + ' \"' \n                    : 'URL does not exactly match \" ' + rule.value + ' \"' + '(current: ' + currentURL + ')';\n                break;\n    \n                case \"URL_CONTAINS\":\n                ruleResult.pass = currentURL.includes(rule.value);\n                ruleResult.message = ruleResult.pass\n                    ? 'URL contains \" ' + rule.value + ' \"'\n                    : 'URL does not contain \" ' + rule.value + ' \"';\n                break;\n    \n                case \"URL_DOES_NOT_CONTAIN\":\n                ruleResult.pass = !currentURL.includes(rule.value);\n                ruleResult.message = ruleResult.pass\n                    ? 'URL successfully excluded \"' + rule.value + '\"'\n                    : 'URL contains excluded string \"' +rule.value + '\"';\n                break;\n    \n                case \"REGEX_MATCHED\": {\n                const cleanedRegex = rule.value.replace(/^/|/[gimuy]*$/g, \"\");\n                const regex = new RegExp(cleanedRegex, \"gi\");\n                ruleResult.pass = regex.test(currentURL);\n                ruleResult.message = ruleResult.pass\n                    ? 'URL matched regex pattern ' + rule.value\n                    : 'URL failed to match regex pattern ' + rule.value;\n                break;\n                }\n    \n                case \"REGEX_DOES_NOT_MATCH\": {\n                const cleanedRegex = rule.value.replace(/^/|/[gimuy]*$/g, \"\");\n                const regex = new RegExp(cleanedRegex, \"gi\");\n                ruleResult.pass = !regex.test(currentURL);\n                ruleResult.message = ruleResult.pass\n                    ? 'URL correctly excluded by regex pattern ' + rule.value\n                    : 'URL matched excluded regex pattern ' + rule.value \n                break;\n                }\n    \n                default:\n                ruleResult.message = 'Unknown match type: ' + rule.match_type;\n            }\n            } catch (error) {\n            ruleResult.message = 'Error evaluating rule: ' + error.message;\n            }\n    \n            result.messages.push(ruleResult.message);\n            return ruleResult;\n        });\n    \n        // Determine final status\n        const passes = result.details.rulesEvaluated.map((r) => r.pass);\n        result.status =\n            result.details.conditionType === \"AND\"\n            ? passes.every(Boolean)\n            : passes.some(Boolean);\n    \n        // Generate summary\n        const ruleCount = result.details.rulesEvaluated.length;\n        const passedCount = passes.filter(Boolean).length;\n    \n        result.summary = result.status\n            ? 'Passed - ' + passedCount + '/' + ruleCount + 'rules matched (' + result.details.conditionType + 'condition)'\n            : 'Failed - Only ' + passedCount + '/' + ruleCount +  'rules matched (required ' +result.details.conditionType + ')';\n    \n        // Add timing\n        result.time = Date.now() - startTime;\n    \n        resolve(result);\n    });\n}"
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
        

        abTestPilotApplicableParentTargeting.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {
                console.log(result, "------");
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

        async function abTestPilotTargetMet(targetMetFiles, targetingFiles) {            
            const results = await Promise.all([
                targetMetFiles.customJS(targetingFiles.customJS),
                targetMetFiles.elementChecker(targetingFiles.elementChecker),
                targetMetFiles.urlChecker(targetingFiles.urlChecker)
            ]);
            console.log('Checker results:', results);
            return results;
        }

        abTestPilotWithoutParentTargetingTests.forEach(async item => {
            const result = await abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles)
            console.log(result, "------");  
            console.log(result.every(item => item.status === true), "------~~");
            if(result.every(item => item.status === true)) {
                console.log("Test is applicable");
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

    