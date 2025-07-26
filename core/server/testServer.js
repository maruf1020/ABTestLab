import chokidar from "chokidar";
import debug from "debug";
import fs from "fs-extra";
import http from "http";
import kleur from "kleur";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import { ROOT_DIR } from "../global/config.js";

import {
  bundleTargeting,
  bundleVariation,
  getBundlerData,
} from "../utils/bundler.js";
import browserScriptCreator from "./browserScriptCreator.js";
import { listTests, listWebsites, getTestInfo, listTouchPointsAndVariations, listVariations } from "../utils/fileUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = debug("ab-testing-cli:testServer");

// Store connected clients
const clients = new Set();

// Helper function to broadcast to all connected clients
function broadcastToClients(message) {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      // OPEN
      client.send(message);
    }
  });
}

async function getAllTestList() {
  const websites = await listWebsites();
  const allTests = [];

  for (const website of websites) {
    const tests = await listTests(website);
    for (const test of tests) {
      // Read test info using getTestInfo function
      let testInfo = {};
      try {
        testInfo = await getTestInfo(website, test);
      } catch (e) {
        continue;
      }
      let details = [];
      if (testInfo.type === "Multi-touch") {
        // Show touch points and their variations
        details = await listTouchPointsAndVariations(website, test);
      } else {
        // Show only variations
        details = await listVariations(website, test);
      }
      allTests.push({
        website,
        test,
        type: testInfo.type,
        details,
      });
    }
  }
  return allTests;
}

