export const isInRange = (char: string, range: readonly [number, number]) => {
	const codePoint = char.codePointAt(0);

	if (!codePoint) {
		return false;
	}

	return codePoint >= range[0] && codePoint <= range[1];
};
