export const sequence = <T>(iterables: Iterable<Iterable<T>>): IterableIterator<T> => {
	const iterablesIterator = iterables[Symbol.iterator]();

	let currentIterator = iterablesIterator.next().value[Symbol.iterator]() as Iterator<T>;

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const next = currentIterator.next();

			/**
			 * Если текущий вложенный итератор закончился, смотрим следующий
			 */
			if (next.done) {
				const nextIterator = iterablesIterator.next();

				/**
				 * Если следующего нет, считаем, что закончили
				 */
				if (nextIterator.done) {
					return { done: true, value: undefined };
				}

				/**
				 * Иначе начинаем итерацию по следующему вложенному итератору
				 */
				currentIterator = nextIterator.value[Symbol.iterator]();

				return currentIterator.next();
			}

			/**
			 * Возвращаем текущее значение текущего вложенного итератора
			 */
			return next;
		},
	};
};
