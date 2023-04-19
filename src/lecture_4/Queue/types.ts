export interface IQueue<T extends any> {
	insert(value: T): void;
	remove(): T;
}
