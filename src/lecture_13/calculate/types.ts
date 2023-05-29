export enum States {
	EXPECT_FIRST_OPERAND = 'EXPECT_FIRST_OPERAND',
	EXPECT_SECOND_OPERAND = 'EXPECT_SECOND_OPERAND',
}

export enum Brackets {
	OPENING = '(',
	CLOSING = ')',
}

export enum Errors {
	INVALID_MATH_EXPRESSION = 'Provided math expression is not valid',
	INVALID_OPERATOR = 'Found invalid operator',
}
