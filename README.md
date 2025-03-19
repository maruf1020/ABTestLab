# TestLab
## To run the test 

### inject this to any of the browser extension which allow to inject script to the website.
 - this one is [an example](https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en) 
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
<!-- *://*/*  <- use it for targeting all the pages on user js> -->

### run those command
    I am developing this application on node version 22.8.0 and npm version 10.8.3
    - `npm i` initialize node package
    - `npm run cli init` initialize application
    - `npm run cli create` create anything
    - `npm run cli start` start test
    - `npm run cli settings` for setting

