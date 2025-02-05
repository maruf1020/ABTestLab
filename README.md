# TestLab


##inject this to any of the extension. 
```
(function() {
    'use strict';
    const TAMPER_URI = 'http://localhost:3000/ab-test-script.js';
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', TAMPER_URI);
    document.body.appendChild(scriptTag);
})();
```

<!-- *://*/*  <- use it for targeting all the pages> -->