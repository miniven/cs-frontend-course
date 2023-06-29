import { sequence } from '../../lecture_15/iterators/sequence';
import { CommonConfig, ErrorEnum, Parser, ParserResult, ParserToken } from '../types';
import { createBufferedIterable, createToken, extractIterator, isParser } from '../utils';

export function or(
	parserOrConfig: Parser<string, string> | CommonConfig,
	...parsers: Array<Parser<string, string>>
): Parser<string, string>;

export function or(...parsers: Array<Parser<string, string>>): Parser<string, string>;

export function or(
	parserOrConfig: Parser<string, string> | CommonConfig,
	...parsers: Array<Parser<string, string>>
): Parser<string, string> {
	let config: Partial<CommonConfig> = {};

	if (isParser(parserOrConfig)) {
		parsers.unshift(parserOrConfig);
	} else {
		config = parserOrConfig;
	}

	return function* (iterable: Iterable<string>): Generator<ParserToken<string>, ParserResult<string>> {
		let iterator = extractIterator(iterable);
		let token: ParserToken<string> | undefined;

		for (const parser of parsers) {
			const buffer: string[] = [];

			try {
				const parsing = parser(createBufferedIterable(iterator, buffer));
				let next = parsing.next();

				while (!next.done) {
					yield next.value;

					next = parsing.next();
				}

				token = next.value[0];
				iterator = extractIterator(next.value[1]);

				break;
			} catch {
				if (buffer.length) {
					iterator = sequence(buffer, iterator);
				}

				continue;
			}
		}

		if (!token) {
			throw new Error(config.error ?? ErrorEnum.UNEXPECTED);
		}

		if (config.token) {
			yield createToken(config.token, token.value!);
		}

		return [token, iterator];
	};
}
