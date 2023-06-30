import { enumerate } from '../../lecture_15/iterators/enumerate';

const count = <T>(iterable: Iterable<T>) => {
	let count = 0;

	for (const _ of iterable) {
		count++;
	}

	return count;
};

export const allLimit = <T>(functions: Iterable<() => Promise<T>>, limit: number): Promise<T[]> => {
	let counter = 0;

	const results: T[] = [];
	const total = count(functions);
	const iterator = enumerate(functions);

	return new Promise((resolve) => {
		function makeNextRequest(iterator: Iterator<[index: number, request: () => Promise<T>]>) {
			const next = iterator.next();

			if (!next.done) {
				const [index, request] = next.value;

				request().then((data: T) => {
					counter++;
					results[index] = data;

					if (counter === total) {
						resolve(results);
					}

					makeNextRequest(iterator);
				});
			}
		}

		for (let index = 0; index < limit; index++) {
			makeNextRequest(iterator);
		}
	});
};
