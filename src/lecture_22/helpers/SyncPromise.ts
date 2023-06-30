const enum State {
	PENDING = 'pending',
	FULFILLED = 'fulfilled',
	REJECTED = 'rejected',
}

export class SyncPromise<T> {
	#value!: T;
	#error: Error | void = undefined;
	#state: State = State.PENDING;

	constructor(callback: () => T) {
		try {
			this.#value = callback();
			this.#state = State.FULFILLED;
		} catch (err: unknown) {
			if (err instanceof Error) {
				this.#error = err;
				this.#state = State.REJECTED;
			}
		}
	}

	then(callback: (value: T) => T) {
		if (this.#state === State.FULFILLED) {
			return new SyncPromise<T>(() => callback(this.#value));
		}

		return this;
	}

	catch(callback: (err: Error) => T) {
		if (this.#state === State.REJECTED) {
			return new SyncPromise<T>(() => callback(this.#error!));
		}

		return this;
	}

	static resolve<T>(value: T) {
		return new SyncPromise<T>(() => value);
	}
}
