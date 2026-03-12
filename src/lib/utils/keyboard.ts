export interface KeyState {
	code: string;
	key: string;
	pressed: boolean;
	count: number;
}

export type KeyboardLayoutId = "ansi-us" | "iso-uk" | "iso-de" | "iso-fr";

export interface KeyboardLayoutOption {
	id: KeyboardLayoutId;
	label: string;
	description: string;
}

/** Physical keyboard grid used by the tester. Printed legends can vary by locale. */
export const KEYBOARD_ROWS: string[][] = [
	[
		"Escape",
		"F1",
		"F2",
		"F3",
		"F4",
		"F5",
		"F6",
		"F7",
		"F8",
		"F9",
		"F10",
		"F11",
		"F12",
	],
	[
		"Backquote",
		"Digit1",
		"Digit2",
		"Digit3",
		"Digit4",
		"Digit5",
		"Digit6",
		"Digit7",
		"Digit8",
		"Digit9",
		"Digit0",
		"Minus",
		"Equal",
		"Backspace",
	],
	[
		"Tab",
		"KeyQ",
		"KeyW",
		"KeyE",
		"KeyR",
		"KeyT",
		"KeyY",
		"KeyU",
		"KeyI",
		"KeyO",
		"KeyP",
		"BracketLeft",
		"BracketRight",
		"Backslash",
	],
	[
		"CapsLock",
		"KeyA",
		"KeyS",
		"KeyD",
		"KeyF",
		"KeyG",
		"KeyH",
		"KeyJ",
		"KeyK",
		"KeyL",
		"Semicolon",
		"Quote",
		"Enter",
	],
	[
		"ShiftLeft",
		"KeyZ",
		"KeyX",
		"KeyC",
		"KeyV",
		"KeyB",
		"KeyN",
		"KeyM",
		"Comma",
		"Period",
		"Slash",
		"ShiftRight",
	],
	[
		"ControlLeft",
		"MetaLeft",
		"AltLeft",
		"Space",
		"AltRight",
		"MetaRight",
		"ControlRight",
	],
];

export const KEYBOARD_LAYOUTS: KeyboardLayoutOption[] = [
	{
		id: "ansi-us",
		label: "English (US)",
		description: "ANSI-style US QWERTY legends",
	},
	{
		id: "iso-uk",
		label: "English (UK)",
		description: "UK legends on a QWERTY layout",
	},
	{
		id: "iso-de",
		label: "Deutsch (DE)",
		description: "German QWERTZ legends",
	},
	{
		id: "iso-fr",
		label: "Français (FR)",
		description: "French AZERTY legends",
	},
];

const BASE_LABELS: Record<string, string> = {
	Escape: "Esc",
	Backquote: "`",
	Digit1: "1",
	Digit2: "2",
	Digit3: "3",
	Digit4: "4",
	Digit5: "5",
	Digit6: "6",
	Digit7: "7",
	Digit8: "8",
	Digit9: "9",
	Digit0: "0",
	Minus: "-",
	Equal: "=",
	Backspace: "⌫",
	Tab: "Tab",
	BracketLeft: "[",
	BracketRight: "]",
	Backslash: "\\",
	CapsLock: "Caps",
	Semicolon: ";",
	Quote: "'",
	Enter: "Enter",
	ShiftLeft: "⇧ L",
	ShiftRight: "⇧ R",
	ControlLeft: "Ctrl L",
	ControlRight: "Ctrl R",
	MetaLeft: "⌘ L",
	MetaRight: "⌘ R",
	AltLeft: "Alt L",
	AltRight: "Alt R",
	Space: "Space",
};

const LAYOUT_OVERRIDES: Record<KeyboardLayoutId, Record<string, string>> = {
	"ansi-us": {},
	"iso-uk": {
		Backquote: "¬",
		Digit2: '"',
		Digit3: "£",
		Quote: "@",
		Backslash: "#",
	},
	"iso-de": {
		Backquote: "^",
		Minus: "ß",
		Equal: "´",
		KeyY: "Z",
		KeyZ: "Y",
		BracketLeft: "Ü",
		BracketRight: "+",
		Backslash: "#",
		Semicolon: "Ö",
		Quote: "Ä",
		Slash: "-",
	},
	"iso-fr": {
		Backquote: "²",
		Digit1: "&",
		Digit2: "é",
		Digit3: '"',
		Digit4: "'",
		Digit5: "(",
		Digit6: "-",
		Digit7: "è",
		Digit8: "_",
		Digit9: "ç",
		Digit0: "à",
		Minus: ")",
		Equal: "=",
		KeyQ: "A",
		KeyW: "Z",
		KeyA: "Q",
		KeyZ: "W",
		BracketLeft: "^",
		BracketRight: "$",
		Semicolon: "M",
		Quote: "Ù",
		KeyM: ",",
		Comma: ";",
		Period: ":",
		Slash: "!",
	},
};

/** Locale-aware legend for a physical key code. */
export function keyLegend(code: string, layout: KeyboardLayoutId): string {
	const override = LAYOUT_OVERRIDES[layout]?.[code];
	if (override) return override;
	if (BASE_LABELS[code]) return BASE_LABELS[code];
	if (code.startsWith("Key")) return code.slice(3);
	return code;
}

/** Backwards-compatible US legend for a key code. */
export function keyLabel(code: string): string {
	return keyLegend(code, "ansi-us");
}

/** Width multiplier for special keys */
export function keyWidth(code: string): number {
	const wide: Record<string, number> = {
		Backspace: 2,
		Tab: 1.5,
		Backslash: 1.5,
		CapsLock: 1.75,
		Enter: 2.25,
		ShiftLeft: 2.25,
		ShiftRight: 2.75,
		ControlLeft: 1.25,
		ControlRight: 1.25,
		MetaLeft: 1.25,
		MetaRight: 1.25,
		AltLeft: 1.25,
		AltRight: 1.25,
		Space: 6.25,
	};
	return wide[code] ?? 1;
}
