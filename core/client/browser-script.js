; (() => {
    var script = document.createElement("script")
    script.src = "http://localhost:3000/socket-io-client.js"
    script.onload = initializeABTest
    document.head.appendChild(script)
    script.onerror = function () {
        console.log("local server failed to load, trying to load from cdn")
        var script = document.createElement("script")
        script.src = "https://cdn.socket.io/4.5.4/socket.io.min.js"
        script.onload = initializeABTest
        document.head.appendChild(script)
    }

    function initializeABTest() {
        let config = {}

        if (!window.abTestPilotVariaTionInfo) {
            console.log("Either browser script injection is not properly working or no Test is available for this website")
            return;
        }
        const { io } = window
        const socket = io("http://localhost:3000")

        socket.on("connect", () => {
            console.log("Connected to A/B testing server")
        })

        socket.on("config", (browserConfig) => {
            config = browserConfig

        });

        socket.on("ui", (uiJs) => {
            if (config.displayUI === true) {
                const script = document.createElement("script")
                script.textContent = uiJs
                document.head.appendChild(script)
            }
        });


        socket.emit("checkWebsite", { url: window.location.href }, (response) => {
            console.log("Test found for this website")
        })

        socket.on('reload_page', (hostnames) => {
            if (hostnames.some(hostname => window.location.hostname.replace(/\/$/, '').includes(hostname.replace(/\/$/, '')) || window.location.hostname.replace(/\/$/, '') == hostname.replace(/\/$/, ''))) {
                window.location.reload();
            }
        });

        socket.on("update", ({ type, content, id }) => {
            if (abTestPilotVariaTionInfo && abTestPilotVariaTionInfo[id] && abTestPilotVariaTionInfo[id].status == "Active") {
                if (type === "css") {
                    updateStyle(id, content)
                } else if (type === "js") {
                    updateScript(id, content)
                }
            }
        });

        function updateStyle(id, content) {
            const style = document.querySelector(`style#abTestPilot-${id}`)
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
            const script = document.querySelector(`script#abTestPilot-${id}`)
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
                newScript.id = `abTestPilot-${id}`
                newScript.textContent = content
                document.head.appendChild(newScript)
            }
        }
    }
})()