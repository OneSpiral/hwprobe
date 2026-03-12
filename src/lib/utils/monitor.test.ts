import { describe, expect, it } from "vitest";
import { motionPatternDurationMs, motionPatternTravelPx } from "./monitor";

describe("monitor utils", () => {
	it("computes travel distance that fully clears the viewport", () => {
		expect(motionPatternTravelPx(1920, 96)).toBe(2016);
		expect(motionPatternTravelPx(800, 120)).toBe(920);
	});

	it("computes animation duration from travel distance and speed", () => {
		expect(motionPatternDurationMs(2000, 500)).toBe(4000);
		expect(motionPatternDurationMs(960, 240)).toBe(4000);
	});

	it("fails safely for zero or negative speeds", () => {
		expect(motionPatternDurationMs(1200, 0)).toBe(0);
		expect(motionPatternDurationMs(1200, -50)).toBe(0);
	});
});
