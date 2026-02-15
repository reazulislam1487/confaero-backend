"use strict";
/* const numbers = [1, 2, 3, 4];

const doubled = numbers.map((num) => num * 3);

console.log(doubled); */
// [2, 4, 6, 8]
// 2
/* const names = ["reazul islam reaz", "karim mia", "rahim khan"];

const firstNames = names.map((name) => name.split(" ").shift());
const lastNames = names.map((name) => {
  const parts = name.split(" ");
  return parts[parts.length - 1];
});
console.log(lastNames); */
// ["REAZ", "KARIM", "RAHIM"]
/* // ! reduce
const array = [1, 2, 3, 4];
const total = array.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
}, 0);
console.log(total);
// 10
 */
/* 
const array = [1, 2, 3, 4, 4];
const set = new Set(array); */

/* for (const item of set) {
  console.log(item);
} */

/* set.forEach((item) => console.log(item));
console.log(set);
 */
/* const arr = [1, 2, 2, 3, 4, 4, 5];

const uniqueArr = [...new Set(arr)];

console.log(uniqueArr);
// [1, 2, 3, 4, 5]
 */
/* 
const set = new Set();

set.add({ a: 1 });
set.add({ a: 1 });

console.log(set);
// 2 😮

const newArr = [...set];
console.log(newArr);
 */