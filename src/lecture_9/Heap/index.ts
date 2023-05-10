import { Errors } from './types';

export class Heap<T> {
	#buffer: Array<T> = [null!];
	#length = 0;
	#comparator: (inserted: T, compared: T) => number;

	constructor(comparator: (inserted: T, compared: T) => number) {
		this.#comparator = comparator;
	}

	/**
	 * Ставит указанный элемент массива в правильную позицию, соответствующую правилам бинарной кучи
	 *
	 * @param array Массив, в котором будет происходить перестановка
	 * @param pointer Начальный индекс элемента, который необходимо поставить в правильную позицию
	 * @param rightLimit Правая граница массива, за которой нас не интересуют элементы
	 * @param comparator Функция-компаратор
	 *
	 * @returns Исходный массив
	 */
	static heapify<T>(
		array: Array<T>,
		pointer: number,
		rightLimit: number,
		comparator: (inserted: T, compared: T) => number
	) {
		while (pointer < rightLimit) {
			let largest = pointer;

			/**
			 * Делаем поправку на индексацию от 0
			 */
			const leftChildIndex = Heap.getLeftChildIndex(largest + 1) - 1;
			const rightChildIndex = Heap.getRightChildIndex(largest + 1) - 1;

			if (leftChildIndex < rightLimit && comparator(array[largest], array[leftChildIndex]) > 0) {
				largest = leftChildIndex;
			}

			if (rightChildIndex < rightLimit && comparator(array[largest], array[rightChildIndex]) > 0) {
				largest = rightChildIndex;
			}

			if (largest === pointer) {
				break;
			}

			Heap.swap(array, pointer, largest);
			pointer = largest;
		}

		return array;
	}

	/**
	 * Меняет местами два элемента в буфере
	 *
	 * @param first Индекс первого элемента
	 * @param second Индекс второго элемента
	 */
	static swap<T>(buffer: Array<T>, first: number, second: number) {
		const temp = buffer[first];

		buffer[first] = buffer[second];
		buffer[second] = temp;
	}

	/**
	 * Вычисляет индекс родителя для элемента с переданным индексом
	 *
	 * @param index Индекс элемента
	 * @returns Индекс родителя
	 */
	static getParentIndex(index: number): number {
		return Math.floor(index / 2);
	}

	/**
	 * Вычисляет индекс левого потомка для элемента с переданным индексом
	 *
	 * @param index Индекс элемента
	 * @returns Индекс левого потомка
	 */
	static getLeftChildIndex(index: number): number {
		return index * 2;
	}

	/**
	 * Вычисляет индекс правого потомка для элемента с переданным индексом
	 *
	 * @param index Индекс элемента
	 * @returns Индекс правого потомка
	 */
	static getRightChildIndex(index: number): number {
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
			const parentPointer = Heap.getParentIndex(pointer);

			if (this.#comparator(this.#buffer[pointer], this.#buffer[parentPointer]) >= 0) {
				break;
			}

			Heap.swap(this.#buffer, pointer, parentPointer);
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
			const leftChildIndex = Heap.getLeftChildIndex(nextIndex);
			const rightChildIndex = Heap.getRightChildIndex(nextIndex);

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

			Heap.swap(this.#buffer, pointer, nextIndex);
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

		Heap.swap(this.#buffer, 1, this.#length);

		this.#length--;
		this.#siftDown(1);

		return value;
	}
}
