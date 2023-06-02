export const filter = <T>(
	iterable: Iterable<T | undefined>,
	predicate: (value: T | undefined) => boolean
): IterableIterator<T | undefined> => {
	const iterator = iterable[Symbol.iterator]();

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			let result = iterator.next();

			while (!result.done && !predicate(result.value)) {
				result = iterator.next();
			}

			return result;
		},
		return() {
			return {
				value: undefined,
				done: true,
			};
		},
	};
};
