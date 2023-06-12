import { opt } from './generators/opt';
import { or } from './generators/or';
import { repeat } from './generators/repeat';
import { seq } from './generators/seq';
import { Pattern, tag } from './generators/tag';
import { take } from './generators/take';
import { ParserResult } from './types';

let iterable: Iterable<string> = 'function foo() {}';

/**
 * Ищем ключевое слово function
 */
console.log('TAG PARSER');

const tagFunctionParsing = tag(Pattern.FUNCTION, { token: 'FUNCTION' })(iterable);

console.log(tagFunctionParsing.next()); // {done: false, value: {type: 'TAG', value: 'function'}}

iterable = (tagFunctionParsing.next().value as ParserResult)[1];

/**
 * Ищем пробел
 */
console.log('TAKE PARSER');

const spaceParsing = take(/\s+/, { max: 2, token: 'SPACE' })(iterable);

console.log(spaceParsing.next()); // {done: true, value: {type: 'TAKE', value: ' '}}

iterable = (spaceParsing.next().value as ParserResult)[1];

/**
 * Ищем название функции
 */
const functionNameParsing = take(/\w+/, { token: 'FUNCTION NAME' })(iterable);

console.log(functionNameParsing.next()); // {done: true, value: {type: 'TAKE', value: 'foo'}}

/**
 * Ищем последовательность
 */

console.log('Последовательность SEQ');

const fnParsing = seq(
	tag(Pattern.FUNCTION, { token: 'FUNCTION' }),

	take(/\s/, { max: 1 }),

	take(/[a-z_$]/i, { max: 1 }),
	take(/\w/, { min: 0 }),

	tag('()')
)('function foo() {}');

for (const token of fnParsing) {
	/**
	 * Ожидаем:
	 *
	 * { type: 'FUNCTION', value: 'function' }
	 * { type: 'SEQ', value: 'function foo()' }
	 */
	console.log(token);
}

console.log('Комбинатор OR');

const conditionsIfParsing = or({ token: 'IF_STATEMENT' }, tag(Pattern.IF), tag(Pattern.ELSE))('if (true) {}');

console.log(conditionsIfParsing.next()); // {done: true, value: {type: 'IF STATEMENT', value: 'if'}}

const conditionsElseParsing = or({ token: 'ELSE_STATEMENT' }, tag(Pattern.IF), tag(Pattern.ELSE))('else {}');

console.log(conditionsElseParsing.next()); // {done: true, value: {type: 'ELSE STATEMENT', value: 'else'}}

console.log('Комбинатор REPEAT');

const numbersParser = repeat(seq(take(/\d/), tag(',')), { min: 1, max: 3, token: 'REPEAT' })('100,200,300,');

for (const entry of numbersParser) {
	/**
	 * Ожидаем:
	 * { type: 'REPEAT', value: '100,200,300,' }
	 */
	console.log(entry);
}

console.log('Модификатор OPT:');

/**
 * Проверяем, что вопросительный знак есть
 */
const optQuestionParsing = seq(opt(tag('?', { token: 'QUESTION_MARK' })), take(/\w/))('?boo');

console.log(optQuestionParsing.next()); // { value: { type: 'QUESTION_MARK', value: '?' }, done: false }

/**
 * Проверяем, что если знака нет, то парсинг не упадёт, а продолжится
 */
const optNoQuestionParsing = seq(opt(tag('?', { token: 'QUESTION_MARK' })), take(/\w/))('boo');

console.log(optNoQuestionParsing.next()); // { value: [{ type: 'SEQ', value: 'boo' }, Iterable], done: true }

console.log('ФИНАЛЬНО: Парсер JSON.');

const jsonKeyParser = seq(tag('"'), take(/\w/, { token: 'JSON_KEY' }), tag('"'));

const jsonValueStrParser = seq(tag('"'), take(/\w/, { token: 'JSON_VALUE_STRING' }), tag('"'));
const jsonValueNumParser = take(/\d/, { token: 'JSON_VALUE_NUMBER' });
const jsonValueParser = or(jsonValueStrParser, jsonValueNumParser);

const jsonParsing = seq(
	tag('{'),
	opt(take(/\s/)),

	repeat(seq(jsonKeyParser, tag(':'), take(/\s/), jsonValueParser, opt(tag(',')), opt(take(/\s/)))),

	opt(take(/\s/)),
	tag('}')
)('{ "name": "bob", "age": "30" }');

for (const token of jsonParsing) {
	console.log(token);
}
