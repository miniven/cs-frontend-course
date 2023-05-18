import { isDigit } from './isDigit';

console.log(isDigit('1223d')); // false
console.log(isDigit('d1223')); // false
console.log(isDigit('12d23')); // false
console.log(isDigit('1223')); // true

console.log(isDigit('12X23I')); // false
console.log(isDigit('XI123')); // false
console.log(isDigit('XI')); // true

console.log(isDigit('dXI')); // false
console.log(isDigit('d😮d')); // false
