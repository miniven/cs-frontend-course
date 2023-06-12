import { CommonConfig, ErrorEnum, Parser, ParserResult, ParserToken } from '../types';
import { createToken, isParser } from '../utils';

/**
 * Создаёт парсерный комбинатор для переданных ему парсеров, который с их помощью парсит строку по частям
 *
 * @param parsers Парсеры. Первым аргументом опционально может идти конфиг.
 * @returns Парсерный комбинатор
 */
export function seq(
	parserOrConfig: Parser<string, string> | CommonConfig,
	...parsers: Array<Parser<string, string>>
): Parser<string, string>;

export function seq(...parsers: Array<Parser<string, string>>): Parser<string, string>;

export function seq(
	parserOrConfig: Parser<string, string> | CommonConfig,
	...parsers: Array<Parser<string, string>>
): Parser<string, string> {
	let config: Partial<CommonConfig> = {};

	if (isParser(parserOrConfig)) {
		parsers.unshift(parserOrConfig);
	} else {
		config = parserOrConfig;
	}

	const TYPE = config.token ?? 'SEQ';

	return function* (iterable: Iterable<string>): Generator<ParserToken<string>, ParserResult<string>> {
		let nextIterable = iterable;
		let resultArr: ParserToken<string>[] = [];

		const tokens = [];

		for (const parser of parsers) {
			const parsing = parser(nextIterable, resultArr.at(-1));
			let next = parsing.next();

			while (!next.done) {
				/**
				 * Коллекционируем токены, чтобы вернуть их только тогда, когда последовательность полностью совпала
				 */
				tokens.push(next.value);
				next = parsing.next();
			}

			resultArr.push(next.value[0]);
			nextIterable = next.value[1];
		}

		if (!resultArr.length) {
			throw new Error(ErrorEnum.UNEXPECTED);
		}

		for (const token of tokens) {
			yield token;
		}

		const value = resultArr.map((token) => token.value).join('');
		const token = createToken(TYPE, value);

		if (config.token) {
			yield token;
		}

		return [token, nextIterable];
	};
}
