import fs from "fs-extra";
import path from "path";
import serialize from "serialize-javascript";
import { fileURLToPath } from "url";

export default async function browserScriptCreator(testInfo) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const coreDir = path.join(__dirname, "..");

  const browserData = {
    parentTargeting: testInfo.parentTargeting.map((item) => {
      return {
        parentTargetingId: item.parentTargetingId,
        targetingFiles: item.targetingFiles,
        variationIdList: item.variationIdList,
      };
    }),
    testInfo: testInfo.testInfo.map((item) => {
      return {
        hostnames: item.hostnames,
        id: item.id,
        targetingFiles: item.targetingFiles,
        testType: item.testType,
        variationFiles: item.variationFiles,
        websiteName: item.websiteName,
        testName: item.testName,
        touchPointName: item.touchPointName,
        variationName: item.variationName,
        testType: item.testType,
      };
    }),
    targetMet: {
      customJS: testInfo.targetMet.customJS,
      elementChecker: testInfo.targetMet.elementChecker,
      urlChecker: testInfo.targetMet.urlChecker,
    },
  };

  const settingsPath = path.join(process.cwd(), "settings.json");
  const settings = await fs.readJson(settingsPath);
  const port = settings.portNumber;

  const browserRunnerPath = path.join(coreDir, "client", "browser-runner.js");
  // const jsonString = JSON.stringify(browserData, null, 2); // Pretty print with 2 spaces
  const SerializeString = serialize(browserData, { space: 2 }); // Pretty print with 2 spaces
  await fs.writeFileSync(
    browserRunnerPath,
    `(()=>{
        window.abTestPilotPortNumber = ${port};
        const abTestPilotMainInformation = ${SerializeString}
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

        function transformTests(tests) {
            return tests.reduce((acc, test) => {
                // If the test has a parentTargetingId, handle grouping
                if (test.parentTargetingId) {
                    // Find or create the group for this parentTargetingId
                    let group = acc.find(item => item.id === test.parentTargetingId);
                    if (!group) {
                        group = {
                            id: test.parentTargetingId,
                            testName: test.testName,
                            variationName: test.variationName,
                            testType: test.testType,
                            touchPointInfo: [],
                            websiteName: test.websiteName,
                            status: test.status,
                            parentTargetingId: ""
                        };
                        acc.push(group);
                    }
                    // Add the touch point information to the group
                    group.touchPointInfo.push({
                        name: test.touchPointName,
                        id: test.id,
                        status: test.status
                    });
                } else {
                    // For tests without parentTargetingId, just push them as they are
                    acc.push(test);
                }
                return acc;
            }, []);
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
            // for (const test of tests) {
            tests.forEach(async (test, i) => {
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
                                // parentTargetingInfo: value.parentTargetingTestInfo,
                                "id" : value.parentTargetingTestInfo.parentTargetingId,
                                "targetingFiles" : value.parentTargetingTestInfo.targetingFiles,
                                "parentTargetingDetails" : value.parentTargetingDetails,
                                "status" : value.parentTargetingDetails.every(item => item.status === true) ? "Active" : "Inactive",
                                message: value.parentTargetingDetails.every(item => item.status === true) ? "Parent targeting Met" : "Parent targeting does not Met",
                                "variationIdList" : value.parentTargetingTestInfo.variationIdList,
                                "tests": [],
                                "touchPoints": [],
                                "variationStatus": [],
                                "testName" : value.testName,
                                "variationName" : value.variationName,
                                "testType" : value.testType,
                                "websiteName" : value.websiteName,
                            }
                        }
                        acc[value.parentTargetingTestInfo.parentTargetingId].tests.push(value);
                        acc[value.parentTargetingTestInfo.parentTargetingId].touchPoints.push(value.touchPointName);
                        acc[value.parentTargetingTestInfo.parentTargetingId].variationStatus.push(value.targetingDetails.every(item => item.status === true) ? true : false);
                    }
                    else {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                if (abTestPilotVariaTionInfo[test.id].status === "Active") {
                    abTestPilotApplyTestVariation(test);
                }
            })
        }

        const abTestPilotApplicableTestsBasedOnTheWebsite = abTestPilotFilterTestsByHostname(abTestPilotMainInformation.testInfo);
        window.abTestPilotAllTest =  transformTests(abTestPilotApplicableTestsBasedOnTheWebsite.map(item => {
            return {
                "id": item.id,
                testName: item.testName,
                variationName: item.variationName,
                testType: item.testType,
                touchPointName: item.touchPointName,
                websiteName: item.websiteName,
                status: "Waiting",
                parentTargetingId: (abTestPilotMainInformation?.parentTargeting?.find(i => i.variationIdList.includes(item.id)))?.parentTargetingId,
            }
        }));
        const { testsWithParentTargeting, testsWithoutParentTargeting } = abTestPilotFilterTestsByParentTargeting(abTestPilotApplicableTestsBasedOnTheWebsite, abTestPilotMainInformation.parentTargeting);
        const abTestPilotApplicableParentTargeting = abTestPilotGetApplicableParentTargeting(abTestPilotMainInformation.parentTargeting, testsWithParentTargeting);

        abTestPilotApplicableParentTargeting.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {                
                const applicableTests = abTestPilotMainInformation.testInfo.filter(test => item.variationIdList.includes(test.id));
                abTestPilotProcessTests(applicableTests, abTestPilotMainInformation.targetMet, {isParentTargeting: true, resultData: result, result: result.every(item => item.status === true), info: item});                
            });
        });

        abTestPilotProcessTests(testsWithoutParentTargeting, abTestPilotMainInformation.targetMet, {isParentTargeting: false});    

    })()`
  );
}
