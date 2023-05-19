export const isInRange = (char: string, range: [number, number]) => {
	return char.charCodeAt(0) >= range[0] && char.charCodeAt(0) <= range[1];
};
