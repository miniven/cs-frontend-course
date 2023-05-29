import { isValidBracketSequence } from '../../lecture_5/helpers';
import { Brackets, Errors, States } from './types';

function calculate(expr: string): number {
	const operations = new Map([
		['+', (a: number, b: number) => a + b],
		['-', (a: number, b: number) => a - b],
		['*', (a: number, b: number) => a * b],
		['/', (a: number, b: number) => Math.floor(a / b)],
		['**', (a: number, b: number) => Math.pow(a, b)],
	]);

	const numbersStack: number[] = [];
	const operatorsStack: string[] = [];
	const elements = expr.split(/\s|(?<=\()|(?=\))/);

	console.log(elements);

	let state = States.EXPECT_FIRST_OPERAND;
	let bracketsBalance = 0;

	for (const char of elements) {
		if (operations.has(char)) {
			operatorsStack.push(char);

			continue;
		}

		if (char === Brackets.OPENING) {
			state = States.EXPECT_FIRST_OPERAND;
			bracketsBalance++;

			continue;
		}

		if (char === Brackets.CLOSING) {
			if (bracketsBalance < 0) {
				throw new SyntaxError(Errors.INVALID_MATH_EXPRESSION);
			}

			bracketsBalance--;

			const operation = operations.get(operatorsStack.pop()!);
			const operandTwo = numbersStack.pop()!;
			const operandOne = numbersStack.pop()!;

			if (!operation) {
				throw SyntaxError(Errors.INVALID_OPERATOR);
			}

			numbersStack.push(operation(operandOne, operandTwo));

			continue;
		}

		if (state === States.EXPECT_FIRST_OPERAND) {
			state = States.EXPECT_SECOND_OPERAND;
			numbersStack.push(Number(char));

			continue;
		}

		if (state === States.EXPECT_SECOND_OPERAND) {
			const operation = operations.get(operatorsStack.pop()!);
			const operandOne = numbersStack.pop()!;
			const operandTwo = Number(char);

			if (!operation) {
				throw SyntaxError(Errors.INVALID_OPERATOR);
			}

			numbersStack.push(operation(operandOne, operandTwo));
		}
	}

	if (bracketsBalance > 0) {
		throw new SyntaxError(Errors.INVALID_MATH_EXPRESSION);
	}

	return numbersStack[numbersStack.length - 1];
}

export function calcExpression(expr: string) {
	const mathExp = /[\(+-]?\d+[\s\d\(\)\+\-\*%]+\d+\)?/gm;

	return expr.replace(mathExp, (match) => {
		return String(calculate(match));
	});
}
