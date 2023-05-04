import { Colors } from './types';

export function createPrefilledColors<T>(list: Map<T, any>): Map<T | void, Colors> {
	const colors = new Map();

	for (const [key] of list) {
		colors.set(key, Colors.WHITE);
	}

	return colors;
}
