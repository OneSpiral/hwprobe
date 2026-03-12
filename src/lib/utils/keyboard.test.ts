import { describe, it, expect } from "vitest";
import { KEYBOARD_LAYOUTS, KEYBOARD_ROWS, keyLabel, keyLegend, keyWidth } from "./keyboard";

describe("keyboard utils", () => {
	describe("KEYBOARD_LAYOUTS", () => {
		it("exposes a small set of common layout presets", () => {
			expect(KEYBOARD_LAYOUTS.map((layout) => layout.id)).toEqual([
				"ansi-us",
				"iso-uk",
				"iso-de",
				"iso-fr",
			]);
		});
	});

	describe("KEYBOARD_ROWS", () => {
		it("has 6 rows", () => {
			expect(KEYBOARD_ROWS).toHaveLength(6);
		});

		it("first row is function keys starting with Escape", () => {
			expect(KEYBOARD_ROWS[0][0]).toBe("Escape");
			expect(KEYBOARD_ROWS[0]).toHaveLength(13);
		});

		it("contains Space in last row", () => {
			expect(KEYBOARD_ROWS[5]).toContain("Space");
		});
	});

	describe("keyLabel", () => {
		it("returns Esc for Escape", () => {
			expect(keyLabel("Escape")).toBe("Esc");
		});

		it("strips Key prefix for letter keys", () => {
			expect(keyLabel("KeyA")).toBe("A");
			expect(keyLabel("KeyZ")).toBe("Z");
		});

		it("returns digit for Digit codes", () => {
			expect(keyLabel("Digit1")).toBe("1");
			expect(keyLabel("Digit0")).toBe("0");
		});

		it("returns special symbols", () => {
			expect(keyLabel("Minus")).toBe("-");
			expect(keyLabel("Equal")).toBe("=");
			expect(keyLabel("Backspace")).toBe("⌫");
		});

		it("falls back to code for unknown keys", () => {
			expect(keyLabel("SomeWeirdKey")).toBe("SomeWeirdKey");
		});
	});

	describe("keyLegend", () => {
		it("uses US legends by default", () => {
			expect(keyLegend("KeyA", "ansi-us")).toBe("A");
			expect(keyLegend("Minus", "ansi-us")).toBe("-");
		});

		it("renders UK-specific legends where they differ", () => {
			expect(keyLegend("Quote", "iso-uk")).toBe("@");
			expect(keyLegend("Backquote", "iso-uk")).toBe("¬");
		});

		it("renders German QWERTZ legends where they differ", () => {
			expect(keyLegend("KeyY", "iso-de")).toBe("Z");
			expect(keyLegend("KeyZ", "iso-de")).toBe("Y");
			expect(keyLegend("Semicolon", "iso-de")).toBe("Ö");
		});

		it("renders French AZERTY legends where they differ", () => {
			expect(keyLegend("KeyQ", "iso-fr")).toBe("A");
			expect(keyLegend("KeyA", "iso-fr")).toBe("Q");
			expect(keyLegend("KeyW", "iso-fr")).toBe("Z");
		});
	});

	describe("keyWidth", () => {
		it("returns 1 for regular keys", () => {
			expect(keyWidth("KeyA")).toBe(1);
			expect(keyWidth("Digit1")).toBe(1);
		});

		it("returns wider for special keys", () => {
			expect(keyWidth("Backspace")).toBe(2);
			expect(keyWidth("Space")).toBe(6.25);
			expect(keyWidth("ShiftLeft")).toBe(2.25);
			expect(keyWidth("Enter")).toBe(2.25);
		});
	});
});
