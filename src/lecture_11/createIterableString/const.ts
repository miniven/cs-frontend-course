export const HIGH_SURROGATE_RANGE: [number, number] = [0xd800, 0xdbff];
export const LOW_SURROGATE_RANGE: [number, number] = [0xdc00, 0xdfff];

export enum State {
	EXPECT_ANY,
	EXPECT_LOW,
}
