import { isInRange } from '../helpers';
import {
	DIACRITICAL_MARKS_SET_RANGE,
	DINGBATS_SET_RANGE,
	EMOJI_SET_1_RANGE,
	EMOJI_SET_2_RANGE,
	EMOJI_SET_3_RANGE,
	EMOJI_SET_4_RANGE,
	GraphemesIteratorState,
	JOINER_RANGE,
	SKIN_COLORS_SET_RANGE,
	VARIATION_SELECTORS_RANGE,
} from './const';

export function* createGraphemesIterator(value: string): Iterable<string> {
	if (value.length === 0) {
		return;
	}

	let grapheme: string[] = [];
	let state = GraphemesIteratorState.INITIAL;

	function releaseGrapheme() {
		const result = grapheme.join('');

		grapheme = [];

		return result;
	}

	for (const char of value) {
		if (
			isInRange(char, SKIN_COLORS_SET_RANGE) ||
			isInRange(char, JOINER_RANGE) ||
			isInRange(char, VARIATION_SELECTORS_RANGE)
		) {
			/**
			 * Если это первый символ в emoji-графеме, тогда отдаём, чтобы было сохранено раньше,
			 * сохраняем этот символ первым и считаем, что еще не начали собирать никакой emoji-графемы
			 */
			if (state === GraphemesIteratorState.COLLECTING_LETTER || state === GraphemesIteratorState.REGULAT_OUTPUT) {
				yield releaseGrapheme();

				state = GraphemesIteratorState.REGULAT_OUTPUT;
			}

			grapheme.push(char);

			continue;
		}

		if (
			isInRange(char, EMOJI_SET_1_RANGE) ||
			isInRange(char, EMOJI_SET_2_RANGE) ||
			isInRange(char, EMOJI_SET_3_RANGE) ||
			isInRange(char, EMOJI_SET_4_RANGE) ||
			isInRange(char, DINGBATS_SET_RANGE)
		) {
			/**
			 * Если встретили emoji в процессе создания буквы с диакритическими знаками,
			 * то считаем, что предыдущая графема закончилась и выводим
			 */
			if (state === GraphemesIteratorState.COLLECTING_LETTER || state === GraphemesIteratorState.REGULAT_OUTPUT) {
				yield releaseGrapheme();
			}

			state = GraphemesIteratorState.COLLECTING_EMOJI;
			grapheme.push(char);

			continue;
		}

		if (isInRange(char, DIACRITICAL_MARKS_SET_RANGE)) {
			/**
			 * Если встретили диакритический знак в процессе создания emoji,
			 * то считаем, что предыдущая графема закончилась и выводим
			 */
			if (state === GraphemesIteratorState.COLLECTING_EMOJI) {
				yield releaseGrapheme();
			}

			state = GraphemesIteratorState.COLLECTING_LETTER;
			grapheme.push(char);

			continue;
		}

		/**
		 * Если дошли сюда, значит встретили обычную букву, а значит предыдущую графему надо вывести
		 */
		if (state !== GraphemesIteratorState.INITIAL) {
			yield releaseGrapheme();
		}

		state = GraphemesIteratorState.REGULAT_OUTPUT;
		grapheme.push(char);
	}

	yield releaseGrapheme();
}
