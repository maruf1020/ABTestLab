; (() => {
    // Load Socket.IO client
    var script = document.createElement("script")
    script.src = "http://localhost:3000/socket-io-client.js"
    script.onload = initializeABTest
    document.head.appendChild(script)

    function initializeABTest() {
        const { io } = window
        const socket = io("http://localhost:3000");
        let isWebsiteMatch = false;
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
                    isWebsiteMatch = true;
                    console.log(`Loading test ${testId} for ${response.websiteName}`)
                    activeTests[testId] = { js: null }
                    socket.emit("requestTestData", testId)
                } else {
                    console.log(`Test ${testId} is not applicable for this website`)
                }
            })
        }

        socket.on("testData", ({ testId, data }) => {
            console.log(`Received initial test data for ${testId}`)
            applyTestData(testId, data)
        })

        socket.on("update", (data) => {
            if (!isWebsiteMatch) return;
            console.log(`Update received:`, data)
            if (data.type === "css") {
                updateStyle(data.path, data.content)
            } else if (data.type === "js") {
                updateScript(data.path, data.content)
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

        function updateStyle(file, content) {
            let style = document.getElementById(`ab-test-style-${file}`)
            if (!style) {
                style = document.createElement("style")
                style.id = `ab-test-style-${file}`
                document.head.appendChild(style)
            } else {
                if (config.cssReload == true) {
                    window.location.reload()
                    return;
                }
            }
            style.textContent = content
        }

        function updateScript(file, content) {
            console.log(`Updating script: ${file}-----${Object.entries(config)}`)
            const existingScript = document.querySelector(`script[data-ab-test-file="${file}"]`)
            if (existingScript) {
                if (config.jsReload == true) {
                    window.location.reload()
                    return;
                } else {
                    existingScript.remove()
                }
            }

            const script = document.createElement("script")
            script.setAttribute("data-ab-test-file", file)
            script.textContent = `
              (function() {
                  ${content}
              })();
          `
            document.body.appendChild(script)

        }

        // Expose a method to load additional tests
        window.loadABTest = loadTest
    }
})()

