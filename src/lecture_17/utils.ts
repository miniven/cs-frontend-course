import { CommonConfig, Parser, ParserToken } from './types';

export const createToken = <V extends string, T>(type: V, value: T): ParserToken<T> => ({ type, value });

export const extractIterator = <T>(iterable: Iterable<T>): IterableIterator<T> =>
	iterable[Symbol.iterator]() as IterableIterator<T>;

export const createBufferedIterable = (iterable: Iterable<string>, buffer: Array<string>): IterableIterator<string> => {
	const iterator = extractIterator(iterable);

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const next = iterator.next();

			if (!next.done) {
				buffer.push(next.value);
			}

			return next;
		},
	};
};

export const testEntry = (entry: string, checker: string | RegExp | ((value: string) => boolean)): boolean => {
	switch (typeof checker) {
		case 'function': {
			return checker(entry);
		}
		case 'string': {
			return entry === checker;
		}
		default: {
			return checker.test(entry);
		}
	}
};

export const isParser = (
	parserOrConfig: Parser<string, string> | CommonConfig
): parserOrConfig is Parser<string, string> => typeof parserOrConfig === 'function';
