export const filter = <T>(iterable: Iterable<T | undefined>, predicate: (value: T) => boolean): IterableIterator<T> => {
	const iterator = iterable[Symbol.iterator]();

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			let result = iterator.next();

			while (result.value !== undefined && !predicate(result.value)) {
				result = iterator.next();
			}

			return {
				value: result.value,
				done: result.done,
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
