import { CAPACITY_RATE } from './const';
import { getClosestPrime, getObjectHash, getStringHash } from './helpers';

import type { TKey } from './types';

export class HashMap<T> {
	#buffer: Array<Array<[TKey, T]>>;
	#length = 0;

	/**
	 * Создаёт экземпляр класса HashMap
	 *
	 * @param capacity Начальная вместимость таблицы
	 * @param hash Функция хеширования, которая будет использоваться вместо стандартной
	 */
	constructor(capacity: number, hash?: (key: string | number) => number) {
		this.#buffer = new Array(capacity);

		if (hash) {
			this.hash = hash;
		}
	}

	/**
	 * Функция хеширования, которая используется по умолчанию
	 *
	 * @param key Ключ
	 * @returns Целое число
	 */
	private hash(key: TKey) {
		switch (typeof key) {
			case 'number': {
				return key;
			}
			case 'string': {
				return getStringHash(key);
			}
			case 'object': {
				return getObjectHash(key);
			}
			default: {
				return null;
			}
		}
	}

	/**
	 * Возвращает номер корзины для текущего хеша
	 *
	 * @param hash хеш
	 * @returns Номер корзины в границах текущего размера буфера
	 */
	#getBucketIndex(hash: number) {
		return hash % this.#buffer.length;
	}

	/**
	 * Создаёт новый массив большей длины и копирует в него все элементы,
	 * которые были в старом массиве, заново пересчитывая для них хеши и номера корзин
	 *
	 * @private
	 */
	#allocateBufferAttempt() {
		if (this.#length / this.#buffer.length < CAPACITY_RATE) {
			return;
		}

		const nextLength = getClosestPrime(Math.floor((this.#buffer.length * 3) / 2 + 1));
		const prevBuffer = this.#buffer;

		this.#buffer = new Array(nextLength);

		for (const bucket of prevBuffer) {
			if (bucket !== undefined) {
				for (const [key, value] of bucket) {
					this.set(key, value);
				}
			}
		}
	}

	/**
	 * Добавляет значение по указанному ключу
	 *
	 * @param key Ключ
	 * @param value Значение
	 */
	set(key: TKey, value: T) {
		const hash = this.hash(key);

		if (!hash) {
			return;
		}

		const index = this.#getBucketIndex(hash);

		/**
		 * Если не произошло коллизии, то просто создаём список и кладём в него элемент с ключом
		 */
		if (this.#buffer[index] === undefined) {
			this.#buffer[index] = [[key, value]];
			this.#length++;
			this.#allocateBufferAttempt();

			return;
		}

		/**
		 * Если произошла коллизия, то ищем элемент с таким ключом среди ранее добавленных и заменяем его
		 */
		const currentKeyIndex = this.#buffer[index].findIndex((element) => element[0] === key);

		if (currentKeyIndex >= 0) {
			this.#buffer[index][currentKeyIndex][1] = value;

			return;
		}

		/**
		 * Если коллизия была, но элемент с таким же ключом не добавлялся, то просто добавляем в список новый элемент
		 */
		this.#buffer[index].push([key, value]);
		this.#length++;
		this.#allocateBufferAttempt();
	}

	get(key: TKey) {
		const hash = this.hash(key);

		if (!hash) {
			return;
		}

		const index = this.#getBucketIndex(hash);

		if (this.#buffer[index] === undefined) {
			return;
		}

		return this.#buffer[index].find((element) => element[0] === key)?.[1];
	}

	get length() {
		return this.#length;
	}

	get buffer() {
		return this.#buffer;
	}
}
