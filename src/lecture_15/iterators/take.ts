export const take = <T>(iterable: Iterable<T>, limit: number): IterableIterator<T | undefined> => {
	const iterator = iterable[Symbol.iterator]();

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const { value, done } = iterator.next();

			limit--;

			if (done || limit < 0) {
				return {
					value: undefined,
					done: true,
				};
			}

			return {
				value,
				done,
			};
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
