# TestLab

A powerful CLI-based tool for local development of A/B tests with live browser previews. It supports writing code in your preferred editor, instantly seeing changes via a browser extension snippet, and managing tests compatible with popular platforms like **AB Tasty**, **Dynamic Yield**, **VWO**, **Kameleoon**, **VWO**, and more.


## To run the test 

---

## 📦 Installation

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
    # I am developing this application on node version 22.8.0 and npm version 10.8.3
    #for installation you need this two command 
    npm i #initialize node package
    npm run cli init #initialize application (only once after project setup)

    #then you can create  test and run it
    npm run cli create #create anything
    npm run cli start #start test
    npm run cli settings for #setting
```

### inject this to any of the browser extension which allow to inject script to the website.
This one is [an example](https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en) 
   
```
    (function () {
        'use strict';
        function observeElement(selector, callback, { minElements = 1, isVariable = false, timeout = 10000, interval = 5 } = {}, start = performance.now()) { (function check() { const elements = isVariable ? window[selector] : document.querySelectorAll(selector); if ((isVariable && elements !== undefined) || (!isVariable && elements.length >= minElements)) return callback(elements); if (performance.now() - start < timeout) setTimeout(check, interval); })(); }

        const MAIN_URL = 'http://localhost:3000/ab-pilot-script.js';
        const mainScript = document.createElement('script');
        mainScript.setAttribute('src', MAIN_URL);
        observeElement('html', ([html]) => {
            html.appendChild(mainScript)
            const LIVE_UPDATE_URL = 'http://localhost:3000/ab-test-script.js';
            const updateScript = document.createElement('script');
            updateScript.setAttribute('src', LIVE_UPDATE_URL);
            observeElement('html', ([html]) => html.appendChild(updateScript));
            
        });
    })();
```
<!-- *://*/*     <- use it for targeting all the pages on user js> -->


## 🚀 Features

- ✍️ **Edit & Test Locally** – Write test code and see changes immediately in the browser.
- 🧪 **Supports Multiple Test Types** – A/B, AA, Multi-touch, Patch, and more.
- 🧲 **Platform Compatible** – AB Tasty, Dynamic Yield, VWO, Chameleon, VLo, etc.
- 🌐 **Create & Manage Websites, Tests, and Variations** easily.
- 🧠 **Beautiful Terminal UI** – Clean, interactive interface with emoji indicators.
- 📦 **Build Tests Anytime** – Locally prepare test files to upload to testing tools.
- 🎯 **Single & Group Test Execution** – Run tests individually or in batch.
- 🔄 **Variation Swapping** – Easily switch between different variations and test setups.

---

## 🧠 Workflow Overview

1. **Initialize Project** – One-time setup using the CLI.
2. **Create Websites, Tests & Variations**.
3. **Write code** in your editor for tests and variations.
4. **Preview tests** in your browser via extension snippet.
5. **Build tests** locally and optionally upload to any platform.

---

## 🛠️ CLI Commands

Run the CLI:

```bash
npm run cli
```

### Main Menu

```
? Select a command to run
> 🚀 Start the Server
  📦 Build Test
  ➕ Create a New Item
  🛠️ Initialize Project
  ⚙️ Update Settings
  ❌ Exit
```

### 🚀 Start the Server

```
? What would you like to do?
> 🕒 Latest Test
  📚 View Test History
  🎯 Run a Single Test
  🚀 Run Group Tests
  🔙 Back
  ❌ Exit
```

#### 🕒 Latest Test Options

- 🚀 Run Latest Test
- 🔄 Change Variation
- 🔄 Change Test

---

### ➕ Create a New Item

```
? Select an option:
> 🆕 Create New Website
  🌐 ---- website 1 ---
  🌐 ---- website 2 ---
  ...
```

#### 🌐 Website Options

- 🆕 Create New Test
- 🆎 Test 1 – A/B Test
- 📊 Test 2 – AA Test
- 🎯 Test 3 – Multi-touch Test
- 🩹 Test 4 – Patch Test

---

#### 🆎 Test Options

```
? Select an option:
> 🆕 Create New Variation
  🎭 ---- variation 1 ---
  🎭 ---- variation 2 ---
  ...
