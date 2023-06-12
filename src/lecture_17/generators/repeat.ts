import { sequence } from '../../lecture_15/iterators/sequence';
import { CommonConfig, ErrorEnum, Parser, ParserResult, ParserToken } from '../types';
import { createBufferedIterable, createToken } from '../utils';

type ExtendedConfig = Partial<{ min: number; max: number }> & CommonConfig;

export const repeat = (parser: Parser<string, string>, config: ExtendedConfig = {}): Parser<string, string> => {
	const TYPE = config.token ?? 'REPEAT';
	const min = config.min ?? 1;
	const max = config.max ?? Infinity;

	return function* (iterable: Iterable<string>): Generator<ParserToken<string>, ParserResult<string>> {
		let buffer: string[] = [];
		let iterator = createBufferedIterable(iterable, buffer);
		let resultArr: ParserToken<string>[] = [];

		while (resultArr.length < max) {
			try {
				const parsing = parser(iterator);

				let next = parsing.next();

				while (!next.done) {
					yield next.value;

					next = parsing.next();
				}

				buffer = [];
				resultArr.push(next.value[0]);
				iterator = createBufferedIterable(next.value[1], buffer);
			} catch {
				break;
			}
		}

		if (resultArr.length < min) {
			throw new Error(ErrorEnum.UNEXPECTED);
		}

		const token = createToken(TYPE, resultArr.map((token) => token.value).join(''));

		if (config.token) {
			yield token;
		}

		return [token, buffer.length ? sequence(buffer, iterator) : iterator];
	};
};
