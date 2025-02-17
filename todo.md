#TODO
### Allow user to import from different files to work with on any variation. (work with bundler )
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

shoup test look should look like this which we have done on 

viewTestHistory: but only yhe goup test.



┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────────┬────────────────┬────────────────────────┐
│ Group Test   │ Test type    │ Website Name │ Test Name    │ Touch-point Name │ Variation Name │ Last Run               │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
│ YES          │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 18/2/2025, 3:19:04 am  │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤
│              │ AA           │ loopearplugs │ AA test      │ -                │ v01            │ 18/2/2025, 3:19:04 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ YES          │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 18/2/2025, 3:17:38 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │ A/B          │ snocks       │ AB test      │ -                │ v02            │ 18/2/2025, 3:17:38 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ YES          │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 18/2/2025, 2:58:15 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │ A/B          │ snocks       │ AB test      │ -                │ v01            │ 18/2/2025, 2:58:15 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ NO           │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 18/2/2025, 2:42:43 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ YES          │ Multi-touch  │ loopearplugs │ Multi toch … │ home             │ v01            │ 18/2/2025, 2:20:07 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │              │              │              │ manu             │ v01            │                        │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │ A/B          │ snocks       │ AB test      │ -                │ v01            │ 18/2/2025, 2:20:07 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ NO           │ Multi-touch  │ loopearplugs │ Multi toch … │ home             │ v01            │ 18/2/2025, 1:10:48 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │              │              │              │ manu             │ v01            │                        │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ NO           │ AA           │ loopearplugs │ AA test      │ -                │ v01            │ 18/2/2025, 1:08:08 am  │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ YES          │ AA           │ loopearplugs │ AA test      │ -                │ v01            │ 18/2/2025, 12:24:22 am │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │ A/B          │ loopearplugs │ AB test      │ -                │ v01            │ 18/2/2025, 12:24:22 am │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │ Multi-touch  │ loopearplugs │ Multi toch … │ home             │ v01            │ 18/2/2025, 12:24:22 am │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │              │              │              │ manu             │ v01            │                        │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│              │ A/B          │ snocks       │ AB test      │ -                │ Control        │ 18/2/2025, 12:24:22 am │      
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼────────────────┼────────────────────────┤      
│ NO           │ A/B          │ loopearplugs │ AB test      │ -                │ v02            │ 17/2/2025, 2:27:34 am  │      
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────────┴────────────────┴────────────────────────┘      
? Select a test to run: »
>   ┌ loopearplugs - AB test - v01 (A/B)
    └ loopearplugs - AA test - v01 (AA)
    ┌ loopearplugs - AB test - v01 (A/B)
    └ snocks - AB test - v02 (A/B)
    ┌ loopearplugs - AB test - v01 (A/B)
    └ snocks - AB test - v01 (A/B)
    loopearplugs - AB test - v01 (A/B)
    ┌ loopearplugs - Multi toch test manu and home page - v01 (Multi-touch)
    └ snocks - AB test - v01 (A/B)
    loopearplugs - Multi toch test manu and home page - v01 (Multi-touch)
    loopearplugs - AA test - v01 (AA)
    ┌ loopearplugs - AA test - v01 (AA)
    │ loopearplugs - AB test - v01 (A/B)
    │ loopearplugs - Multi toch test manu and home page - v01 (Multi-touch)
    └ snocks - AB test - Control (A/B)
    loopearplugs - AB test - v02 (A/B)
    ← Back