; (() => {
    // Load Socket.IO client
    const script = document.createElement("script")
    script.src = "https://cdn.socket.io/4.5.4/socket.io.min.js"
    script.onload = initializeABTest
    document.head.appendChild(script)

    function initializeABTest() {
        const { io } = window
        const socket = io("http://localhost:3000")
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
                    console.log(`Loading test ${testId} for ${response.websiteName}`)
                    const cssLink = document.createElement("link")
                    cssLink.rel = "stylesheet"
                    cssLink.href = `http://localhost:3000/${testId}/css`
                    cssLink.id = `ab-test-css-${testId}`
                    document.head.appendChild(cssLink)

                    const jsScript = document.createElement("script")
                    jsScript.src = `http://localhost:3000/${testId}/js`
                    jsScript.id = `ab-test-js-${testId}`
                    document.body.appendChild(jsScript)

                    activeTests[testId] = { css: cssLink, js: jsScript }
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

        socket.on("hmr", (data) => {
            console.log(`HMR update received: ${data.type} - ${data.path}`)
            if (data.type === "css") {
                updateStyle(data.path, data.content)
            } else if (data.type === "js") {
                updateScript(data.path, data.content)
            }
        })

        function applyTestData(testId, data) {
            if (data.css["style.css"]) {
                updateStyle("style.css", data.css["style.css"])
            }

            Object.entries(data.js).forEach(([file, content]) => {
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
                if (config.cssReload === true) {
                    window.location.reload()
                    return;
                }
            }
            style.textContent = content
        }

        function updateScript(file, content) {
            const existingScript = document.querySelector(`script[data-ab-test-file="${file}"]`)
            if (existingScript) {
                if (config.jsReload === true) {
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

