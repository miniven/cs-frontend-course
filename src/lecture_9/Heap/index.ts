import { Errors } from './types';

export class Heap<T> {
	#buffer: Array<T> = [null!];
	#length = 0;
	#comparator: (inserted: T, compared: T) => number;

	constructor(comparator: (inserted: T, compared: T) => number) {
		this.#comparator = comparator;
	}

	/**
	 * Меняет местами два элемента в буфере
	 *
	 * @param first Индекс первого элемента
	 * @param second Индекс второго элемента
	 */
	#swap(first: number, second: number) {
		const temp = this.#buffer[first];

		this.#buffer[first] = this.#buffer[second];
		this.#buffer[second] = temp;
	}

	/**
	 * Вычисляет индекс родителя для элемента с переданным индексом
	 *
	 * @param index Индекс элемента
	 * @returns Индекс родителя
	 */
	#getParentIndex(index: number): number {
		return Math.floor(index / 2);
	}

	/**
	 * Вычисляет индекс левого потомка для элемента с переданным индексом
	 *
	 * @param index Индекс элемента
	 * @returns Индекс левого потомка
	 */
	#getLeftChildIndex(index: number): number {
		return index * 2;
	}

	/**
	 * Вычисляет индекс правого потомка для элемента с переданным индексом
	 *
	 * @param index Индекс элемента
	 * @returns Индекс правого потомка
	 */
	#getRightChildIndex(index: number): number {
		return index * 2 + 1;
	}

	/**
	 * «Поднимает» элемент на более высокую позицию в дереве, меняя его с большими элементами
	 *
	 * @param start Индекс элемента, который нужно поднять в дереве
	 */
	#siftUp(start: number) {
		let pointer = start;

		while (pointer > 1) {
			const parentPointer = this.#getParentIndex(pointer);

			if (this.#comparator(this.#buffer[pointer], this.#buffer[parentPointer]) >= 0) {
				break;
			}

			this.#swap(pointer, parentPointer);
			pointer = parentPointer;
		}
	}

	/**
	 * «Опускает» элемент на более высокую позицию в дереве, меняя его с меньшими элементами
	 *
	 * @param start Индекс элемента, который нужно опустить в дереве
	 */
	#siftDown(start: number) {
		let pointer = start;

		while (pointer < this.#length) {
			let nextIndex = pointer;
			const leftChildIndex = this.#getLeftChildIndex(nextIndex);
			const rightChildIndex = this.#getRightChildIndex(nextIndex);

			if (
				leftChildIndex <= this.#length &&
				this.#comparator(this.#buffer[nextIndex], this.#buffer[leftChildIndex]) > 0
			) {
				nextIndex = leftChildIndex;
			}

			if (
				rightChildIndex <= this.#length &&
				this.#comparator(this.#buffer[nextIndex], this.#buffer[rightChildIndex]) > 0
			) {
				nextIndex = rightChildIndex;
			}

			if (nextIndex === pointer) {
				break;
			}

			this.#swap(pointer, nextIndex);
			pointer = nextIndex;
		}
	}

	/**
	 * Добавляет значение в очередь
	 *
	 * @param value Значение, которое нужно вставить
	 */
	push(value: T) {
		this.#buffer[++this.#length] = value;
		this.#siftUp(this.#length);
	}

	/**
	 * Возвращает из очереди значение с самым высоким приоритетом
	 */
	pop() {
		if (this.#length === 0) {
			throw new Error(Errors.HEAP_IS_EMPTY);
		}

		const value = this.#buffer[1];

		this.#swap(1, this.#length);

		this.#length--;
		this.#siftDown(1);

		return value;
	}
}

const heap = new Heap<number>((a, b) => a - b);

heap.push(8);
heap.push(5);
heap.push(100);
heap.push(3);
heap.push(71);

console.log(heap.pop());
console.log(heap.pop());
console.log(heap.pop());
console.log(heap.pop());
console.log(heap.pop());
