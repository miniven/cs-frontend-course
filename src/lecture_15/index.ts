import { enumerate } from './iterators/enumerate';
import { filter } from './iterators/filter';
import { random } from './iterators/random';
import { range } from './iterators/range';
import { sequence } from './iterators/sequence';
import { take } from './iterators/take';
import { zip } from './iterators/zip';

console.log('Итератор по случайным числам:');

const randomInt = random(4, 9);

let counter = 5;

for (const int of randomInt) {
	if (!counter) {
		break;
	}

	counter--;
	console.log(int);
}

console.log('Функция take, которая возвращает итератор по 4 случайным числам:');

const randomIntTake = random(1, 10);

console.log([...take(randomIntTake, 4)]);

console.log('Функция filter, которая возвращает итератор только по элементам, подходящим по условию:');

const randomIntFilter = random(1, 10);

console.log([
	...take(
		filter(randomIntFilter, (value) => value! < 5),
		10
	),
]);

console.log('Функция enumerate:');

const randomIntEnum = random(1, 10);

console.log([...take(enumerate(randomIntEnum), 3)]); // [[0, ...], [1, ...], [2, ...]]

const enumerableRandonInts = enumerate(random(1, 4));

console.log(enumerableRandonInts.next()); // { value: [0, num], done: false }
console.log(enumerableRandonInts.next()); // { value: [1, num], done: false }
console.log(enumerableRandonInts.return!()); // { value: undefined, done: true }
console.log(enumerableRandonInts.next()); // { value: undefined, done: true }
console.log(enumerableRandonInts.next()); // { value: undefined, done: true }

console.log('Функция range:');

const charRange = range('a', 'f');

console.log([...charRange]); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = range(-5, 1);

console.log([...numberRange]); // [1, 0, -1, -2, -3, -4, -5]

console.log('Функция sequence:');

console.log([...sequence([[1, 2], new Set([3, 4]), [5], new Set([6, 7])])]);

console.log('Функция zip:');

console.log([...zip<number | string>([1, 2], new Set([3, 4]), 'bl')]); // [[1, 3, b], [2, 4, 'l']]
console.log([...zip<number | string>([1, 2, 3], new Set([3]), 'bl')]); // [[1, 3, b], [2, null, 'l'], [3, null, null]]
