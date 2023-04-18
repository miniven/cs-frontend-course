export interface IListNode<T extends any = any> {
	value: T;
	next: IListNode | null;
	prev: IListNode | null;
}

export interface ILinkedList {
	head: IListNode | null;
	tail: IListNode | null;
	size: number;

	add(value: string | number | boolean): this;
	remove(value: string | number | boolean): this;
}
