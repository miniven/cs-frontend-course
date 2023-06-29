import { enumerate } from '../../lecture_15/iterators/enumerate';

type TCurryFunc = ((func: Function) => Function) & { _: Symbol };

const CURRY_SYMBOL = Symbol('underscore');

/**
 * Объединяет предыдущие аргументы с новыми, заполняя дыры новыми аргументами
 *
 * @param prevArgs Начальный массив аргументов
 * @param newArgs Новые аргументы, которые нужно добавить
 * @returns Объединенный массив аргументов
 */
function smartConcat(prevArgs: Array<unknown>, newArgs: Array<unknown>) {
	const newArgsIterator = newArgs[Symbol.iterator]();
	const buffer = [];

	for (const [index, added] of enumerate(prevArgs)) {
		if (added === CURRY_SYMBOL) {
			const next = newArgsIterator.next();

			if (next.done || next.value === CURRY_SYMBOL) {
				buffer.push(next.value);

				break;
			}

			prevArgs[index] = next.value;
		}
	}

	return [...prevArgs, ...buffer, ...newArgsIterator];
}

function isInRange(from: number, to: number, value: number) {
	return value >= from && value <= to;
}

/**
 * Каррирует переданную функцию с возможностью пропуска аргументов при помощи curry._
 *
 * @param callback Функция, которую нужно каррировать
 * @returns Каррированная версия исходной функции
 */
export const curry = ((callback: Function): Function => {
	return (...initialArgs: Array<unknown>) => {
		let acc: Array<unknown> = [];
		let holePosition = -1;

		function helper(...args: Array<unknown>): unknown {
			acc = smartConcat(acc, args);
			holePosition = acc.indexOf(CURRY_SYMBOL);

			if (acc.length >= callback.length && !isInRange(0, callback.length - 1, holePosition)) {
				return callback(...acc);
			}

			return helper;
		}

		return helper(...initialArgs);
	};
}) as TCurryFunc;

Object.defineProperty(curry, '_', {
	value: CURRY_SYMBOL,
});
