import { createGraphemesIterator, createUnicodeSymbolsIterator } from './iterators';
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

console.log([...createUnicodeSymbolsIterator('a😀\uDE00\uD83D')]); // [ 'a', '😀', '�', '�' ]
console.log([...createUnicodeSymbolsIterator('a😀\uD83D\uDE00')]); // [ 'a', '😀', '😀' ]
console.log([...createUnicodeSymbolsIterator('a😀\uD83Dc\uDE00')]); // [ 'a', '😀', '�', 'c', '�' ]
console.log([...createUnicodeSymbolsIterator('a😀\uD83D\uDE00c')]); // [ 'a', '😀', '😀', 'c' ]
console.log([...createUnicodeSymbolsIterator('abc')]); // [ 'a', 'b', 'c' ]
console.log([...createUnicodeSymbolsIterator('\uD83D')]); // [ '�' ]

console.log([...createGraphemesIterator('1😃à👩🏽‍❤️‍💋‍👨')]); // ['1', '😃', 'à', '🇷🇺', '👩🏽‍❤️‍💋‍👨'])
console.log([...createGraphemesIterator('1à👩🏽')]);
