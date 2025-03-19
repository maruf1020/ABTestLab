#TODO

### Need to add UI for test details.
    - for single test
        - all type of test
        - specially multi touch test
        - need ui design from Shoyaib
        - have to create a draft design 
        - need option to force run test
        - change variation option (later implementation)


### have to remove unnecessary library and files and folder 

### Release v1


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
│   │   ├── start.js
│   │   └── global/                   # Global command-related helpers
│   ├── global/                       # Global configurations
│   │   └── config.js
│   ├── public/                       # Static assets for frontend
│   │   ├── css/
│   │   │   └── index.css
│   │   ├── documents/                # Markdown documentation
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
├── templates/                         # Templates for A/B tests
│   ├── targeting/                     # Targeting rules
│   │   ├── customJS.js
│   │   ├── elementChecker.json
│   │   └── urlChecker.json
│   ├── targetMet/                     # When target conditions are met
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


