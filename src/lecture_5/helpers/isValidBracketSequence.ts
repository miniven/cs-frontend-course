/**
 * Проверяет, что у каждой из открывающих скобок, присутствующих в строке,
 * есть своя закрывающая пара и они стоят в правильной последовательности.
 *
 * @param str Строка для проверки
 * @returns Валидная ли строка
 */
export const isValidBracketSequence = (str: string): boolean => {
	const stack = [];
	const openings = ['[', '(', '{']; // Здесь всегда 3 скобки, поэтому на алг. сложность не влияет
	const mapClosingToOpening: Record<string, string> = {
		']': openings[0],
		')': openings[1],
		'}': openings[2],
	};

	for (const char of str) {
		const isOpening = openings.includes(char);

		if (isOpening) {
			stack.push(char);

			continue;
		}

		const suitableOpening = mapClosingToOpening[char];

		if (suitableOpening !== undefined) {
			const lastOpening = stack.pop();

			if (suitableOpening === lastOpening) {
				continue;
			} else {
				return false;
			}
		}
	}

	return stack.length === 0;
};
