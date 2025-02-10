#TODO

### Make any multi-touch workable (have to write code to make it work)
    - In one word for multi touch test we have to run multiple test in a same time. each touch point will behave as a test and the active variation will run for each touch point. for this we have to handle separate files for each variation. watcher will detect each touch point changes and after that update of a variation for each touch point will update separately also. here we also check is hot js loading also css loading as like other test also it will detect which touch point file changes and based on that it will inform to the clint server and clint server will do its task based on that specific touch point. 

### Have to use ID instead of name.
    - currently I am using name everywhere, like checking, comparing, or handle any kind of operation using the test name, variation name, touch point name, test name, website name etc but I should use an ID for each thing, like when I will create website, test, variation, touch point etc then with name I also need to include an ID and later everywhere for create start run server (clint side , server side) and everywhere I should handle operation not using name but IDs.  


### have to work on targeting
    - Here I have to marge the initial development branch with master and and create another branch for enhancement targeting. 