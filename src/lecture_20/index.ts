import { Result } from '../lecture_19/containers/result';

const res = new Result(() => 42);

res
	.flatMap(() => Result.Error('Boom'))
	.catch(console.error)
	.flatMap((value) => {
		console.log(value);

		return Result.Success(100);
	})
	.catch(console.error)
	.then((value) => console.log(`Got ${value} value`));

const response = new Result(() => {
	// Запрос к серверу

	return [40];
});

response
	.then((prev) => {
		const anotherResponse = new Result(() => {
			// Второй запрос к серверу

			return [...(prev as number[]), 50];
		});

		return anotherResponse as unknown as number[];
	})
	.flatMap((value) => value)
	.then((data) => {
		console.log(data); // [40, 50]
	})
	.catch(() => {
		console.log('Произошла ошибка');
	});

console.log('Проверка метода map');

const functor = new Result(() => 400);

functor
	.map(() => 500)
	.then((value) => {
		console.log(value);
	});

console.log('Реализация для типа Function интерфейс функтора');

declare global {
	interface Function {
		map: <T>(callback: (value: any) => T) => () => T;
	}
}

const func = (num: number) => num * 10;

Object.defineProperty(Function.prototype, 'map', {
	value: function (resolver: <T>() => T) {
		const argument = resolver();

		return (...args: any[]) => this(argument, ...args);
	},
});

console.log(func.map(() => 42)()); // 420
