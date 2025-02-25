import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"

export default async function browserScriptCreator(testInfo) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const coreDir = path.join(__dirname, "..");

    const browserData = {
        parentTargeting: testInfo.parentTargeting.map(item => {
            return {
                "parentTargetingId": item.parentTargetingId,
                "targetingFiles": item.targetingFiles,
                "variationIdList": item.variationIdList
            }
        }),
        testInfo: testInfo.testInfo.map(item => {
            return {
                "hostnames": item.hostnames,
                "id": item.id,
                "targetingFiles": item.targetingFiles,
                "testType": item.testType,
                "variationFiles": item.variationFiles
            }
        }),
        targetMet: {
            customJS: testInfo.targetMet.customJS,
            elementChecker: testInfo.targetMet.elementChecker,
            urlChecker: testInfo.targetMet.urlChecker
        }
    }

    const browserRunnerPath = path.join(coreDir, "browser-runner.js");
    const jsonString = JSON.stringify(browserData, null, 2); // Pretty print with 2 spaces
    await fs.writeFileSync(browserRunnerPath, `const abTestPilotMainInformation = ${jsonString}
        abTestPilotMainInformation.testInfo.forEach(item => {            
            item.targetingFiles.customJS = eval(` + "`" + `($` + `{item.targetingFiles.customJS})` + "`" + `);
        });
        abTestPilotMainInformation.parentTargeting.forEach(item => {
            item.targetingFiles.customJS = eval(` + "`" + `($` + `{item.targetingFiles.customJS})` + "`" + `);
        });        
        abTestPilotMainInformation.targetMet.customJS = eval(` + "`" + `($` + `{abTestPilotMainInformation.targetMet.customJS})` + "`" + `);
        abTestPilotMainInformation.targetMet.elementChecker = eval(` + "`" + `($` + `{abTestPilotMainInformation.targetMet.elementChecker})` + "`" + `);
        abTestPilotMainInformation.targetMet.urlChecker = eval(` + "`" + `($` + `{abTestPilotMainInformation.targetMet.urlChecker})` + "`" + `);      
        
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

    `);
}