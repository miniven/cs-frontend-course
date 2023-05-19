import { isInRange } from '../helpers';
import { ARABIAN_DIGITS_RANGE, ROME_DIGITS_SET, State } from './const';

export const isDigit = (value: string) => {
	if (!value.length) {
		return false;
	}

	let state = State.DEFINITION;

	for (const char of value) {
		switch (state) {
			case State.DEFINITION: {
				if (isInRange(char, ARABIAN_DIGITS_RANGE)) {
					state = State.EXPECT_ARABIAN;

					break;
				}

				if (ROME_DIGITS_SET.has(char)) {
					state = State.EXPECT_ROMAN;

					break;
				}

				return false;
			}
			case State.EXPECT_ARABIAN: {
				if (isInRange(char, ARABIAN_DIGITS_RANGE)) {
					break;
				}

				return false;
			}
			case State.EXPECT_ROMAN: {
				if (ROME_DIGITS_SET.has(char)) {
					break;
				}

				return false;
			}
			default:
				return false;
		}
	}

	return true;
};
