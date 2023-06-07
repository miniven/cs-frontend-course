const mapTypeToIncrementFunction = {
	string: (value: string) => String.fromCodePoint(value.codePointAt(0)! + 1),
	number: (value: number) => value + 1,
};

const isCorrectType = (typeofFrom: unknown, typeofTo: unknown): typeofFrom is 'string' | 'number' => {
	return (typeofFrom == typeofTo && typeofFrom === 'number') || typeofFrom === 'string';
};

const isCorrectIncrement = (increment: unknown): increment is (value: string | number) => string | number => {
	return increment !== undefined;
};

export function range<T extends string | number>(from: T, to: T): IterableIterator<T> {
	const typeofFrom = typeof from;
	const typeofTo = typeof to;

	if (!isCorrectType(typeofFrom, typeofTo)) {
		throw new Error('From or To has incorrect type');
	}

	if (from > to) {
		throw new Error('Wrong direction');
	}

	const increment = mapTypeToIncrementFunction[typeofFrom];

	if (!isCorrectIncrement(increment)) {
		throw new Error('Incrment type is not valid');
	}

	let current = from;

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const result = {
				value: current,
				done: current > to,
			};

			current = increment(current) as T;

			return result;
		},
		return() {
			return {
				value: current,
				done: true,
			};
		},
	};
}
