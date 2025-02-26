import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import serialize from 'serialize-javascript';

export default async function browserScriptCreator(testInfo) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const coreDir = path.join(__dirname, "..");

    const browserData = {
        parentTargeting: testInfo.parentTargeting.map(item => {
            return {
                "parentTargetingId": item.parentTargetingId,
                "targetingFiles": item.targetingFiles,
                "variationIdList": item.variationIdList,
            }
        }),
        testInfo: testInfo.testInfo.map(item => {
            return {
                "hostnames": item.hostnames,
                "id": item.id,
                "targetingFiles": item.targetingFiles,
                "testType": item.testType,
                "variationFiles": item.variationFiles,
                "websiteName": item.websiteName,
                "testName": item.testName,
                "touchPointName": item.touchPointName,
                "variationName": item.variationName,
                "testType": item.testType
            }
        }),
        targetMet: {
            customJS: testInfo.targetMet.customJS,
            elementChecker: testInfo.targetMet.elementChecker,
            urlChecker: testInfo.targetMet.urlChecker
        }
    }

    const browserRunnerPath = path.join(coreDir, "browser-runner.js");
    // const jsonString = JSON.stringify(browserData, null, 2); // Pretty print with 2 spaces
    const SerializeString = serialize(browserData, { space: 2 }); // Pretty print with 2 spaces
    await fs.writeFileSync(browserRunnerPath, `const abTestPilotMainInformation = ${SerializeString}
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

    `);
}