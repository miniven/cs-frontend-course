import type { IListNode } from './types';

/**
 * @class Класс узла списка.
 */
export class ListNode<T extends any = any> implements IListNode {
	value: T;
	next: ListNode | null = null;
	prev: ListNode | null = null;

	/**
	 * Создаёт узел с указанным значением и пустыми указателями на предыдущий и следующий узлы
	 *
	 * @param value Значение узла
	 */
	constructor(value: T) {
		this.value = value;
	}
}
