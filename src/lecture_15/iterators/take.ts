export const take = <T>(iterable: Iterable<T>, limit: number): IterableIterator<T> => {
	const iterator = iterable[Symbol.iterator]();

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const value = iterator.next().value;
			const result = {
				value,
				done: value === undefined || limit <= 0,
			};

			limit--;

			return result;
		},
		return() {
			limit = 0;

			return {
				value: undefined,
				done: true,
			};
		},
	};
};
