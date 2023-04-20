export interface IDoubleEndedQueue<T> {
	back: T;
	front: T;
	size: number;

	pushBack(value: T): void;
	pushFront(value: T): void;
	popBack(): T;
	popFront(): T;
}
