import { calcExpression } from './calculate';

console.log('Задание 1');

/**
 * Только латинские символы, цифры, нижнее подчеркивание и знак $
 */
const fancyCharsExp = /^[\w$]*$/;

console.log(fancyCharsExp.test('Привет')); // false
console.log(fancyCharsExp.test('hello')); // true
console.log(fancyCharsExp.test('ПриветHello')); // false
console.log(fancyCharsExp.test('hello23')); // true
console.log(fancyCharsExp.test('hello23$')); // true
console.log(fancyCharsExp.test('hello23$%')); // false
console.log(fancyCharsExp.test('%')); // false
console.log(fancyCharsExp.test('')); // true
console.log(fancyCharsExp.test('____')); // true

console.log('Задание 2');

/**
 * Последний элемент массива всегда окажется пустой строкой 🙁
 */
const everyFirstElementExp = /(?:,[^;]+)*;/g;

// ['762120', '763827', '750842', '749909', '755884', '']
console.log('762120,0,22;763827,0,50;750842,0,36;749909,0,95;755884,0,41;'.split(everyFirstElementExp));

// [ '1', '3', '5', '8', '9', '' ]
console.log('1,2;3,4;5,6,7;8;9,0;'.split(everyFirstElementExp));

// [ '' ]
console.log(''.split(everyFirstElementExp));

// [ '11', '33', '77', '88', '99', '' ]
console.log('11,22;33,44,55,66;77;88;99;'.split(everyFirstElementExp));

// [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ]
console.log('1;2;3;4;5;6;7;8;9;0'.split(everyFirstElementExp));

console.log('Задание 3');

const jsonEntriesExp = /"([\w\d]+)":\s*("\w+"|"\d+"|\d+)/g;

// [[ '"a": 1', 'a', '1' ], [ '"b": "2"', 'b', '"2"' ]]
console.log([...'{"a": 1, "b": "2"}'.matchAll(jsonEntriesExp)]);

// [[ '"1": 1', '1', '1' ], [ '"2": 2', '2', '2' ], [ '"3": 3', '3', '3' ]]
console.log([...'{"1": 1, "2": 2, "3": 3}'.matchAll(jsonEntriesExp)]);

console.log([...'{}'.matchAll(jsonEntriesExp)]); // []

console.log('Задание 4');

function format(str: string, data: Record<string, string | number>) {
	const templateExp = /\$\{([\d\w]+)\}/g;

	return str.replace(templateExp, (_, prop) => String(data[prop]));
}

const res = format('Hello, ${user}! Your age is ${age}.', { user: 'Bob', age: 10 });
const res2 = format('This is the way, ${1}', { 1: 'Ben' });

console.log(res); // Hello, Bob! Your age is 10.
console.log(res2); // This is the way, Ben

console.log('Задание 5');

const calculation = calcExpression(`
  Какой-то текст 1 + (10 + (15 - 24)) ** 2
  Еще какой то текст 1 + (2 * 10)
`);

console.log(calculation);
console.log(calcExpression('Давай проверим результат выражения: 1 + (2 * 10) + 2 + 1'));
