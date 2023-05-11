import { Heap } from '../Heap';

/**
 * Функция пирамидальной сортировки массива in-place
 *
 * @param arr Исходный массив для сортировки
 * @param comparator Функция-компаратор для сравнения двух элементов массива
 *
 * @returns Отсортированный исходный массив
 */
export function heapSort<T>(arr: Array<T>, comparator: (first: T, second: T) => number) {
	/**
	 * Используем обратный компаратор, т.к. для сортировки по возрастанию понадобится убывающая куча и наоборот
	 */
	const oppositeComparator = (first: T, second: T) => -comparator(first, second);

	/**
	 * Трансформируем произвольный массив в бинарную кучу
	 */
	for (let index = Math.floor(arr.length / 2); index >= 0; index--) {
		Heap.heapify<T>(arr, index, arr.length - 1, oppositeComparator);
	}

	let rightLimit = arr.length - 1;

	/**
	 * Справа от индекса rightLimit идет отсортированная часть массива
	 */
	while (rightLimit >= 0) {
		Heap.swap(arr, 0, rightLimit);
		Heap.heapify(arr, 0, rightLimit--, oppositeComparator);
	}

	return arr;
}
