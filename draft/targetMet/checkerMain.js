//Here we will declare how to handle targeting using the target met checker

// Example usage of custom js function checker
// checker(activator).then((result) => {
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


// function identifyType(data) {
//     try {
//         const parsedData = JSON.parse(data);

//         if (Array.isArray(parsedData)) {
//             return "Array";
//         } else if (typeof parsedData === "object" && parsedData !== null) {
//             return "Object";
//         } else {
//             return "Neither Array nor Object";
//         }
//     } catch (error) {
//         return "Invalid JSON or not a JSON string";
//     }
// }

// // Example Usage:
// console.log(identifyType('{"key": "value"}')); // Object
// console.log(identifyType('["item1", "item2"]')); // Array
// console.log(identifyType('"hello"')); // Neither Array nor Object
// console.log(identifyType('12345')); // Neither Array nor Object
// console.log(identifyType('{ invalid JSON ')); // Invalid JSON or not a JSON string
