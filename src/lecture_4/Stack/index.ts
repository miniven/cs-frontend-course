import { defaultDecoder, defaultEncoder } from './helpers';
import type { TTypedArray, TTypedArrayConstructor } from './types';

export class Stack<T> {
	#stack: TTypedArray;
	#encoder;
	#decoder;
	#pointer = -1;

	/**
	 * Создаёт экземпляр стека.
	 * Элементы будут кодироваться в двоичный формат. По умолчанию поддерживается работа только с числами.
	 * Если планируется работа с другими типами, то 3 и 4 параметрами передаются функции для кодирования и декодирования данных нужных типов
	 *
	 * @param TypedArray Типизированный массив, который ляжет в основу стека
	 * @param size Размер стека в элементах
	 * @param encoder Функция для кодирования данных в двоичный формат
	 * @param decoder Функция для декодирования данных из двоичного формата
	 */
	constructor(
		TypedArray: TTypedArrayConstructor,
		size: number,
		encoder: (value: T) => number = defaultEncoder,
		decoder: (value: number) => T = defaultDecoder
	) {
		this.#stack = new TypedArray(size);
		this.#encoder = encoder;
		this.#decoder = decoder;
	}

	/**
	 * Добавляет в стек закодированное в двоичный вид значение
	 *
	 * @param value Значение, которое будет добавлено в стек
	 */
	push(value: T) {
		if (this.#pointer === this.#stack.length - 1) {
			throw new Error('Stack is full');
		}

		this.#stack[++this.#pointer] = this.#encoder(value);
	}

	/**
	 * Извлекает из стека значение и возвращает в раскодированном виде
	 *
	 * @return Извлеченное значение
	 */
	pop(): T {
		if (this.#pointer < 0) {
			throw new Error('Stack is empty');
		}

		const value = this.#stack[this.#pointer--];

		return this.#decoder(value);
	}

	/**
	 * Геттер для значения, находящегося на вершине стека
	 */
	get head(): T {
		const value = this.#stack[this.#pointer];

		return this.#decoder(value);
	}
}
