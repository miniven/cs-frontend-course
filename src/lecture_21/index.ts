import { compose } from './helpers/compose';
import { curry } from './helpers/curry';

const f = compose(
	(a: number) => a ** 2,
	(a: number) => a * 10,
	(a: number) => a + 1,
	(a: number) => Math.sqrt(a) // Первая
);

console.log(f(16)); // 2500

const diff = curry((a: number, b: number) => a - b);

console.log(diff(curry._, 10)(15)); // 5
console.log(diff(curry._, curry._, curry._)(15)(10)); // 5
