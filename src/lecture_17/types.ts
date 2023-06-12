export interface ParserToken<T = unknown> {
	type: string;
	value?: T;
}

export interface ParserValue<T = unknown> extends ParserToken<T> {}

export type ParserResult<T = unknown> = [ParserValue<T>, Iterable<string>];

export type Parser<T = unknown, R = unknown> = (
	iterable: Iterable<string>,
	prev?: ParserValue
) => Generator<ParserToken<T>, ParserResult<R>, Iterable<string> | undefined>;

export const enum ErrorEnum {
	INVALID = 'invalid',
	NOT_FOUND = 'not found',
	NOT_FOUND_NEEDED_AMOUNT = 'not found needed amount',
}

export const enum RegExpErrorEnum {
	G_FLAT_NOT_ALLOWED = 'Flag "g" is not allowed in this parser',
}

export type CommonConfig = Partial<{ token: string; error: string }>;
