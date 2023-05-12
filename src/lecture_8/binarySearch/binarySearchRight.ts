export const binarySearchRight = <T = unknown>(array: Array<T>, comparator: (value: T) => number): number => {
	let result = -1;

	if (array.length === 0) {
		return result;
	}

	let left = 0;
	let right = array.length - 1;

	while (left <= right) {
		const middle = Math.floor((left + right) / 2);
		const direction = comparator(array[middle]);

		if (direction === 0) {
			result = middle;
		}

		if (direction <= 0) {
			left = middle + 1;

			continue;
		}

		right = middle - 1;
	}

	return result;
};
