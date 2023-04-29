import type { IPosition } from './types';

export class Matrix3D<T> {
	#array: Array<T>;
	#xLength: number;
	#yLength: number;

	constructor(xLength: number, yLength: number, zLength: number) {
		this.#array = new Array(xLength * yLength * zLength);
		this.#xLength = xLength;
		this.#yLength = yLength;
	}

	#getElementIndex({ x, y, z }: IPosition) {
		const zDimentionStartIndex = z * this.#xLength * this.#yLength; // В каждом Z-измерении у нас хранится X * Y элементов
		const yDimentionStartIndex = y * this.#xLength;

		return zDimentionStartIndex + yDimentionStartIndex + x;
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

		console.log(this.#array);
	}

	get(position: IPosition) {
		const index = this.#getElementIndex(position);

		this.#assertInvalidPosition(index);

		return this.#array[index];
	}
}
