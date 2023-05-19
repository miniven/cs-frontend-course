import { createIterableString } from './createIterableString';
import { isDigit } from './isDigit';

console.log('IS DIGIT');

console.log(isDigit('1223d')); // false
console.log(isDigit('d1223')); // false
console.log(isDigit('12d23')); // false
console.log(isDigit('1223')); // true

console.log(isDigit('12X23I')); // false
console.log(isDigit('XI123')); // false
console.log(isDigit('XI')); // true

console.log(isDigit('dXI')); // false
console.log(isDigit('d😮d')); // false

console.log('STRING ITERATOR');

console.log([...createIterableString('a😀\uDE00\uD83D')]); // [ 'a', '😀', '�', '�' ]
console.log([...createIterableString('a😀\uD83D\uDE00')]); // [ 'a', '😀', '😀' ]
console.log([...createIterableString('a😀\uD83Dc\uDE00')]); // [ 'a', '😀', '�', 'c', '�' ]
console.log([...createIterableString('a😀\uD83D\uDE00c')]); // [ 'a', '😀', '😀', 'c' ]
console.log([...createIterableString('abc')]); // [ 'a', 'b', 'c' ]
console.log([...createIterableString('\uD83D')]); // [ '�' ]
