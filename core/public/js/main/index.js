import testInfo from './info.json' assert { type: 'json' };

(() => {
    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    function renderBlock(value) {
        return `<div class="ab-Test-Pilot-test-details__container ${value.status ? value.status : ""}" data-id="${value.id}">
            <div class="ab-Test-Pilot-test-details__header">
                ${value.touchPointName ? `<h2 class="ab-Test-Pilot-test-details__title">${value.touchPointName}</h2>` : `<h2 class="ab-Test-Pilot-test-details__title">${value.testName} (${value.variationName})</h2>`}
            </div>
            <div class="ab-Test-Pilot-test-details__content">
                <div class="ab-Test-Pilot-test-details__content-details">
                    <div class="ab-Test-Pilot-test-details__content-details-main">
                        <p class="ab-Test-Pilot-test-details__name">name: ${value.testName}</p>
                        <p class="ab-Test-Pilot-test-details__type">type: ${value.testType}</p>
                        <p class="ab-Test-Pilot-test-details__status">status: ${value.status}</p>
                        ${value.touchPointName ? `<p class="ab-Test-Pilot-test-details__touch-point">touch point: ${value.touchPointName}</p>` : ''}
                        <p class="ab-Test-Pilot-test-details__variation">variation: ${value.variationName}</p>
                        <p class="ab-Test-Pilot-test-details__message">message: ${value.message}</p> 
                    </div>
                    <div class="ab-Test-Pilot-test-details__content-details-targeting">
                        ${value?.targetingDetails ? `
                        <p class="ab-Test-Pilot-test-details__targeting"><b>targeting:</b> ${Object.entries(value?.targetingDetails).map(([key, value]) => `
                        <p class="ab-Test-Pilot-test-details__targeting-type"><b>type: ${value.type}</b></p>
                        <p class="ab-Test-Pilot-test-details__targeting-status">status: ${value.status}</p>
                            <ul class="ab-Test-Pilot-test-details__targeting-messages">${value.messages.map((message, i) => `<li class="ab-Test-Pilot-test-details__targeting-message"> ${i + 1} ${message}</li>`).join('')}</ul>
                        </p>`).join('')}</p>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div >`
    }

    function renderBlocks(data) {
        const { isParentTargeting, parentTargetingInfo, tests } = data;
        if (isParentTargeting) {
            return `<div class="ab-Test-Pilot-test-details__container" data-id="${parentTargetingInfo.id}">
                        <div class="ab-Test-Pilot-test-details__header">
                        <h2 class="ab-Test-Pilot-test-details__title">${tests[0]?.testName} (${tests[0].variationName})</h2>
                    </div>
                    <div class="ab-Test-Pilot-test-details__content">
                        ${tests.map((value) => renderBlock(value)).join('')}
                    </div>
                </div >`
        } else {
            return tests.map((value) => renderBlock(value)).join('');
        }
    }


    function mainJs(testInformation) {

        if (document.querySelector('.ab-Test-Pilot-test-details')) {
            document.querySelector('.ab-Test-Pilot-test-details').remove();
        }

        let testDetails = document.createElement('div');
        testDetails.classList.add('ab-Test-Pilot-test-details');

        testDetails.innerHTML = `
        <!-- Header for AB Test Pilot -->
        <div class="ab-test-header">
            <h2 class="ab-test-title">AB Test Pilot</h2>
            <div class="ab-test-controls">
                <!-- Minimize/Maximize Button -->
                <svg class="control-btn minimize-btn" width="16" height="16" viewBox="0 0 16 16">
                    <rect x="2" y="8" width="12" height="2" fill="#555"></rect>
                </svg>
                
                <!-- Full Screen/Small Screen Button -->
                <svg class="control-btn fullscreen-btn" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M1,1 L6,1 L6,3 L3,3 L3,6 L1,6 L1,1 Z M10,1 L15,1 L15,6 L13,6 L13,3 L10,3 L10,1 Z M1,10 L3,10 L3,13 L6,13 L6,15 L1,15 L1,10 Z M13,10 L15,10 L15,15 L10,15 L10,13 L13,13 L13,10 Z" fill="#555"></path>
                </svg>
                
                <!-- Close Button -->
                <svg class="control-btn close-btn" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M3.5,3.5 L12.5,12.5 M3.5,12.5 L12.5,3.5" stroke="#555" stroke-width="2" fill="none"></path>
                </svg>
            </div>
        </div>
        <!-- Test details content -->
        ${Object.entries(testInformation).map(([key, value]) => {
            const { parentTargetingInfo, tests } = value;
            return renderBlocks({ isParentTargeting: parentTargetingInfo ? true : false, parentTargetingInfo, "tests": parentTargetingInfo ? tests : [value] });
        }
        ).join('')}`

        document.body.appendChild(testDetails);

        console.log("selector body found and here is the element", testInformation);
        console.table({ "ID": testInfo.id, "Variaiton Name": testInfo.name });

    }

    setTimeout(() => {
        waitForElem('abTestPilot', mainJs, 1, true);
    }, 500);
})()