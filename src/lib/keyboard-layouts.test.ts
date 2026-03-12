import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const keyboardPagePath = resolve(root, "src/routes/keyboard/+page.svelte");
const compatibilityPath = resolve(root, "COMPATIBILITY.md");

describe("keyboard locale-aware legends", () => {
	it("adds a layout selector and uses locale-aware legends on the keyboard page", () => {
		const page = readFileSync(keyboardPagePath, "utf8");
		expect(page).toContain("selectedLayout");
		expect(page).toContain("KEYBOARD_LAYOUTS");
		expect(page).toContain("keyLegend(code, selectedLayout)");
		expect(page).toContain("Keyboard layout");
		expect(page).toContain("Physical key detection still follows browser key codes");
	});

	it("documents browser limits for locale-aware legends", () => {
		const compatibility = readFileSync(compatibilityPath, "utf8").toLowerCase();
		expect(compatibility).toContain("physical key codes");
		expect(compatibility).toContain("printed legends");
		expect(compatibility).toContain("locale");
		expect(compatibility).toContain("approximate");
	});
});
