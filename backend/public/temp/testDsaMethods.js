const { sorting } = require("../../utils/CommonMethod");

let testDsaCommonMethods = () => {
//test sorting method
const unsortedArray = [
    { name: "apple", quantity: 10 },
    { name: "banana", quantity: 2 },
    { name: "orange", quantity: 15 },
    { name: "grape", quantity: 5 },
    { name: "pear", quantity: 7 },
    { name: "mango", quantity: 1 }
];

let unsortedArrayItems = unsortedArray.map(item => item.quantity);

// if wanted to calculate objects length use the Object.keys/Object.values it will return the array of keys/values and then able to apply length.
//console.log(Object.values(unsortedArray[0]));
//console.log(sorting(unsortedArrayItems));  //Add array inside the sorting method
};

testDsaCommonMethods();

module.exports = testDsaCommonMethods;


