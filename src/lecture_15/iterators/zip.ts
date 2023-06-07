export const zip = <T>(...iterables: Array<Iterable<T>>): IterableIterator<Array<T>> => {
	const iterators = iterables.map((iterable: Iterable<T>) => iterable[Symbol.iterator]());

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			let result = [];
			let doneCount = 0;

			for (const iterator of iterators) {
				const { value, done } = iterator.next();

				if (done) {
					doneCount++;
				}

				result.push(value ?? null);
			}

			if (doneCount === iterators.length) {
				return {
					value: undefined,
					done: true,
				};
			}

			return {
				value: result,
				done: false,
			};
		},
	};
};