```

#### 🎭 Variation Options

- 🚀 Start Variation
- 📜 See Test Details
- 📦 Build Variation
- 📤 Copy Variation to Another Test
- ✏️ Rename Variation
- 🗑️ Remove Variation

---

## 📚 History and Settings

```
📚 History Records Count: 10
🎨 CSS Reload: No
🖼️ Display UI: Yes
📜 JS Reload: No
📦 Bundler Settings
💾 Save and Exit
❌ Exit
```

---

## 🧪 Test Types

| Type              | Description                        | Icon |
|-------------------|------------------------------------|------|
| A/B Test          | Compare two or more variants       | 🆎   |
| AA Test           | Identical variant comparisons      | 📊   |
| Multi-touch Test  | Compare multiple changes at once   | 🎯   |
| Patch Test        | Small change deployment            | 🩹   |

---

## 📂 Project Structure (Suggested)

```
project structure : 
ABTestLab
├── .vscode/                         # VS Code configuration files
├── core/                            # Core functionalities
│   ├── client/                      # Client-side scripts
│   │   ├── browser-Runner.js
│   │   └── browser-script.js
│   ├── commands/                    # CLI commands
│   │   ├── create.js
│   │   ├── init.js
│   │   ├── settings.js
│   │   └── start.js
│   ├── global/                       # Global configurations
│   │   └── config.js
│   ├── public/                       # Static assets for frontend
│   │   ├── css/
│   │   │   └── index.css
│   │   ├── documents/                # documentation
│   │   │   ├── complete_todo.md
│   │   │   └── todo.md
│   │   ├── html/
│   │   │   └── index.html
│   │   ├── icons/
│   │   │   └── close.svg
│   │   ├── js/                        # JavaScript assets
│   │   │   ├── main/
│   │   │   │   └── index.js
│   │   │   ├── vendor/                 # Third-party scripts
│   │   │   └── socket-io-client.js
│   ├── scripts/                        # Utility scripts
│   │   ├── createSettingFile.js
│   │   ├── createSkeleton.js
│   │   └── downloadSocketIo.js
│   ├── server/                         # Server-side scripts
│   │   ├── browserScriptCreator.js
│   │   └── testServer.js
├── templates/                         # Initial Templates for A/B tests
│   ├── targeting/                     # Targeting rules
│   │   ├── customJS.js
│   │   ├── elementChecker.json
│   │   └── urlChecker.json
│   ├── targetMet/                     # When and how target conditions are met
│   │   ├── customJS.js
│   │   ├── elementChecker.js
│   │   └── urlChecker.js
│   ├── variation/                      # Variation-related files
│   │   ├── index.js
│   │   ├── info.json
│   │   └── style.scss
│   ├── utils/                          # Utility functions
│   │   ├── bundler.js
│   │   ├── creatorPrompts.js
│   │   ├── creators.js
│   │   ├── cssUtils.js
│   │   ├── fileUtils.js
│   │   ├── historyUtils.js
│   │   ├── selectors.js
│   │   └── startUtils.js
│   └── index.js
├── skeleton/                          # Skeleton structures
├── websites/                          # Websites-related configurations
├── package.json
├── node_modules/                      # Dependencies
├── settings.json
├── history.json                        # Execution history
├── .gitignore                          # Git ignored files
└── README.md                           # Project documentation
```

---

## 💡 Example Use Cases

- Create local tests before uploading to AB testing platforms.
- Perform rapid QA with live browser previews.
- Manage large sets of websites and tests from one place.
- Simplify teamwork with reusable variation templates.

---

## 🛠️ One-Time Setup

Initialize your project (only once or after `npm install`):

```bash
🛠️ npm run cli init
```

---

## 📤 Build & Deploy

Build your test locally:

```bash
📦 npm run cli build #build a test
```

You can then upload your built files to your desired A/B testing platform.

---

## 🔒 Permissions & Requirements

- Node.js v14+
- CLI access
- Browser extension installed for snippet injection

---

## 🙌 Contributing

Coming soon...

---

## 📄 License

### **MIT-Restricted License**  

**Copyright (c) 2025 maruf1020**  

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, and sublicense the Software,  
subject to the following conditions:  

1. **Commercial Use Restriction**  
   - Any person, company, or organization intending to use this software for **commercial purposes, profit, or financial gain** must obtain prior **written permission** from the copyright holder (**maruf1020**).  
   - Commercial use means using the software to make money. This includes things like selling it, renting it out, offering it as a paid service, or using it in any product or service that makes money.

2. **Grant of Use to Echologyx Ltd**  
   - As the copyright holder is an employee of **Echologyx Ltd**, the company **Echologyx Ltd** is **granted a non-exclusive, royalty-free license** to use, modify, and distribute this software 

3. **Inclusion of Copyright Notice**  
   - The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  

4. **Warranty Disclaimer**  
   - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  

For commercial licensing inquiries, please contact: **marufbillah03033@gmail.com**.  

---

## 📞 Support

For help, bugs, or feature requests, reach out via [GitHub Issues](https://github.com/maruf1020/ABTestLab/issues) or email: `marufbillah03033@gmail.com`
