#TODO
### Update "view test history" 
    - there will be a back and exit button on view test history
    - when come to this command then table will be look like this
        ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────────┬────────────────┬────────────────────────┐
        │ Group Test   │ Test type    │ Website Name │ Test Name    │ Touch-point Name │ Variation Name │ Last Run               │
        ├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │ NO           │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 16/2/2025, 8:09:08 pm  │
        ├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │ NO           │ AA           │ snocks       │ firt time b… │ -                │ v01            │ 16/2/2025, 7:44:09 pm  │
        ├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │ NO           │ Multi-touch  │ loopearplugs │ Multi toch … │ home             │ v01            │ 16/2/2025, 7:08:18 pm  │
        ├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │              │              │              │              │ manu             │ v01            │                        │
        ├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │ YES          │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 16/2/2025, 8:09:08 pm  │
        │              ├──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │              │ AA           │ snocks       │ firt time b… │ -                │ v01            │ 16/2/2025, 7:44:09 pm  │
        │              ├──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │              │ Multi-touch  │ loopearplugs │ Multi toch … │ home             │ v01            │ 16/2/2025, 7:08:18 pm  │
        │              ├──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │              │              │              │              │ manu             │ v01            │                        │
        ├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
        │ NO           │ Patch        │ snocks       │ full live c… │ -                │ v01            │ 16/2/2025, 7:44:09 pm  │
        └──────────────┴──────────────┴──────────────┴──────────────┴──────────────────┴────────────────┴────────────────────────┘
    - Also provide option to select a group selection and run tests as a group accordingly.
    - change the bane "Run Multiple Tests" to "Run Group Tests"
    - if last test is a group test then give user provide ad ability to run group wise again.
    - on "Run Group Tests" which is currently named as "Run Multiple Tests", there will be 3 options:
        - create group test
            - Allow user to choose and run the test. which feature is currently available directly under the "Run Multiple Tests" options.
        - run from History
            - Here user will see the list of single run test from history array and later user can multiselect them and create a group. And run that group of test.
        - View group test History
            - here user will see the list of group wise running test history and can run that again.

### Allow user to import from different files to work with on any variation.
    - user will be able to import any module for scss or js file.
    - We will no longer include any css file inside the variation. 
    - Instead of that we will create a compiled folder.
        - compiled folder will be created each time when a variation will be created 
        - We will use the variation data from the compiled files.
        - any changes on index.js or style.scss file on any variation will again do bundler and update it inside compiler.
        - when a test will run it will do the DOM update only is detect any change inside compiled folder. tough watchPaths will be still same but inside `.on("change", async (filePath) => {` we will decide that should we need to call update the DOM or not.

### allow user to create build files. (will do it later)
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

#### we will create I global command -> npm run cli (will do it later)
    - which will display the main options
        - Start (with a mindful name and a hint also)
        - Create (with a mindful name and a hint also)
        - settings (with a mindful name and a hint also)
        - init (with a mindful name and a hint also)
        - Build (with a mindful name and a hint also)


### have to created checker (targeting check) main function meaningful and a proper mapper which will allow any upgradation workable

### have to work on targeting
    - Here I have to marge the initial development branch with master and and create another branch for enhancement targeting. 


