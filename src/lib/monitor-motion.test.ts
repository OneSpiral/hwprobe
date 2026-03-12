import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const monitorPagePath = resolve(root, "src/routes/monitor/+page.svelte");
const measurementLimitsPath = resolve(root, "MEASUREMENT_LIMITS.md");

describe("monitor motion and ghosting utility", () => {
	it("adds a motion and ghosting fullscreen pattern with adjustable speed", () => {
		const page = readFileSync(monitorPagePath, "utf8");
		expect(page).toContain("Motion & Ghosting");
		expect(page).toContain('enterFullscreen("motion-ghosting")');
		expect(page).toContain("motionPatternDurationMs");
		expect(page).toContain("ghostingSpeedPxPerSecond");
		expect(page).toContain("Run Motion Pattern");
		expect(page).toContain("Ghosting speed");
	});

	it("documents motion and ghosting interpretation caveats", () => {
		const measurement = readFileSync(measurementLimitsPath, "utf8").toLowerCase();
		expect(measurement).toContain("ghosting");
		expect(measurement).toContain("motion");
		expect(measurement).toContain("compositor");
		expect(measurement).toContain("sample-and-hold");
	});
});
