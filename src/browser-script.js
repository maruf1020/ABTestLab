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
        const injectedElements = new Set()

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

        socket.on("fileChanged", (data) => {
            console.log(`File changed: ${data.type} - ${data.path}`)
            if (data.type === "css") {
                updateStyle(data.testId, data.path, data.content)
                if (config.cssReload) {
                    location.reload()
                }
            } else if (data.type === "js") {
                updateScript(data.testId, data.path, data.content)
                handleJsReload(data.content)
            }
        })

        function handleJsReload(content) {
            switch (config.jsReload) {
                case "smart":
                    if (checkForDuplicateInjections(content)) {
                        location.reload()
                    }
                    break
                case true:
                    location.reload()
                    break
                case false:
                    // Do nothing, don't reload
                    break
            }
        }

        function checkForDuplicateInjections(content) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(content, "text/html")
            const newElements = doc.body.children

            for (const element of newElements) {
                const selector = getUniqueSelector(element)
                if (injectedElements.has(selector)) {
                    return true // Duplicate found
                }
                injectedElements.add(selector)
            }

            return false // No duplicates found
        }

        function getUniqueSelector(element) {
            if (element.id) {
                return `#${element.id}`
            }
            if (element.className) {
                return `.${element.className.split(" ").join(".")}`
            }
            return element.tagName.toLowerCase()
        }

        function applyTestData(testId, data) {
            if (data.css["style.css"]) {
                updateStyle(testId, "style.css", data.css["style.css"])
            }

            Object.entries(data.js).forEach(([file, content]) => {
                updateScript(testId, file, content)
            })
        }

        function updateStyle(testId, file, content) {
            let style = document.getElementById(`ab-test-style-${testId}`)
            if (!style) {
                style = document.createElement("style")
                style.id = `ab-test-style-${testId}`
                document.head.appendChild(style)
            }
            style.textContent = content

            // Remove the link tag if it exists
            const linkTag = document.getElementById(`ab-test-css-${testId}`)
            if (linkTag) {
                linkTag.remove()
            }
        }

        function updateScript(testId, file, content) {
            let script = document.getElementById(`ab-test-script-${testId}`)
            if (script) {
                script.remove()
            }
            script = document.createElement("script")
            script.id = `ab-test-script-${testId}`
            script.textContent = content
            document.body.appendChild(script)
        }

        // Expose a method to load additional tests
        window.loadABTest = loadTest
    }
})()

