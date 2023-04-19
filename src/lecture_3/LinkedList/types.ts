export interface IListNode<T extends any = any> {
	value: T;
	next: IListNode | null;
	prev: IListNode | null;
}

export interface ILinkedList<T> {
	head: IListNode<T> | null;
	tail: IListNode<T> | null;
	size: number;

	addFirst(value: T): this;
	addLast(value: T): this;
	removeFirst(): this;
	removeLast(): this;
	removeValue(value: T): this;
}
