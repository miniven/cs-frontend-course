import type { IPosition, IPosition3D } from './types';

export class Matrix<T> {
	#array: Array<T>;
	#xLength: number;

	constructor(xLength: number, yLength: number) {
		this.#array = new Array(xLength * yLength);
		this.#xLength = xLength;
	}

	#getElementIndex({ x, y }: IPosition) {
		return y * this.#xLength + x;
	}

	#assertInvalidPosition(index: number) {
		if (index >= this.#array.length || index < 0) {
			throw new Error('Invalid coordinates');
		}
	}

	set(position: IPosition, value: T) {
		const index = this.#getElementIndex(position);

		this.#assertInvalidPosition(index);
		this.#array[index] = value;
	}

	get(position: IPosition) {
		const index = this.#getElementIndex(position);

		this.#assertInvalidPosition(index);

		return this.#array[index];
	}

	get stringView() {
		let result = [];

		for (let index = 0; index < this.#array.length; index++) {
			const element = this.#array[index] || '_';

			if (index % this.#xLength === 0) {
				result.push([element]);
			} else {
				result[result.length - 1].push(element);
			}
		}

		return result.join('\n');
	}
}

export class Matrix3D<T> {
	#array: Array<T>;
	#xLength: number;
	#yLength: number;

	constructor(xLength: number, yLength: number, zLength: number) {
		this.#array = new Array(xLength * yLength * zLength);
		this.#xLength = xLength;
		this.#yLength = yLength;
	}

	#getElementIndex({ x, y, z }: IPosition3D) {
		const zDimentionStartIndex = z * this.#xLength * this.#yLength; // В каждом Z-измерении у нас хранится X * Y элементов
		const yDimentionStartIndex = y * this.#xLength;

		return zDimentionStartIndex + yDimentionStartIndex + x;
	}

	#assertInvalidPosition(index: number) {
		if (index >= this.#array.length || index < 0) {
			throw new Error('Invalid coordinates');
		}
	}

	set(position: IPosition3D, value: T) {
		const index = this.#getElementIndex(position);

		this.#assertInvalidPosition(index);
		this.#array[index] = value;
	}

	get(position: IPosition3D) {
		const index = this.#getElementIndex(position);

		this.#assertInvalidPosition(index);

		return this.#array[index];
	}
}
