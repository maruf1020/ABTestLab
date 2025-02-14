//Here we will declare how to handle targeting using the target met checker


//here I will specify the file name
// example: 
const mapper = [
    {
        "rulesFile": "customJS.js",
        "checker file": "customJS.js",
        "fileType": "js",
    },
    {
        "rulesFile": "urlChecker.js",
        "checker file": "urlChecker.json",
    },
]

// Example usage of custom js function checker
// checker(activator, 5000).then((result) => {
//     console.log('Final Result:', result);
// });

// Example usage of element checker function
// checker(config).then((result) => {
//     console.log("Final Result:", result);
//   });

// Example usage of URL checker function
// checker(config).then((result) => {
//     console.log("Final Result:", result);
//   });