export async function startTestServer(selectedVariations) {
  const testInfo = await Promise.all(
    selectedVariations.map(async (selectedVariation) => {
      if (selectedVariation.testType === "Multi-touch") {
        const touchPointsDir = await getTouchPointsInfo(selectedVariation);
        return touchPointsDir;
      } else {
        const variationDir = await getVariationInfo(selectedVariation);
        return variationDir;
      }
    })
  ).then((results) => results.flat());

  const transformedTestInfo = await transformTestInfo(testInfo);

  await browserScriptCreator(transformedTestInfo);

  const server = http.createServer(async (req, res) => {
    if (req.url === "/ab-pilot-script.js") {
      const scriptPath = path.join(
        __dirname,
        "..",
        "client",
        "browser-runner.js"
      );
      const content = await fs.readFile(scriptPath, "utf-8");
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(content);
    } else if (req.url === "/ab-test-script.js") {
      const scriptPath = path.join(
        __dirname,
        "..",
        "client",
        "browser-script.js"
      );
      const content = await fs.readFile(scriptPath, "utf-8");
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(content);
    } else if (req.url === "/dashboard") {
      res.writeHead(200, { "Content-Type": "text/html" });

      // Group tests by website
      const allTests = await getAllTestList();
      const grouped = {};
      allTests.forEach(testObj => {
        if (!grouped[testObj.website]) grouped[testObj.website] = [];
        grouped[testObj.website].push(testObj);
      });

      // Generate HTML with improved styling and JSON view
      let html = `<!DOCTYPE html>
<html>
<head>
    <title>All Tests</title>
    <!-- CodeMirror CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: #0d9488;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2em;
        }
        .view-toggle {
            margin: 20px;
            text-align: center;
        }
        .toggle-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            margin: 0 5px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .toggle-btn:hover {
            background: #764ba2;
        }
        .toggle-btn.active {
            background: #4CAF50;
        }
        .content {
            padding: 20px;
        }
        .tree-view {
            display: block;
        }
        .json-view {
            display: none;
        }
        .website-group {
            margin-bottom: 25px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        .website-header {
            background: #f8f9fa;
            padding: 15px;
            font-weight: bold;
            font-size: 1.2em;
            color: #495057;
            border-bottom: 1px solid #e0e0e0;
        }
        .test-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .test-item {
            border-bottom: 1px solid #f0f0f0;
            padding: 15px;
            transition: background 0.2s;
        }
        .test-item:hover {
            background: #f8f9fa;
        }
        .test-item:last-child {
            border-bottom: none;
        }
        .test-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        .test-type {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.85em;
            margin-left: 8px;
        }
        .test-details {
            margin-top: 10px;
        }
        .detail-section {
            margin-bottom: 12px;
        }
        .detail-title {
            font-weight: 500;
            color: #555;
            margin-bottom: 5px;
        }
        .detail-list {
            list-style: none;
            margin: 0;
            padding-left: 20px;
        }
        .detail-item {
            padding: 3px 0;
            color: #666;
            position: relative;
        }
        .detail-item:before {
            content: "-";
            position: absolute;
            left: -15px;
            color: #999;
        }
        .touchpoint-item:before {
            color: #ff9800;
        }
        .variation-item:before {
            color: #4caf50;
        }
        .json-container {
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .CodeMirror {
            height: 70vh;
            font-size: 20px;
        }
        .json-info {
            background: #f8f9fa;
            padding: 10px 15px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        .editor-option {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .editor-option label {
            font-weight: 500;
            white-space: nowrap;
        }
        .editor-option select,
        .editor-option input {
            padding: 4px 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
        }
        .toggle-option {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }
        .toggle-option input[type="checkbox"] {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>A/B Test Pilot Dashboard</h1>
        </div>
        
        <div class="view-toggle">
            <button class="toggle-btn active" onclick="toggleView('tree')">Tree View</button>
            <button class="toggle-btn" onclick="toggleView('json')">JSON View</button>
        </div>
        
        <div class="content">
            <div id="tree-view" class="tree-view">`;

      Object.entries(grouped).forEach(([website, tests]) => {
        html += `
                <div class="website-group">
                    <div class="website-header">Website: ${website}</div>
                    <ul class="test-list">`;

        tests.forEach(testObj => {
          html += `
                        <li class="test-item">
                            <div class="test-name">
                                ${testObj.test}
                                <span class="test-type">${testObj.type}</span>
                            </div>
                            <div class="test-details">`;

          if (testObj.type === "Multi-touch" && Array.isArray(testObj.details) && testObj.details.length > 0) {
            const touchPoints = testObj.details.filter(item => item.type === "touchPoint");
            const variations = testObj.details.filter(item => item.type === "variation");

            if (touchPoints.length > 0) {
              html += `
                                <div class="detail-section">
                                    <div class="detail-title">Touch Points</div>
                                    <ul class="detail-list">`;
              touchPoints.forEach(tp => {
                html += `<li class="detail-item touchpoint-item">${tp.name}</li>`;
              });
              html += `</ul></div>`;
            }

            if (variations.length > 0) {
              html += `
                                <div class="detail-section">
                                    <div class="detail-title">Variations</div>
                                    <ul class="detail-list">`;
              variations.forEach(variation => {
                html += `<li class="detail-item variation-item">${variation.name}</li>`;
              });
              html += `</ul></div>`;
            }
          } else if (Array.isArray(testObj.details)) {
            html += `
                                <div class="detail-section">
                                    <div class="detail-title">Variations</div>
                                    <ul class="detail-list">`;
            testObj.details.forEach(variation => {
              html += `<li class="detail-item variation-item">${variation}</li>`;
            });
            html += `</ul></div>`;
          }

          html += `</div></li>`;
        });

        html += `</ul></div>`;
      });

      html += `
            </div>
            
            <div id="json-view" class="json-view">
                <div class="json-container">
                    <div class="json-info">
                        <div class="editor-option">
                            <label>JSON Data</label>
                        </div>
                        
                        <div class="editor-option">
                            <label for="theme-selector">Theme:</label>
                            <select id="theme-selector" onchange="changeTheme()">
                                <option value="material">Material</option>
                                <option value="monokai">Monokai</option>
                                <option value="dracula">Dracula</option>
                                <option value="3024-night">3024 Night</option>
                                <option value="ambiance">Ambiance</option>
                                <option value="blackboard">Blackboard</option>
                                <option value="cobalt">Cobalt</option>
                                <option value="lesser-dark">Lesser Dark</option>
                                <option value="midnight">Midnight</option>
                                <option value="solarized">Solarized Dark</option>
                                <option value="eclipse">Eclipse</option>
                                <option value="elegant">Elegant</option>
                                <option value="neat">Neat</option>
                                <option value="default">Default</option>
                            </select>
                        </div>
                        
                        <div class="editor-option">
                            <label for="tab-size">Tab Size:</label>
                            <select id="tab-size" onchange="changeTabSize()">
                                <option value="2" selected>2</option>
                                <option value="4">4</option>
                                <option value="8">8</option>
                            </select>
                        </div>
                        
                        <div class="editor-option">
                            <label for="font-size">Font Size:</label>
                            <select id="font-size" onchange="changeFontSize()">
                                <option value="8">8px</option>
                                <option value="10">10px</option>
                                <option value="12">12px</option>
                                <option value="14">14px</option>
                                <option value="16">16px</option>
                                <option value="18">18px</option>
                                <option value="18">18px</option>
                                <option value="20" selected>20px</option>
                                <option value="22">22px</option>
                                <option value="24">24px</option>
                                <option value="26">26px</option>
                                <option value="28">28px</option>
                                <option value="30">30px</option>
                                </select>
                        </div>
                        
                        <div class="toggle-option">
                            <input type="checkbox" id="line-wrap" onchange="toggleLineWrap()" checked>
                            <label for="line-wrap">Line Wrap</label>
                        </div>
                        
                        <div class="toggle-option">
                            <input type="checkbox" id="line-numbers" onchange="toggleLineNumbers()" checked>
                            <label for="line-numbers">Line Numbers</label>
                        </div>
                        
                        <div class="toggle-option">
                            <input type="checkbox" id="folding" onchange="toggleFolding()" checked>
                            <label for="folding">Code Folding</label>
                        </div>
                        
                        <div class="toggle-option">
                            <input type="checkbox" id="highlight-active" onchange="toggleHighlightActive()" checked>
                            <label for="highlight-active">Highlight Active Line</label>
                        </div>
                    </div>
                    <textarea id="json-editor"></textarea>
                </div>
            </div>
        </div>
    </div>

    <!-- CodeMirror Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"></script>
    
    <!-- CodeMirror Themes -->
    <script>
        // Dynamically load theme CSS
        function loadThemeCSS(theme) {
            const existingLink = document.getElementById('codemirror-theme');
            if (existingLink) {
                existingLink.remove();
            }
            
            if (theme !== 'default') {
                const link = document.createElement('link');
                link.id = 'codemirror-theme';
                link.rel = 'stylesheet';
                link.href = \`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/\${theme}.min.css\`;
                document.head.appendChild(link);
            }
        }
    </script>

    <script>
        const testData = ${JSON.stringify(allTests, null, 2)};
        let jsonEditor;
        
        function toggleView(view) {
            const treeView = document.getElementById('tree-view');
            const jsonView = document.getElementById('json-view');
            const buttons = document.querySelectorAll('.toggle-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            
            if (view === 'tree') {
                treeView.style.display = 'block';
                jsonView.style.display = 'none';
                buttons[0].classList.add('active');
            } else {
                treeView.style.display = 'none';
                jsonView.style.display = 'block';
                buttons[1].classList.add('active');
                initJSONEditor();
            }
        }
        
        function initJSONEditor() {
            if (!jsonEditor) {
                jsonEditor = CodeMirror.fromTextArea(document.getElementById('json-editor'), {
                    lineNumbers: true,
                    mode: 'application/json',
                    theme: 'material',
                    readOnly: false,
                    lineWrapping: true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    indentUnit: 2,
                    tabSize: 2,
                    styleActiveLine: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
                });
                
                jsonEditor.setValue(JSON.stringify(testData, null, 2));
            }
        }
        
        function changeTheme() {
            const themeSelector = document.getElementById('theme-selector');
            const selectedTheme = themeSelector.value;
            
            if (jsonEditor) {
                loadThemeCSS(selectedTheme);
                setTimeout(() => {
                    jsonEditor.setOption('theme', selectedTheme);
                }, 100);
            }
        }
        
        function changeTabSize() {
            const tabSize = parseInt(document.getElementById('tab-size').value);
            if (jsonEditor) {
                jsonEditor.setOption('tabSize', tabSize);
                jsonEditor.setOption('indentUnit', tabSize);
                // Reformat JSON with new tab size
                const currentValue = JSON.parse(jsonEditor.getValue());
                jsonEditor.setValue(JSON.stringify(currentValue, null, tabSize));
            }
        }
        
        function changeFontSize() {
            const fontSize = document.getElementById('font-size').value + 'px';
            if (jsonEditor) {
                const editorElement = jsonEditor.getWrapperElement();
                editorElement.style.fontSize = fontSize;
                jsonEditor.refresh();
            }
        }
        
        function toggleLineWrap() {
            const lineWrap = document.getElementById('line-wrap').checked;
            if (jsonEditor) {
                jsonEditor.setOption('lineWrapping', lineWrap);
            }
        }
        
        function toggleLineNumbers() {
            const lineNumbers = document.getElementById('line-numbers').checked;
            if (jsonEditor) {
                jsonEditor.setOption('lineNumbers', lineNumbers);
                // Update gutters based on line numbers and folding
                updateGutters();
            }
        }
        
        function toggleFolding() {
            const folding = document.getElementById('folding').checked;
            if (jsonEditor) {
                jsonEditor.setOption('foldGutter', folding);
                // Update gutters based on line numbers and folding
                updateGutters();
            }
        }
        
        function toggleHighlightActive() {
            const highlight = document.getElementById('highlight-active').checked;
            if (jsonEditor) {
                jsonEditor.setOption('styleActiveLine', highlight);
            }
        }
        
        function updateGutters() {
            const lineNumbers = document.getElementById('line-numbers').checked;
            const folding = document.getElementById('folding').checked;
            const gutters = [];
            
            if (lineNumbers) gutters.push("CodeMirror-linenumbers");
            if (folding) gutters.push("CodeMirror-foldgutter");
            
            if (jsonEditor) {
                jsonEditor.setOption('gutters', gutters);
            }
        }
        
        // Initialize with material theme
        loadThemeCSS('material');
    </script>
</body>
</html>`;

      res.end(html);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  const wss = new WebSocketServer({ server });

  const watchPaths = transformedTestInfo.testInfo
    .flatMap((test) => [
      test.variationDir,
      test.targetingDir,
      test.parentTargetingDir,
    ])
    .filter(Boolean);

  const watcher = chokidar.watch(watchPaths, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher
    .on("change", async (filePath) => {
      log(`File ${filePath} has been changed`);
      if (!filePath.includes("compiled") && !filePath.includes("targeting")) {
        if (filePath.includes("style.scss")) {
          await bundleVariation(path.dirname(filePath), "scss");
          console.log(kleur.gray(`🎨 SCSS File has been updated`));
        } else if (filePath.includes("index.js")) {
          await bundleVariation(path.dirname(filePath), "js");
          console.log(kleur.gray(`📦 JS File has been updated`));
        }
      } else if (
        !filePath.includes("compiled") &&
        filePath.includes("targeting")
      ) {
        const initialInfo =
          transformedTestInfo.testInfo.find(
            (test) => test.targetingDir === path.dirname(filePath)
          ) ||
          transformedTestInfo.parentTargeting.find(
            (test) => test.parentTargetingDir === path.dirname(filePath)
          );
        const infoList = transformedTestInfo.testInfo.filter(
          (test) => test.targetingDir === path.dirname(filePath)
        );
        await Promise.all(
          infoList.map(async (info) => {
            if (info) {
              transformedTestInfo.testInfo.find(
                (test) => test.id === info.id
              ).targetingFiles = await getTargetingFiles(info.targetingDir);
              await browserScriptCreator(transformedTestInfo);
            }
          })
        );
        const infoListParent = transformedTestInfo.parentTargeting.filter(
          (test) => test.parentTargetingDir === path.dirname(filePath)
        );
        await Promise.all(
          infoListParent.map(async (info) => {
            if (info) {
              transformedTestInfo.parentTargeting.find(
                (test) => test.parentTargetingId === info.parentTargetingId
              ).targetingFiles = await getTargetingFiles(
                info.parentTargetingDir
              );
              await browserScriptCreator(transformedTestInfo);
            }
          })
        );
        if (infoList.length > 0 || infoListParent.length > 0) {
          broadcastToClients(
            JSON.stringify({
              type: "reload_page",
              data: initialInfo.hostnames,
            })
          );
          console.log(kleur.gray(`🎯 Targeting files have been updated`));
        }
      } else if (
        filePath.includes("compiled") &&
        !filePath.includes("targeting")
      ) {
        const info = transformedTestInfo.testInfo.find(
          (test) => test.compiledDir === path.dirname(filePath)
        );
        if (info) {
          try {
            const config = await fs.readJson(
              path.join(process.cwd(), "settings.json")
            );
            if (path.extname(filePath) === ".css") {
              const cssFile = path.join(path.dirname(filePath), "style.css");
              const css = await fs.readFile(cssFile, "utf-8");
              if (config.cssReload == true) {
                broadcastToClients(
                  JSON.stringify({
                    type: "reload_page",
                    data: info.hostnames,
                  })
                );
              } else {
                broadcastToClients(
                  JSON.stringify({
                    type: "update",
                    data: { type: "css", content: css, id: info.id },
                  })
                );
              }
              transformedTestInfo.testInfo.find(
                (test) => test.id === info.id
              ).variationFiles.css = css;
              await browserScriptCreator(transformedTestInfo);
            } else if (path.extname(filePath) === ".js") {
              const jsFile = path.join(path.dirname(filePath), "index.js");
              const js = await fs.readFile(jsFile, "utf-8");
              if (config.jsReload == true) {
                broadcastToClients(
                  JSON.stringify({
                    type: "reload_page",
                    data: info.hostnames,
                  })
                );
              } else {
                broadcastToClients(
                  JSON.stringify({
                    type: "update",
                    data: { type: "js", content: js, id: info.id },
                  })
                );
              }
              transformedTestInfo.testInfo.find(
                (test) => test.id === info.id
              ).variationFiles.js = js;
              await browserScriptCreator(transformedTestInfo);
            }
          } catch (error) {
            console.error(`Error reading config: ${error.message}`);
            log(`Error reading config: ${error.message}`);
          }
        }
      }
    })
    .on("error", (error) => log(`Watcher error: ${error}`));

  wss.on("connection", async (ws) => {
    log("Browser connected");
    clients.add(ws);

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "checkWebsite") {
          const { url } = data.data;
          const origin = new URL(url.toString()).origin;
          const IsMatched = transformedTestInfo.testInfo.some((test) =>
            test.hostnames.some((hostname) => {
              // console.log(origin, origin.replace(/\/$/, ''), url, url.replace(/\/$/, ''), hostname, hostname.replace(/\/$/, ''), origin.replace(/\/$/, '').includes(hostname.replace(/\/$/, '')), url.replace(/\/$/, '').includes(hostname.replace(/\/$/, '')));

              return (
                origin
                  .replace(/\/$/, "")
                  .includes(hostname.replace(/\/$/, "")) ||
                url.replace(/\/$/, "").includes(hostname.replace(/\/$/, ""))
              );
            })
          );

          if (IsMatched) {
            console.log(kleur.magenta(`connected with the url: ${url}`));
            ws.send(
              JSON.stringify({
                type: "checkWebsiteResponse",
                data: "Successfully connected with the server",
              })
            );
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    try {
      const config = await fs.readJson(
        path.join(process.cwd(), "settings.json")
      );
      log("Config sent to client:", config);
      ws.send(
        JSON.stringify({
          type: "config",
          data: config,
        })
      );

      if (config.displayUI == true) {
        //send UI code to client
        const uiJsFilePath = path.join(
          __dirname,
          "..",
          "public",
          "js",
          "main",
          "ui.js"
        );
        const uiCssFilePath = path.join(
          __dirname,
          "..",
          "public",
          "style",
          "ui.scss"
        );
        const uiJs = await getBundlerData(uiJsFilePath, uiCssFilePath, false);
        ws.send(
          JSON.stringify({
            type: "ui",
            data: uiJs,
          })
        );
      }
    } catch (error) {
      console.error(`Error reading config: ${error.message}`);
      log(`Error reading config: ${error.message}`);
      ws.send(
        JSON.stringify({
          type: "config",
          data: {},
        })
      );
    }

    ws.on("close", () => {
      clients.delete(ws);
      log("Browser disconnected");
    });
  });

  //get port number from settings.json
  const settingsPath = path.join(process.cwd(), "settings.json");
  const settings = await fs.readJson(settingsPath);
  const port = settings.portNumber || process.env.PORT || 3007;
  server.listen(port, () => {
    log(`Test server running on http://localhost:${port}`);
  });
}

async function transformTestInfo(testInfo) {
  const parentTargetingMap = new Map();

  // Process items with parentTargetingId
  const itemsWithParentTargeting = testInfo.filter(
    (item) => item.parentTargetingId
  );

  for (const item of itemsWithParentTargeting) {
    if (!parentTargetingMap.has(item.parentTargetingId)) {
      const targetingFiles = await getTargetingFiles(item.parentTargetingDir);
      parentTargetingMap.set(item.parentTargetingId, {
        targeting: item.parentTargetingDir,
        parentTargetingDir: item.parentTargetingDir,
        parentTargetingId: item.parentTargetingId,
        variationIdList: [],
        hostnames: item.hostnames,
        targetingFiles,
      });
    }
    parentTargetingMap
      .get(item.parentTargetingId)
      .variationIdList.push(item.id);
  }
  const targetingCheckDir = path.join(ROOT_DIR, "..", "skeleton", "targetMet");

  // Process all testInfo items
  const finalTestInfo = await Promise.all(
    testInfo.map(async (item) => {
      // check if compiled dir exists or not
      const compiledDir = path.join(item.variationDir, "compiled");
      if (!fs.existsSync(compiledDir)) {
        //compile the variation js and css
        await bundleVariation(item.variationDir, "js");
        await bundleVariation(item.variationDir, "scss");
      }
      return {
        variationDir: item.variationDir,
        compiledDir: path.join(item.variationDir, "compiled"),
        targetingDir: item.targetingDir,
        parentTargetingDir: item.parentTargetingDir,
        id: item.id,
        testType: item.testType,
        hostnames: item.hostnames,
        variationFiles: await getVariationFiles(item.variationDir),
        targetingFiles: await getTargetingFiles(item.targetingDir),
        websiteName: item.websiteName,
        testName: item.testName,
        touchPointName: item.touchPointName,
        variationName: item.variationName,
      };
    })
  );

  return {
    parentTargeting: Array.from(parentTargetingMap.values()),
    targetMet: await getTargetMetFiles(targetingCheckDir),
    testInfo: finalTestInfo,
  };
}

async function getVariationFiles(variationDir) {
  const compiledDir = path.join(variationDir, "compiled");
  const cssFile = path.join(compiledDir, "style.css");
  const jsFile = path.join(compiledDir, "index.js");

  try {
    const css = await fs.readFile(cssFile, "utf-8");
    const js = await fs.readFile(jsFile, "utf-8");

    return {
      css,
      js,
    };
  } catch (error) {
    console.error("Error reading variation files:", error);
    return {
      css: "",
      js: "",
    };
  }
}

async function getTargetingFiles(targetingDir) {
  if (!targetingDir) {
    return null;
  }

  const elementCheckerPath = path.join(targetingDir, "elementChecker.json");
  const urlCheckerPath = path.join(targetingDir, "urlChecker.json");
  // const compiledPath = path.join(targetingDir, "compiled", "customJS.js");

  try {
    // Dynamically import customJS.js
    // const customJSModule = await import(`file://${customJSPath}`);
    // // const customJSModule = await import(`file://${customJSPath}?update=${Date.now()}`);
    // const customJS = customJSModule.default; // Get the default exported function

    // Check if the file exists and delete it if it does
    // if (fs.existsSync(compiledPath)) {
    //     fs.unlinkSync(compiledPath);
    // }

    await bundleTargeting(targetingDir);
    const BundleTargetingPath = path.join(
      targetingDir,
      "compiled",
      "customJS.js"
    );
    // const customJSModule = await import(`file://${BundleTargetingPath}`);
    const customJSModule = await import(
      `file://${BundleTargetingPath}?update=${Date.now()}`
    );
    const customJS = customJSModule.default;

    const elementChecker = await fs.readJson(elementCheckerPath);
    const urlChecker = await fs.readJson(urlCheckerPath);

    return {
      customJS: customJS,
      elementChecker,
      urlChecker,
    };
  } catch (error) {
    console.error("Error reading targeting files:", error);
    return {
      customJS: () => { }, // Return an empty function as a fallback
      elementChecker: {},
      urlChecker: {},
    };
  }
}

async function getTargetMetFiles(targetingCheckDir) {
  if (!targetingCheckDir) {
    return null;
  }

  const customJSPath = path.join(targetingCheckDir, "customJS.js");
  const elementCheckerPath = path.join(targetingCheckDir, "elementChecker.js");
  const urlCheckerPath = path.join(targetingCheckDir, "urlChecker.js");

  try {
    // Dynamically import customJS.js
    const customJSModule = await import(`file://${customJSPath}`);
    const elementCheckerModule = await import(`file://${elementCheckerPath}`);
    const urlCheckerModule = await import(`file://${urlCheckerPath}`);

    const customJS = customJSModule.default;
    const elementChecker = elementCheckerModule.default;
    const urlChecker = urlCheckerModule.default;

    return {
      customJS: customJS,
      elementChecker: elementChecker,
      urlChecker: urlChecker,
    };
  } catch (error) {
    console.error("Error reading targeting files:", error);
    return {
      customJS: () => { }, // Return an empty function as a fallback
      elementChecker: {},
      urlChecker: {},
    };
  }
}

async function getVariationInfo(selectedVariation) {
  const variationDir = path.join(
    ROOT_DIR,
    selectedVariation.website,
    selectedVariation.test,
    selectedVariation.variation
  );
  const infoPath = path.join(variationDir, "info.json");
  const targetingDir = path.join(
    ROOT_DIR,
    selectedVariation.website,
    selectedVariation.test,
    "targeting"
  );

  try {
    // Check if info file exists
    if (await fs.existsSync(infoPath)) {
      const info = await fs.readJson(infoPath);
      const id = info.id;
      const variationName = info.name;
      const webSiteDir = path.join(ROOT_DIR, selectedVariation.website);
      const webSiteInfo = await fs.readJson(path.join(webSiteDir, "info.json"));
      const hostnames = webSiteInfo.hostnames;
      const websiteName = webSiteInfo.name;
      const testDir = path.join(
        ROOT_DIR,
        selectedVariation.website,
        selectedVariation.test
      );
      const testInfo = await fs.readJson(path.join(testDir, "info.json"));
      const testName = testInfo.name;
      const testType = testInfo.type;
      const touchPointName = null;

      return {
        variationDir,
        targetingDir: (await fs.existsSync(targetingDir)) ? targetingDir : null,
        id,
        hostnames,
        testType,
        websiteName,
        testName,
        touchPointName,
        variationName,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error reading info file:`, error);
    return null;
  }
}

async function getTouchPointsInfo(selectedVariation) {
  const testDir = path.join(
    ROOT_DIR,
    selectedVariation.website,
    selectedVariation.test
  );
  const testInfo = await fs.readJson(path.join(testDir, "info.json"));
  const testName = testInfo.name;
  const touchPoints = await fs.readdir(testDir);
  const websiteDir = path.join(ROOT_DIR, selectedVariation.website);
  const websiteInfo = await fs.readJson(path.join(websiteDir, "info.json"));
  const hostnames = websiteInfo.hostnames;
  const websiteName = websiteInfo.name;
  const touchPointsDir = await Promise.all(
    touchPoints
      .filter(
        (touchPoint) => touchPoint !== "targeting" && touchPoint !== "info.json"
      )
      .map(async (touchPoint) => {
        const touchPointDir = path.join(testDir, touchPoint);
        const touchPointInfoPath = path.join(touchPointDir, "info.json");
        const touchPointInfo = await fs.readJson(touchPointInfoPath);
        const touchPointName = touchPointInfo.name;
        const variationDir = path.join(
          testDir,
          touchPoint,
          selectedVariation.variation
        );
        const infoPath = path.join(variationDir, "info.json");
        const variationName = selectedVariation.variation;
        const targetingDir = path.join(testDir, touchPoint, "targeting");
        const parentTargetingDir = path.join(testDir, "targeting");
        let parentTargetingId = null;

        try {
          // Check if info file exists
          if (await fs.existsSync(infoPath)) {
            const info = await fs.readJson(infoPath);
            if (info.id) {
              // Get parent targeting info
              const parentInfoPath = path.join(testDir, "info.json");
              if (await fs.existsSync(parentInfoPath)) {
                const parentInfo = await fs.readJson(parentInfoPath);
                parentTargetingId = parentInfo.id;
              }

              return {
                variationDir,
                targetingDir: (await fs.existsSync(targetingDir))
                  ? targetingDir
                  : null,
                id: info.id,
                parentTargetingDir: (await fs.existsSync(parentTargetingDir))
                  ? parentTargetingDir
                  : null,
                parentTargetingId,
                testType: selectedVariation.testType,
                hostnames,
                websiteName,
                touchPointName,
                testName,
                variationName,
              };
            }
          }
          return null;
        } catch (error) {
          console.error(`Error reading info file for ${touchPoint}:`, error);
          return null;
        }
      })
  ).then((results) => results.filter(Boolean));
  return touchPointsDir;
}
