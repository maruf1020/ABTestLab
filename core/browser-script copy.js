; (() => {
    // Load Socket.IO client
    var script = document.createElement("script")
    script.src = "http://localhost:3000/socket-io-client.js"
    script.onload = initializeABTest
    document.head.appendChild(script)

    function initializeABTest() {
        const { io } = window
        const socket = io("http://localhost:3000")
        let isWebsiteMatch = false
        const activeTests = {}
        let config = {}

        socket.on("connect", () => {
            console.log("Connected to A/B testing server")
            socket.emit("getConfig", (serverConfig) => {
                config = serverConfig
                loadTest() // Example: load test with ID 'test1'
            })
        })

        function loadTest(testId) {
            if (testId && activeTests[testId]) {
                console.log(`Test ${testId} is already active`)
                return
            }

            socket.emit("checkWebsite", { url: window.location.href }, (response) => {
                if (response.match) {
                    isWebsiteMatch = true
                    // console.log(`Loading test ${testId} for ${response.websiteName}`)
                    console.log(`Loading test for ${response.testInfo.map(test => "test " + test.test + " - " + test.variation).join(", ")}`)
                    // activeTests[testId] = { js: null }
                    response.testInfo.forEach(test => {
                        const id = `ab-test-pilot-${test.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + test.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + test.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
                        activeTests[id] = { js: null }
                    })
                    // socket.emit("requestTestData", testId)
                    socket.emit("requestTestData", response.testInfo)
                } else {
                    console.log(`No test found for this website`)
                }
            })
        }

        // socket.on("testData", ({ testId, data, isMultiTouch }) => {
        socket.on("testData", ({ data }) => {
            console.log(`Received initial test data`, data)
            data.forEach(test => {
                const { testInfo, files, isMultiTouch } = test;

                if (isMultiTouch) {
                    applyMultiTouchTestData(testInfo, files)
                } else {
                    applyTestData(testInfo, files)
                }
            })
        })

        socket.on("update", ({ type, path, content, touchPoint, hostnames, testInfo }) => {
            console.log("Received update", type, path, content, touchPoint, hostnames, testInfo)
            // remove last slash from path
            if (!hostnames || hostnames.length <= 0 || !hostnames.some(hostname => window.location.href.replace(/\/$/, "").endsWith(hostname.replace(/\/$/, "")))) return;
            const { website, test, touchPoint: infoTouchPoint, variation } = testInfo;
            const id = infoTouchPoint ? `ab-test-pilot-${website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + touchPoint.replace(/[^a-zA-Z0-9]/g, '_') + "_" + variation.replace(/[^a-zA-Z0-9]/g, '_')}` : `ab-test-pilot-${website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + variation.replace(/[^a-zA-Z0-9]/g, '_')}`
            if (type === "css") {
                updateStyle(path, content, id, touchPoint)
            } else if (type === "js") {
                updateScript(path, content, id, touchPoint)
            }
        });

        function applyTestData(testInfo, data) {
            if (data.css && data.css["style.css"]) {
                console.log("testInfo", testInfo)
                const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
                updateStyle("style.css", data.css["style.css"], id)
            }

            // Object.entries(data.js || {}).forEach(([file, content]) => {
            //     updateScript(file, content, testInfo)
            // })

            if (data.js && data.js["index.js"]) {
                const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
                updateScript("index.js", data.js["index.js"], id)
            }
        }

        function applyMultiTouchTestData(testInfo, data) {
            console.log("Applying multi-touch test data: ---", data)
            Object.entries(data).forEach(([touchPoint, touchPointData]) => {
                if (touchPointData.css && touchPointData.css["style.css"]) {
                    const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + touchPoint.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
                    updateStyle("style.css", touchPointData.css["style.css"], id, touchPoint)
                }

                // Object.entries(touchPointData.js || {}).forEach(([file, content]) => {
                //     updateScript(file, content, touchPoint)
                // })

                if (touchPointData.js && touchPointData.js["index.js"]) {
                    const id = `ab-test-pilot-${testInfo.website.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.test.replace(/[^a-zA-Z0-9]/g, '_') + "_" + touchPoint.replace(/[^a-zA-Z0-9]/g, '_') + "_" + testInfo.variation.replace(/[^a-zA-Z0-9]/g, '_')}`
                    updateScript("index.js", touchPointData.js["index.js"], id, touchPoint)
                }
            })
        }

        function updateStyle(file, content, id, touchPoint = null) {
            let style = document.getElementById(id)
            if (!style) {
                style = document.createElement("style")
                style.id = id
                document.head.appendChild(style)
            } else {
                if (config.cssReload == true) {
                    window.location.reload()
                    return
                }
            }
            style.textContent = content;
        }

        function updateScript(file, content, id, touchPoint = null) {
            const existingScript = document.querySelector(`script[data-ab-test-file="${id}"]`)
            if (existingScript) {
                if (config.jsReload == true) {
                    window.location.reload()
                    return
                } else {
                    existingScript.remove()
                }
            }

            const script = document.createElement("script")
            script.setAttribute("data-ab-test-file", id)
            script.textContent = `
              (function() {
                  ${content}
              })();
          `
            document.body.appendChild(script)
        }

        // // Expose a method to load additional tests
        // window.loadABTest = loadTest
    }
})()