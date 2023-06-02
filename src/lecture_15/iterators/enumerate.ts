export const enumerate = <T>(iterable: Iterable<T>): IterableIterator<[number, T]> => {
	const iterator = iterable[Symbol.iterator]();

	let index = 0;

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const { value, done } = iterator.next();

			if (done) {
				return {
					value: undefined,
					done: true,
				};
			}

			return {
				value: [index++, value],
				done: false,
			};
		},
		return() {
			return {
				value: undefined,
				done: true,
			};
		},
	};
};
