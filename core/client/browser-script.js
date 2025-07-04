(() => {
  let config = {};

  window.abTestPilotVariaTionInfo = window.abTestPilotVariaTionInfo || {};
  window.abTestPilotPortNumber = window.abTestPilotPortNumber || 3007;

  if (
    Object.keys(window.abTestPilotVariaTionInfo).length < 0 ||
    !window.abTestPilotPortNumber
  ) {
    console.log(
      "Either browser script injection is not properly working or no Test is available for this website"
    );
    return;
  }

  // Create WebSocket connection
  const ws = window.createWebSocket
    ? window.createWebSocket()
    : new WebSocket(`ws://localhost:${window.abTestPilotPortNumber}`);

  ws.onopen = () => {
    console.log(
      "%cConnected to A/B testing server",
      "color:green; font-size:13px; margin:2px 0"
    );

    // Check website after connection is established
    ws.send(
      JSON.stringify({
        type: "checkWebsite",
        data: { url: window.location.href },
      })
    );
  };

  ws.onclose = () => {
    console.log(
      "%cDisconnected from A/B testing server",
      "color:red; font-size:13px; margin:3px 0"
    );
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "config":
          config = message.data;
          break;

        case "ui":
          const script = document.createElement("script");
          script.textContent = message.data;
          document.head.appendChild(script);
          break;

        case "checkWebsiteResponse":
          console.log("Test found for this website");
          break;

        case "reload_page":
          const hostnames = message.data;
          if (
            hostnames.some(
              (hostname) =>
                window.location.hostname
                  .replace(/\/$/, "")
                  .includes(hostname.replace(/\/$/, "")) ||
                window.location.hostname.replace(/\/$/, "") ==
                  hostname.replace(/\/$/, "") ||
                window.location.origin
                  .replace(/\/$/, "")
                  .includes(hostname.replace(/\/$/, "")) ||
                window.location.origin.replace(/\/$/, "") ==
                  hostname.replace(/\/$/, "")
            )
          ) {
            window.location.reload(true);
          }
          break;

        case "update":
          const { type, content, id } = message.data;
          if (
            abTestPilotVariaTionInfo &&
            abTestPilotVariaTionInfo[id] &&
            abTestPilotVariaTionInfo[id].status == "Active"
          ) {
            if (type === "css") {
              updateStyle(id, content);
            } else if (type === "js") {
              updateScript(id, content);
            }
          }
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  function updateStyle(id, content) {
    const style = document.querySelector(`style#abTestPilot-${id}`);
    if (!style) {
      console.log("Trying to update non-existing style", id);
      return;
    }

    if (config.cssReload == true) {
      window.location.reload();
      return;
    } else {
      style.textContent = content;
    }
  }

  function updateScript(id, content) {
    const script = document.querySelector(`script#abTestPilot-${id}`);
    if (!script) {
      console.log("Trying to update non-existing script", id);
      return;
    } else {
      script.remove();
    }

    if (config.jsReload == true) {
      window.location.reload();
      return;
    } else {
      const newScript = document.createElement("script");
      newScript.id = `abTestPilot-${id}`;
      newScript.textContent = content;
      document.head.appendChild(newScript);
    }
  }
})();
