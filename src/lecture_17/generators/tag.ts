import { sequence } from '../../lecture_15/iterators/sequence';
import { CommonConfig, ErrorEnum, Parser, ParserResult, ParserToken } from '../types';
import { createToken, extractIterator, testEntry } from '../utils';

export const enum Pattern {
	FUNCTION = 'function',
	IF = 'if',
	ELSE = 'else',
	FOR = 'for',
	WHILE = 'while',
	PLUS = '+',
	MINUS = '-',
	MULTIPLY = '*',
	DIVIDE = '/',
}

/**
 * Создаёт парсер, который парсит итерируемый объект и находит в нём вхождение искомого тега
 *
 * @param pattern Название тега, который необходимо найти
 * @returns Парсер по итерируемому объекту
 */
export function tag(pattern: Pattern | string, config: CommonConfig = {}): Parser<string, string> {
	const TYPE = config.token ?? 'TAG';

	return function* (iterable: Iterable<string>): Generator<ParserToken<string>, ParserResult<string>> {
		/**
		 * Создаём новый итератор: если мы изначально получили строку, то он просто создастся
		 * Если мы получили итератор, то этот вызов вернёт нам этот же итератор
		 * А мы в конце вернём этот итератор, чтобы следующий парсер мог его подхватить
		 */
		const iterator = extractIterator(iterable);
		const buffer: string[] = [];

		let pointer = 0;
		let resultArr: string[] = [];

		for (const char of iterator) {
			if (!testEntry(char, pattern[pointer])) {
				buffer.push(char);

				throw new Error(ErrorEnum.NOT_FOUND);
			}

			resultArr.push(char);

			if (pointer === pattern.length - 1) {
				break;
			}

			pointer++;
		}

		if (!resultArr.length) {
			throw new Error(config.error ?? ErrorEnum.NOT_FOUND);
		}

		const result = createToken<string, string>(TYPE, resultArr.join(''));

		if (config.token) {
			yield result;
		}

		return [result, buffer.length ? sequence(buffer, iterator) : iterator];
	};
}
