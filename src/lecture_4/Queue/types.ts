export interface IQueue<T extends any> {
	head: T;
	size: number;

	insert(value: T): void;
	remove(): T;
}
