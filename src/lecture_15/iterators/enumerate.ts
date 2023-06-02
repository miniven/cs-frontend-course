enum States {
	IDLE = 'idle',
	DONE = 'done',
}

export const enumerate = <T>(iterable: Iterable<T>): IterableIterator<[number, T]> => {
	const iterator = iterable[Symbol.iterator]();

	let index = 0;
	let state = States.IDLE;

	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const { value, done } = iterator.next();

			if (done || state === States.DONE) {
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
			state = States.DONE;

			return {
				value: undefined,
				done: true,
			};
		},
	};
};
