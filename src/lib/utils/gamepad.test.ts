import { describe, it, expect } from "vitest";
import { BUTTON_LABELS, calcDeadzone, axisToPixel } from "./gamepad";

describe("gamepad utils", () => {
	describe("BUTTON_LABELS", () => {
		it("has standard 17 button labels", () => {
			expect(BUTTON_LABELS).toHaveLength(17);
		});

		it("starts with A, B, X, Y", () => {
			expect(BUTTON_LABELS[0]).toBe("A");
			expect(BUTTON_LABELS[1]).toBe("B");
			expect(BUTTON_LABELS[2]).toBe("X");
			expect(BUTTON_LABELS[3]).toBe("Y");
		});
	});

	describe("calcDeadzone", () => {
		it("returns 0 for centered axis", () => {
			expect(calcDeadzone(0)).toBe(0);
		});

		it("returns 100 for fully pushed axis", () => {
			expect(calcDeadzone(1)).toBe(100);
			expect(calcDeadzone(-1)).toBe(100);
		});

		it("returns percentage for partial values", () => {
			expect(calcDeadzone(0.5)).toBe(50);
			expect(calcDeadzone(-0.25)).toBe(25);
		});
	});

	describe("axisToPixel", () => {
		it("maps center (0) to half the size", () => {
			expect(axisToPixel(0, 100)).toBe(50);
		});

		it("maps -1 to 0", () => {
			expect(axisToPixel(-1, 100)).toBe(0);
		});

		it("maps +1 to full size", () => {
			expect(axisToPixel(1, 100)).toBe(100);
		});

		it("works with arbitrary size", () => {
			expect(axisToPixel(0, 200)).toBe(100);
			expect(axisToPixel(0.5, 120)).toBe(90);
		});
	});
});
