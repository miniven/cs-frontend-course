import { isInRange } from '../helpers';
import { HIGH_SURROGATE_RANGE, LOW_SURROGATE_RANGE, UnicodeIteratorState } from './const';

/**
 * Возвращает итерируемый объект для итерации по строке с учётом суррогатных пар
 *
 * @param value Строка
 */
export function* createUnicodeSymbolsIterator(value: string): Iterable<string> {
	let high = '';
	let state = UnicodeIteratorState.EXPECT_ANY;

	for (let index = 0; index < value.length; index++) {
		const char = value[index];

		if (isInRange(char, HIGH_SURROGATE_RANGE)) {
			/**
			 * Если первый суррогат и мы не ожидаем второй, тогда запоминаем его и ожидаем второй
			 */
			if (state === UnicodeIteratorState.EXPECT_ANY) {
				high = char;
				state = UnicodeIteratorState.EXPECT_LOW;

				continue;
			}

			/**
			 * Если первый суррогат, а мы ожидали второй, то запоминаем текущий, а предыдущий выводим
			 */
			if (state === UnicodeIteratorState.EXPECT_LOW) {
				yield high;
				high = char;

				continue;
			}
		}

		if (isInRange(char, LOW_SURROGATE_RANGE)) {
			/**
			 * Если второй суррогат, а мы не планировали его получение, тогда просто выводим
			 */
			if (state === UnicodeIteratorState.EXPECT_ANY) {
				yield char;

				continue;
			}

			/**
			 * Если второй суррогат, и мы ожидали его получить, тогда склеиваем с первым и выводим
			 */
			if (state === UnicodeIteratorState.EXPECT_LOW) {
				yield high + char;

				high = '';
				state = UnicodeIteratorState.EXPECT_ANY;

				continue;
			}
		}

		/**
		 * Если не суррогат, а мы ранее получили первый суррогат и ожидали второй,
		 * тогда избавляемся от того, который запоминали
		 */
		if (state === UnicodeIteratorState.EXPECT_LOW) {
			yield high;
			high = '';
		}

		/**
		 * В любом случае нужно вывести не суррогатный символ
		 */
		yield char;
	}

	/**
	 * Если последний символ был первым суррогатом, то мы его еще не выводили.
	 * Надо вывести
	 */
	if (state === UnicodeIteratorState.EXPECT_LOW) {
		yield high;
	}
}
