import { sequence } from '../../lecture_15/iterators/sequence';
import { Parser, ParserResult, ParserToken } from '../types';
import { createBufferedIterable, createToken } from '../utils';

export const opt = (parser: Parser<string, string>): Parser<string, string> => {
	const TYPE = 'OPT';

	return function* (iterable: Iterable<string>): Generator<ParserToken<string>, ParserResult<string>> {
		const buffer: string[] = [];
		const iterator = createBufferedIterable(iterable, buffer);

		try {
			const parsing = parser(iterator);
			let next = parsing.next();

			while (!next.done) {
				yield next.value;

				next = parsing.next();
			}

			return [next.value[0], next.value[1]];
		} catch {
			return [createToken(TYPE, ''), buffer.length ? sequence(buffer, iterator) : iterator];
		}
	};
};
