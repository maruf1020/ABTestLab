(()=>{
        const abTestPilotMainInformation = {
  "parentTargeting": [],
  "testInfo": [
    {
      "hostnames": [
        "https:\u002F\u002Fwww.trysuri.com"
      ],
      "id": "1741979950736_4108_scroll_animation_",
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
      "testType": "AA",
      "variationFiles": {
        "css": ".suri-animation-test {\n  height: 100vh;\n  box-sizing: border-box;\n}\n.suri-animation-test.sticky-container {\n  position: sticky;\n  top: 0;\n  z-index: 999;\n}\n.suri-animation-test .global-section {\n  background-color: #EFEEEA;\n  height: 100%;\n}\n.suri-animation-test .on-scroll_container {\n  height: 100%;\n}\n.suri-animation-test .font-title--3xl {\n  font-size: 36px;\n  font-weight: 100;\n  line-height: 1.4;\n  text-align: center;\n}\n.suri-animation-test .on-scroll_content {\n  padding: 48px;\n  box-sizing: border-box;\n  height: 100%;\n  height: 100%;\n  position: relative;\n  display: block;\n}\n.suri-animation-test .on-scroll_content .gs_on-scroll-animation-title {\n  position: absolute;\n  opacity: 0.2;\n  transform: scale(0.7);\n  position: relative;\n  top: var(--first-text-top);\n  transition: opacity 0.7s, transform 0.7s, top 0.7s ease-out;\n}\n.suri-animation-test .on-scroll_content[data-first-text-visible=true] .gs_on-scroll-animation-title {\n  opacity: 1;\n  transform: scale(1);\n}\n.suri-animation-test .on-scroll_content .gs_on-scroll-animation-content {\n  width: 100%;\n  position: absolute;\n  opacity: 0;\n  left: 50%;\n  top: var(--second-text-top);\n  transform: translate(-50%, 40px);\n  transition: opacity 0.7s, transform 0.7s, top 0.7s ease-out;\n}\n.suri-animation-test .on-scroll_content .gs_on-scroll-animation-content \u003E p {\n  text-align: center;\n}\n.suri-animation-test .on-scroll_content[data-second-text-visible=true] .gs_on-scroll-animation-content {\n  transform: translate(-50%, 0);\n  opacity: 1;\n}\n.suri-animation-test .on-scroll_content .gs_media-desktop {\n  width: 402.5px;\n  height: 552px;\n  margin-top: 20px;\n  position: absolute;\n  opacity: 0;\n  top: var(--video-top);\n  left: 50%;\n  transform: translate(-50%, 100px);\n  transition: opacity 0.7s, transform 0.7s, top 0.7s ease-out;\n}\n.suri-animation-test .on-scroll_content[data-video-visible=true] .gs_media-desktop {\n  transform: translate(-50%, 0);\n  opacity: 1;\n}",
        "js": "(() =\u003E {\r\n    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {\r\n        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);\r\n        if (timer \u003C= 0) return;\r\n        (!isVariable && elements.length \u003E= minElements) || (isVariable && typeof window[waitFor] !== \"undefined\") ? callback(elements) : setTimeout(() =\u003E waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);\r\n    }\r\n\r\n    function getSection() {\r\n        const element = document.createElement('div');\r\n        element.classList.add('suri-animation-test');\r\n        element.innerHTML = `\r\n        \u003Cdiv class=\"global-section color-background-1 on-scroll-global-section\"\u003E\r\n            \u003Cdiv class=\"container on-scroll_container\"\u003E\r\n                \u003Cdiv class=\"global-section__content on-scroll_content\"\u003E\r\n                    \u003Cdiv class=\"gs_on-scroll-animation-title active\"\u003E\r\n                        \u003Cdiv class=\"font-title--3xl\"\u003EEngineered for power, simplicity and \u003Cbr\u003E sustainability.\u003C\u002Fdiv\u003E\r\n                    \u003C\u002Fdiv\u003E\r\n                    \u003Cdiv class=\"gs_on-scroll-animation-content active\"\u003E\r\n                        \u003Cp\u003ENo apps. No Gimmicks. Just a powerful sonic clean. And a 40 day battery life.\u003C\u002Fp\u003E\r\n                    \u003C\u002Fdiv\u003E\r\n                    \u003Cdiv class=\"gs_media-desktop active\"\u003E\r\n                        \u003Cvideo playsinline=\"playsinline\" autoplay=\"autoplay\" loop=\"loop\" muted=\"muted\" preload=\"metadata\"\r\n                            aria-label=\"xs:sunset-bloom\"\r\n                            poster=\"\u002F\u002Fb7yu0mvm2javsiz1-50259296444.shopifypreview.com\u002Fcdn\u002Fshop\u002Ffiles\u002Fpreview_images\u002F9ae4c0b1734245e1a71205ddbb6574c9.thumbnail.0000000000_small.jpg?v=1727440727\"\u003E\r\n                            \u003Csource\r\n                                src=\"\u002F\u002Fb7yu0mvm2javsiz1-50259296444.shopifypreview.com\u002Fcdn\u002Fshop\u002Fvideos\u002Fc\u002Fvp\u002F9ae4c0b1734245e1a71205ddbb6574c9\u002F9ae4c0b1734245e1a71205ddbb6574c9.HD-1080p-4.8Mbps-35439563.mp4?v=0\"\r\n                                type=\"video\u002Fmp4\"\u003E\r\n                            \u003Cimg alt=\"xs:sunset-bloom\"\r\n                                src=\"\u002F\u002Fb7yu0mvm2javsiz1-50259296444.shopifypreview.com\u002Fcdn\u002Fshop\u002Ffiles\u002Fpreview_images\u002F9ae4c0b1734245e1a71205ddbb6574c9.thumbnail.0000000000_small.jpg?v=1727440727\"\u003E\r\n                        \u003C\u002Fvideo\u003E\r\n                    \u003C\u002Fdiv\u003E\r\n                \u003C\u002Fdiv\u003E\r\n            \u003C\u002Fdiv\u003E\r\n        \u003C\u002Fdiv\u003E\r\n        `;\r\n        return element;\r\n    }\r\n\r\n    const gap = {\r\n        firstAndSecond: {\r\n            desktop: 60,\r\n            tablet: 60,\r\n            mobile: 60\r\n        },\r\n        secondAndVideo: {\r\n            desktop: 20,\r\n            tablet: 20,\r\n            mobile: 20\r\n        }\r\n    };\r\n\r\n    function getDeviceType() {\r\n        return window.innerWidth \u003E 1024 ? 'desktop' : window.innerWidth \u003E 768 ? 'tablet' : 'mobile';\r\n    }\r\n\r\n    function scroller(step) {\r\n        const contentContainer = document.querySelector('.on-scroll_content');\r\n        const containerHeight = contentContainer.offsetHeight;\r\n\r\n        const firstTest = document.querySelector('.gs_on-scroll-animation-title');\r\n        const secondTest = document.querySelector('.gs_on-scroll-animation-content');\r\n        const video = document.querySelector('.gs_media-desktop');\r\n\r\n        const firstTestHeight = firstTest.offsetHeight;\r\n        const secondTestHeight = secondTest.offsetHeight;\r\n        const videoHeight = video.offsetHeight;\r\n\r\n\r\n        const deviceType = getDeviceType();\r\n        const firstAndSecondGap = gap.firstAndSecond[deviceType];\r\n        const secondAndVideoGap = gap.secondAndVideo[deviceType];\r\n\r\n\r\n        const firstTestTopStepOne = (containerHeight \u002F 2) - (firstTestHeight \u002F 2);\r\n        const firstTestTopStepTwo = (containerHeight \u002F 2) - ((firstTestHeight + secondTestHeight + firstAndSecondGap) \u002F 2);\r\n        const firstTestTopStepThree = (containerHeight \u002F 2) - ((firstTestHeight + secondTestHeight + videoHeight + firstAndSecondGap + secondAndVideoGap) \u002F 2);\r\n\r\n        const secondTestTopFirstStep = firstTestTopStepOne + firstTestHeight + firstAndSecondGap;\r\n        const secondTestTopSecondStep = firstTestTopStepTwo + firstTestHeight + firstAndSecondGap;\r\n        const secondTestTopThirdStep = firstTestTopStepThree + firstTestHeight + firstAndSecondGap;\r\n\r\n        const videoTopStepOne = secondTestTopFirstStep + secondTestHeight + secondAndVideoGap;\r\n        const videoTopStepTwo = secondTestTopSecondStep + secondTestHeight + secondAndVideoGap;\r\n        const videoTopStepThree = secondTestTopThirdStep + secondTestHeight + secondAndVideoGap;\r\n\r\n        contentContainer.style.setProperty('--first-text-top', `${firstTestTopStepOne}px`);\r\n        contentContainer.style.setProperty('--second-text-top', `${secondTestTopFirstStep}px`);\r\n        contentContainer.style.setProperty('--video-top', `${videoTopStepOne}px`);\r\n\r\n\r\n        switch (step) {\r\n            case 0:\r\n                contentContainer.style.setProperty('--first-text-top', `${firstTestTopStepOne}px`);\r\n                contentContainer.style.setProperty('--second-text-top', `${secondTestTopFirstStep}px`);\r\n                contentContainer.style.setProperty('--video-top', `${videoTopStepOne}px`);\r\n\r\n                contentContainer.removeAttribute('data-first-text-visible');\r\n                contentContainer.removeAttribute('data-second-text-visible');\r\n                contentContainer.removeAttribute('data-video-visible');\r\n                break;\r\n            case 1:\r\n                contentContainer.style.setProperty('--first-text-top', `${firstTestTopStepOne}px`);\r\n                contentContainer.style.setProperty('--second-text-top', `${secondTestTopFirstStep}px`);\r\n                contentContainer.style.setProperty('--video-top', `${videoTopStepOne}px`);\r\n\r\n                contentContainer.setAttribute('data-first-text-visible', true);\r\n                contentContainer.removeAttribute('data-second-text-visible');\r\n                contentContainer.removeAttribute('data-video-visible');\r\n                break;\r\n            case 2:\r\n                contentContainer.style.setProperty('--first-text-top', `${firstTestTopStepTwo}px`);\r\n                contentContainer.style.setProperty('--second-text-top', `${secondTestTopSecondStep}px`);\r\n                contentContainer.style.setProperty('--video-top', `${videoTopStepTwo}px`);\r\n\r\n                contentContainer.setAttribute('data-first-text-visible', true);\r\n                contentContainer.setAttribute('data-second-text-visible', true);\r\n                contentContainer.removeAttribute('data-video-visible');\r\n                break;\r\n            case 3:\r\n                contentContainer.style.setProperty('--first-text-top', `${firstTestTopStepThree}px`);\r\n                contentContainer.style.setProperty('--second-text-top', `${secondTestTopThirdStep}px`);\r\n                contentContainer.style.setProperty('--video-top', `${videoTopStepThree}px`);\r\n\r\n                contentContainer.setAttribute('data-first-text-visible', true);\r\n                contentContainer.setAttribute('data-second-text-visible', true);\r\n                contentContainer.setAttribute('data-video-visible', true);\r\n                break;\r\n        }\r\n    }\r\n\r\n    function mainJs([parentSection]) {\r\n        if (document.querySelector('.suri-animation-test')) {\r\n            document.querySelector('.suri-animation-test').remove();\r\n        }\r\n\r\n        const newSection = getSection();\r\n\r\n        parentSection.children[3].insertAdjacentElement('afterend', newSection);\r\n\r\n        window.scroller = scroller;\r\n        \u002F\u002Finitial position set\r\n        scroller(0);\r\n\r\n        \u002F\u002Fscroll event\r\n        const contentContainer = document.querySelector('.suri-animation-test');\r\n        const contentContainerTop = contentContainer.offsetTop;\r\n        const contentContainerHeight = contentContainer.offsetHeight;\r\n        const windowHeight = window.innerHeight;\r\n\r\n\r\n        window.addEventListener('scroll', e =\u003E {\r\n            if (contentContainerTop + contentContainerHeight \u003C window.scrollY || contentContainerTop \u003E window.scrollY + windowHeight) return;\r\n\r\n            const fixer = 350; \u002F\u002F plus value for early trigger\r\n            const scrollPosition = window.scrollY + windowHeight \u002F 2;\r\n            const sectionMiddle = (contentContainerTop + contentContainerHeight \u002F 2);\r\n\r\n            if (window.scrollY \u003E= contentContainerTop + 300); else if (window.scrollY \u003E= contentContainerTop) {\r\n                scroller(3);\r\n                \u002F\u002Fremove scroll event\r\n            } else if (window.scrollY \u003E= contentContainerTop - 100) {\r\n                scroller(2);\r\n            } else if (scrollPosition \u003E= sectionMiddle - fixer) {\r\n                scroller(1);\r\n                \u002F\u002F contentContainer.classList.add('sticky-container')\r\n            } else {\r\n                scroller(0);\r\n            }\r\n        });\r\n\r\n        console.log('%cSuri anmation test: v-01', 'background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px');\r\n    }\r\n\r\n    waitForElem('.dynamic-sections \u003E *:nth-child(4)', () =\u003E {\r\n        waitForElem('.dynamic-sections', mainJs);\r\n    });\r\n})();\r\n"
      },
      "websiteName": "trysuri",
      "testName": "animation test",
      "touchPointName": null,
      "variationName": "scroll animation "
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
        window.abTestPilotVariaTionInfo = {};
        window.abTestPilot = {};
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
            style.id = 'abTestPilot-' + test.id;
            document.head.appendChild(style);

            const script = document.createElement("script");
            script.innerHTML = test.variationFiles.js;
            script.type = "text/javascript";
            script.id = 'abTestPilot-' + test.id;
            document.head.appendChild(script);
        }

        async function abTestPilotProcessTests(tests, targetMet, parentTargetingData) {
            for (const test of tests) {
                const result = await abTestPilotTargetMet(targetMet, test.targetingFiles);
                const isParentTargeting = parentTargetingData.isParentTargeting;               

                abTestPilotVariaTionInfo[test.id] = {
                    status: result.every(item => item.status === true) ? "Active" : "Inactive",
                    message: result.every(item => item.status === true) ? "Targeting Met and Variation Applied" : "Targeting Not Met and Variation Not Applied",
                    targetingDetails: result,
                    id: test.id,
                    websiteName : test.websiteName,
                    testName : test.testName,
                    variationName : test.variationName,
                    testType : test.testType
                }
                if(test.touchPointName) {
                    abTestPilotVariaTionInfo[test.id].touchPointName = test.touchPointName;
                }
                if(isParentTargeting) {
                    const parentResult = parentTargetingData.result;
                    const parentResultData = parentTargetingData.resultData;
                    const parentTargetingInfo = parentTargetingData.info;
                    abTestPilotVariaTionInfo[test.id].status = parentResult ? result.every(item => item.status === true) ? "Active" : "Inactive" : "Inactive";
                    abTestPilotVariaTionInfo[test.id].parentTargetingDetails = parentResultData;
                    abTestPilotVariaTionInfo[test.id].result = {
                        touchPointTargeting: abTestPilotVariaTionInfo[test.id].status,
                        parentTargeting: parentResult ? "Active" : "Inactive"
                    }
                    abTestPilotVariaTionInfo[test.id].parentTargetingTestInfo = parentTargetingInfo;
                    abTestPilotVariaTionInfo[test.id].message = parentResult ? result.every(item => item.status === true) ? "Both of the Parent and touch point targeting met and Variation Applied" : "Parent Targeting Met but touch point targeting not met and Variation Not Applied" : result.every(item => item.status === true) ? "Touch point targeting met but Parent Targeting not met and Variation is not Applied" : "Both of the Parent and touch point targeting not met and Variation Not Applied";
                }
                // on abTestPilot pilot variation we have set the data in this way. if there is parent targeting then we will add a key on the object of that parent targeting id and inside that we will include the parent information and inside there we will keep the child test details and if there is no parent targeting then we will keep the test details directly on the object.
                
                abTestPilot = Object.entries(abTestPilotVariaTionInfo).reduce((acc, [key, value]) => {
                    if(value.parentTargetingTestInfo) {
                        if(!acc[value.parentTargetingTestInfo.parentTargetingId]) {
                            acc[value.parentTargetingTestInfo.parentTargetingId] = {
                                parentTargetingInfo: value.parentTargetingTestInfo,
                                tests: []
                            }
                        }
                        acc[value.parentTargetingTestInfo.parentTargetingId].tests.push(value);
                    }
                    else {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                if (abTestPilotVariaTionInfo[test.id].status === "Active") {
                    abTestPilotApplyTestVariation(test);
                }
            }
        }

        const abTestPilotApplicableTestsBasedOnTheWebsite = abTestPilotFilterTestsByHostname(abTestPilotMainInformation.testInfo);
        const { testsWithParentTargeting, testsWithoutParentTargeting } = abTestPilotFilterTestsByParentTargeting(abTestPilotApplicableTestsBasedOnTheWebsite, abTestPilotMainInformation.parentTargeting);
        const abTestPilotApplicableParentTargeting = abTestPilotGetApplicableParentTargeting(abTestPilotMainInformation.parentTargeting, testsWithParentTargeting);

        abTestPilotApplicableParentTargeting.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {                
                const applicableTests = abTestPilotMainInformation.testInfo.filter(test => item.variationIdList.includes(test.id));
                abTestPilotProcessTests(applicableTests, abTestPilotMainInformation.targetMet, {isParentTargeting: true, resultData: result, result: result.every(item => item.status === true), info: item});                
            });
        });

        abTestPilotProcessTests(testsWithoutParentTargeting, abTestPilotMainInformation.targetMet, {isParentTargeting: false});    

    })()