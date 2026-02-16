/* const numbers = [1, 2, 3, 4];

const doubled = numbers.map((num) => num * 3);

console.log(doubled); */
// [2, 4, 6, 8]

import { ua } from "zod/v4/locales";

// 2
/* const names = ["reazul islam reaz", "karim mia", "rahim khan"];

const firstNames = names.map((name) => name.split(" ").shift());
const lastNames = names.map((name) => {
  const parts = name.split(" ");
  return parts[parts.length - 1];
});
console.log(lastNames); */
// ["REAZ", "KARIM", "RAHIM"]
/* 
! reduce

const array = [1, 2, 3, 4];

const total = array.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(total);
// 10
 */

/* const numbers = [
  { name: "Reaz", age: 26 },
  { name: "Karim", age: 30 },
  { name: "Rahim", age: 25 },
];

// const result = numbers.map((num) => `Mr. ${num.name}`);
const result = numbers.map((num) => {
  const newName = "Mr. " + num.name;
  return newName;
});
console.log(result);
 */

const array = [1, 2, 3, 4, 4];
const uArray = new Set(array);

uArray.add(2);
console.log(uArray);

