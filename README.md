# TestLab
## To run the test 

### inject this to any of the extension. 
    ```
    (function() {
        'use strict';
        const TAMPER_URI = 'http://localhost:3000/ab-test-script.js';
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', TAMPER_URI);
        document.body.appendChild(scriptTag);
    })();
    ```
<!-- *://*/*  <- use it for targeting all the pages on user js> -->

### run those command
    I am developing this application on node version 22.8.0 and npm version 10.8.3
    - `npm i`
    - `npm run cli init`
    - `npm run cli create`
    - `npm run cli start`

