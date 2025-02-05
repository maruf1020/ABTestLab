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

        function loadTest(testId) {
            if (activeTests[testId]) {
                console.log(`Test ${testId} is already active`)
                return
            }

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
        }

        socket.on("connect", () => {
            console.log("Connected to A/B testing server")
            // You can add logic here to determine which tests to load
            loadTest("test1") // Example: load test with ID 'test1'
        })

        socket.on("testData", ({ testId, data }) => {
            console.log(`Received initial test data for ${testId}`)
            applyTestData(testId, data)
        })

        socket.on("fileChanged", (data) => {
            console.log(`File changed: ${data.type} - ${data.path}`)
            if (data.type === "css") {
                updateStyle(data.testId, data.path, data.content)
            } else if (data.type === "js") {
                updateScript(data.testId, data.path, data.content)
            }
        })

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

