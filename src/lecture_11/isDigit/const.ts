export const ARABIAN_DIGITS_RANGE: [number, number] = [48, 57];
export const ROME_DIGITS_SET = new Set(['I', 'V', 'X', 'L', 'C', 'D', 'M']);

export enum State {
	DEFINITION,
	EXPECT_ARABIAN,
	EXPECT_ROMAN,
}
