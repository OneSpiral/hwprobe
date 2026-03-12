export interface KeyState {
	code: string;
	key: string;
	pressed: boolean;
	count: number;
}

/** Standard US QWERTY layout rows */
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

/** Short display label for a key code */
export function keyLabel(code: string): string {
	const map: Record<string, string> = {
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

	if (map[code]) return map[code];
	if (code.startsWith("Key")) return code.slice(3);
	return code;
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
