import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const gamepadPagePath = resolve(root, "src/routes/gamepad/+page.svelte");
const compatibilityPath = resolve(root, "COMPATIBILITY.md");

describe("gamepad haptics diagnostics", () => {
	it("surfaces haptics capability and a safe test action in the gamepad page", () => {
		const page = readFileSync(gamepadPagePath, "utf8");
		expect(page).toContain("Haptics & Vibration");
		expect(page).toContain("triggerGamepadHaptics");
		expect(page).toContain("haptics.supported");
		expect(page).toContain("Run Test Pulse");
		expect(page).toContain("hapticsMessage");
	});

	it("documents haptics caveats in the compatibility guide", () => {
		const compatibility = readFileSync(compatibilityPath, "utf8").toLowerCase();
		expect(compatibility).toContain("haptics");
		expect(compatibility).toContain("vibration");
		expect(compatibility).toContain("dual-rumble");
	});
});
