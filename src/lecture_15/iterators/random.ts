enum States {
	IDLE = 'idle',
	DONE = 'done',
}

export const random = (min: number, max: number): IterableIterator<number | undefined> => {
	let state = States.IDLE;

	const getRandomNumber = () => {
		const minInt = Math.ceil(min);
		const maxInt = Math.floor(max);

		return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
	};

	return {
		[Symbol.iterator]() {
			return this;
		},
		next: () => {
			return {
				value: state === States.IDLE ? getRandomNumber() : undefined,
				done: state === States.DONE,
			};
		},
		return: () => {
			state = States.DONE;

			return {
				value: undefined,
				done: true,
			};
		},
	};
};
