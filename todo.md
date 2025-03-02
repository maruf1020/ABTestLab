#TODO

### Enhancement required     
    - For "npm run cli create"
        - Need to add option for create variation
            - Have to be careful of general test and multi touch test. For a multi touch test if user create any variation there then all the touch point will get the same variation
        - Need to create ability to create touch point.
            - for creating any new touch point, automatically added targeting, info and variations which other touch point contain. 
        -Have to confirm that no duplicate website name inside the website list. inside any website there should not be any same name test name. same as inside test there should not same name touch point or test. Also for touch point and test there should not be same name multiple variation. So all will be unique. 

### Need to add UI for test details.
    - for single test
        - all type of test
        - specially multi touch test
        - need ui design from Shoyaib
        - have to create a draft design 
        - need option to force run test
        - change variation option (later implementation)

### allow user to create build files
    - There will be a new command npm run cli build 
        - Select a variation and Build
            - this will allow user to select variation from a website then test then if touch-point available then touch-point point then variation and of touch-point not available then after test directly variation. here control is also a variation.
        - build the last test
            - from history.json if any last test available then only this option will be visible and alow user to build the last test
        - build from history
            - from history user will be able to select test and build that. But here only the options will be shown for single run tests not for group run tests.
    - on build there will be a build folder on the variation and that contain
        - a minified css file from style.scss build
        - a minified js file from from index.js file 
        - a clean css file from style.scss build (after build prettier will pretty the code)
        - a clean js file from from index.js file (after build prettier will pretty the code)
        - a js file which contain css and js both. for css we will inject a script tag and on that tag we will inset all the css.
        - On setting command user can on of for different type of file !IMPOTENT

#### we will create I global command -> npm run cli
    - which will display the main options
        - Start (with a mindful name and a hint also)
             (Here build will be just an option when user select a variation then ask for run, build and info)
        - Create (with a mindful name and a hint also)
        - settings (with a mindful name and a hint also)
        - init (with a mindful name and a hint also)
        - Build (with a mindful name and a hint also)


### have to remove unnecessary library and files and folder 

### Release v1


project structure : 
core/
├── commands/
│   ├── create.js
│   ├── init.js
│   ├── list.js
│   ├── settings.js
│   ├── start.js
│   └── testUtils.js
│
├── scripts/
│   └──download-socket-io.js
│
├── templates/
│   ├── targeting/
│   │   ├── customJS.js
│   │   ├── elementChecker.json
│   │   └── urlChecker.json
│   │
│   ├── targetMet/
│   │   ├── customJS.js
│   │   ├── elementChecker.js
│   │   └── urlChecker.js
│   │
│   └── variation/
│       ├── index.js
│       ├── info.json
│       └── style.scss
│   
├── utils/
│   ├── browserScriptCreator.js
│   ├── bundler.js
│   ├── creators.js
│   ├── cssUtils.js
│   ├── fileUtils.js
│   ├── historyUtils.js
│   ├── init.js
│   └── testServer.js
├── browser-script.js
├── config.js
├── config.json
└── index.ks
.gitignore
package.json