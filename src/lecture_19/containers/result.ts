type TResolver<T> = () => T | never | void;

const enum State {
	IDLE = 'idle',
	FILFULLED = 'filfulled',
	REJECTED = 'rejected',
}

export class Result<T> {
	#state: State = State.IDLE;
	#data!: T | void;
	#error!: Error;

	constructor(resolver: TResolver<T>) {
		try {
			const result = resolver();

			this.#data = result;
			this.#state = State.FILFULLED;
		} catch (err: unknown) {
			this.#error = err as Error;
			this.#state = State.REJECTED;
		}
	}

	then(resolver: (data: T | void) => T | void) {
		if (this.#state !== State.FILFULLED) {
			return this;
		}

		return new Result<T>(() => {
			return resolver(this.#data);
		});
	}

	catch(resolver: (error: Error) => T | void) {
		if (this.#state !== State.REJECTED) {
			return this;
		}

		return new Result<T>(() => {
			return resolver(this.#error);
		});
	}

	map(resolver: (value: T | void) => T | void) {
		return Result.Success(resolver(this.#data));
	}

	flatMap(resolver: (value: T | void) => Result<T> | T | void) {
		try {
			const nextValue = resolver(this.#data);

			if (nextValue instanceof Result) {
				return nextValue;
			}

			return new Result<T>(() => nextValue);
		} catch (err: unknown) {
			return new Result<T>(() => {
				throw err;
			});
		}
	}

	static Error<T>(error: Error | string) {
		return new Result<T>(() => {
			throw error;
		});
	}

	static Success<T>(value: T) {
		return new Result<T>(() => value);
	}

	/**
	 * Метод для разворачивания монадических типов через yield по принципу async/await
	 *
	 * @param executor Функция-генератор, в которой будут обрабатываться значения
	 */
	static unwrap<T>(executor: () => Generator<Result<T>>) {
		const generator = executor();

		let next = generator.next();

		while (!next.done) {
			const result = next.value;

			result
				.then((value) => {
					next = generator.next(value);
				})
				.catch((err) => {
					next = generator.throw(err);
				});
		}
	}
}
