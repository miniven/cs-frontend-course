export const defaultEncoder = <T>(value: T): number => {
	if (typeof value === 'number') {
		return value;
	}

	return 0;
};

export const defaultDecoder = <T>(value: number): T => {
	return value as T;
};
