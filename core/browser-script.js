; (() => {
    // Load Socket.IO client
    var script = document.createElement("script")
    script.src = "http://localhost:3000/socket-io-client.js"
    script.onload = initializeABTest
    document.head.appendChild(script)

    function initializeABTest() {
        let config = {
            cssReload: false,
            jsReload: false
        }

        if (!abTestPilot) {
            console.log("No Test is available for this website")
            return;
        }
        const { io } = window
        const socket = io("http://localhost:3000")

        socket.on("connect", () => {
            console.log("Connected to A/B testing server")
            loadTest()
        })

        function loadTest(testId) {
            // if (testId && activeTests[testId]) {
            //     console.log(`Test ${testId} is already active`)
            //     return
            // }

            socket.emit("checkWebsite", { url: window.location.href }, (response) => {
                console.log("Server response: ", response)
            })
        }

        // // socket.on("testData", ({ testId, data, isMultiTouch }) => {
        // socket.on("testData", ({ data }) => {
        //     console.log(`Received initial test data`, data)
        //     data.forEach(test => {
        //         const { testInfo, files, isMultiTouch } = test;

        //         if (isMultiTouch) {
        //             applyMultiTouchTestData(testInfo, files)
        //         } else {
        //             applyTestData(testInfo, files)
        //         }
        //     })
        // })

        // { type: "css", content: css, id: info.id }
        socket.on("update", ({ type, content, id }) => {
            if (abTestPilot && abTestPilot[id] && abTestPilot[id].status == "Active") {
                console.log("Updating test", id)
                if (type === "css") {
                    updateStyle(id, content)
                } else if (type === "js") {
                    updateScript(id, content)
                }
            }
        });

        // function applyTestData(testInfo, data) {
        //     if (data.css && data.css["style.css"]) {
        //         console.log("testInfo", testInfo)
        //         const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
        //         updateStyle("style.css", data.css["style.css"], id)
        //     }

        //     // Object.entries(data.js || {}).forEach(([file, content]) => {
        //     //     updateScript(file, content, testInfo)
        //     // })

        //     if (data.js && data.js["index.js"]) {
        //         const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
        //         updateScript("index.js", data.js["index.js"], id)
        //     }
        // }

        // function applyMultiTouchTestData(testInfo, data) {
        //     console.log("Applying multi-touch test data: ---", data)
        //     Object.entries(data).forEach(([touchPoint, touchPointData]) => {
        //         if (touchPointData.css && touchPointData.css["style.css"]) {
        //             const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + touchPoint.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
        //             updateStyle("style.css", touchPointData.css["style.css"], id, touchPoint)
        //         }

        //         // Object.entries(touchPointData.js || {}).forEach(([file, content]) => {
        //         //     updateScript(file, content, touchPoint)
        //         // })

        //         if (touchPointData.js && touchPointData.js["index.js"]) {
        //             const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + touchPoint.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
        //             updateScript("index.js", touchPointData.js["index.js"], id, touchPoint)
        //         }
        //     })
        // }

        function updateStyle(id, content) {
            const style = document.getElementById(id)
            if (!style) {
                console.log("Trying to update non-existing style", id)
                return;
            }

            if (config.cssReload == true) {
                window.location.reload()
                return
            } else {
                style.textContent = content;
            }

        }

        function updateScript(id, content) {
            const script = document.getElementById(id)
            if (!script) {
                console.log("Trying to update non-existing script", id)
                return;
            } else {
                script.remove()
            }

            if (config.jsReload == true) {
                window.location.reload()
                return
            } else {
                const newScript = document.createElement("script")
                newScript.id = id
                newScript.textContent = content
                document.head.appendChild(newScript)
            }
        }

        // // // Expose a method to load additional tests
        // // window.loadABTest = loadTest
    }
})()