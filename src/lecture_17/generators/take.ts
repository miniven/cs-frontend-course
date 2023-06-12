import { sequence } from '../../lecture_15/iterators/sequence';
import { CommonConfig, ErrorEnum, Parser, ParserResult, ParserToken, RegExpErrorEnum } from '../types';
import { createToken, extractIterator, testEntry } from '../utils';

type ExtendedConfig = Partial<{ min: number; max: number }> & CommonConfig;

/**
 * Создаёт парсер строки для поиска последовательности символов, подходящих под проверку
 *
 * @param regex Регулярное выражение, или строка для проверки символов
 * @param config Конфигурация парсера
 * @returns Парсер
 */
export const take = (
	pattern: RegExp | ((value: string) => boolean),
	config: ExtendedConfig = {}
): Parser<string, string> => {
	const TYPE = config.token ?? 'TAKE';
	const min = config.min ?? 1;
	const max = config.max ?? Infinity;

	return function* (iterable: Iterable<string>): Generator<ParserToken<string>, ParserResult<string>> {
		const iterator = extractIterator(iterable);
		const valueArr: string[] = [];
		/**
		 * Создаём буфер, чтобы поместить в него последний символ, который не прошел проверку, но уже был пройден итератором
		 */
		const buffer: string[] = [];

		for (const char of iterator) {
			if (valueArr.length === max) {
				buffer.push(char);

				break;
			}

			if (!testEntry(char, pattern)) {
				buffer.push(char);

				break;
			}

			valueArr.push(char);
		}

		/**
		 * Если итератор закончился, но парсер не набрал нужное число значений
		 */
		if (valueArr.length < min) {
			throw new Error(ErrorEnum.NOT_FOUND);
		}

		const value = valueArr.join('');
		const token = createToken(TYPE, value);

		if (config.token) {
			yield token;
		}

		return [token, buffer.length > 0 ? sequence(buffer, iterator) : iterator];
	};
};
