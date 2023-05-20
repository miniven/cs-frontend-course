export const HIGH_SURROGATE_RANGE = [0xd800, 0xdbff] as const;
export const LOW_SURROGATE_RANGE = [0xdc00, 0xdfff] as const;

export const EMOJI_SET_1_RANGE = [0x1f300, 0x1f5ff] as const;
export const EMOJI_SET_2_RANGE = [0x1f910, 0x1f96c] as const;
export const EMOJI_SET_3_RANGE = [0x1f980, 0x1f9e6] as const;
export const EMOJI_SET_4_RANGE = [0x1f600, 0x1f64f] as const;

export const SKIN_COLORS_SET_RANGE = [0x1f3fb, 0x1f3ff] as const;
export const VARIATION_SELECTORS_RANGE = [0xfe00, 0xfe0f] as const;
export const DIACRITICAL_MARKS_SET_RANGE = [0x0300, 0x036f] as const;
export const JOINER_RANGE = [0x200d, 0x200d] as const;
export const DINGBATS_SET_RANGE = [0x2700, 0x27bf] as const;

export enum UnicodeIteratorState {
	EXPECT_ANY,
	EXPECT_LOW,
}

export enum GraphemesIteratorState {
	INITIAL,
	REGULAT_OUTPUT,
	COLLECTING_EMOJI,
	COLLECTING_LETTER,
}
