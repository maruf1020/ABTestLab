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
                loadTest("test1") // Example: load test with ID 'test1'
            })
        })

        function loadTest(testId) {
            if (activeTests[testId]) {
                console.log(`Test ${testId} is already active`)
                return
            }

            socket.emit("checkWebsite", { testId, url: window.location.href }, (response) => {
                if (response.match) {
                    isWebsiteMatch = true
                    console.log(`Loading test ${testId} for ${response.websiteName}`)
                    activeTests[testId] = { js: null }
                    socket.emit("requestTestData", testId)
                } else {
                    console.log(`Test ${testId} is not applicable for this website`)
                }
            })
        }

        socket.on("testData", ({ testId, data, isMultiTouch }) => {
            console.log(`Received initial test data for ${testId}:`, data)
            if (isMultiTouch) {
                applyMultiTouchTestData(testId, data)
            } else {
                applyTestData(testId, data)
            }
        })

        socket.on("update", (data) => {
            if (!isWebsiteMatch) return
            console.log(`Update received:`, data)
            if (data.type === "css") {
                updateStyle(data.path, data.content, data.touchpoint)
            } else if (data.type === "js") {
                updateScript(data.path, data.content, data.touchpoint)
            }
        })

        function applyTestData(testId, data) {
            if (data.css && data.css["style.css"]) {
                updateStyle("style.css", data.css["style.css"])
            }

            Object.entries(data.js || {}).forEach(([file, content]) => {
                updateScript(file, content)
            })
        }

        function applyMultiTouchTestData(testId, data) {
            console.log("Applying multi-touch test data:", data)
            Object.entries(data).forEach(([touchpoint, touchpointData]) => {
                if (touchpointData.css && touchpointData.css["style.css"]) {
                    updateStyle("style.css", touchpointData.css["style.css"], touchpoint)
                }

                Object.entries(touchpointData.js || {}).forEach(([file, content]) => {
                    updateScript(file, content, touchpoint)
                })
            })
        }

        function updateStyle(file, content, touchpoint = null) {
            const id = touchpoint ? `ab-test-style-${touchpoint}-${file}` : `ab-test-style-${file}`
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
            style.textContent = content
            console.log(`Updated style for ${touchpoint ? `touchpoint ${touchpoint}` : "test"}:`, content)
        }

        function updateScript(file, content, touchpoint = null) {
            const id = touchpoint ? `ab-test-script-${touchpoint}-${file}` : `ab-test-script-${file}`
            console.log(`Updating script: ${file} for ${touchpoint ? `touchpoint ${touchpoint}` : "test"}`)
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
            console.log(`Updated script for ${touchpoint ? `touchpoint ${touchpoint}` : "test"}:`, content)
        }

        // Expose a method to load additional tests
        window.loadABTest = loadTest
    }
})()