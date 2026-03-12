import { afterEach, describe, expect, it, vi } from "vitest";
import {
	createGamepadButtonStub,
	createGamepadStub,
	restoreBrowserMocks,
	stubNavigatorGamepads,
} from "../test-fixtures/browser";
import {
	BUTTON_LABELS,
	axisToPixel,
	calcDeadzone,
	readConnectedGamepads,
	resolveActiveGamepad,
	resolveGamepadHapticsCapability,
	triggerGamepadHaptics,
	type GamepadSnapshot,
} from "./gamepad";

afterEach(() => {
	restoreBrowserMocks();
});

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

	describe("readConnectedGamepads", () => {
		it("returns snapshots for all connected controller slots", () => {
			stubNavigatorGamepads([
				createGamepadStub({
					id: "Pad A",
					index: 0,
					buttons: [createGamepadButtonStub({ pressed: true, value: 1 })],
					axes: [0.25, -0.5],
					timestamp: 10,
				}),
				null,
				createGamepadStub({
					id: "Pad B",
					index: 2,
					buttons: [createGamepadButtonStub()],
					axes: [0, 1],
					timestamp: 20,
				}),
			]);

			const snapshots = readConnectedGamepads();
			expect(snapshots).toHaveLength(2);
			expect(snapshots[0]).toMatchObject({ id: "Pad A", index: 0, axes: [0.25, -0.5] });
			expect(snapshots[1]).toMatchObject({ id: "Pad B", index: 2, axes: [0, 1] });
		});
	});

	describe("resolveActiveGamepad", () => {
		const snapshots: GamepadSnapshot[] = [
			{
				id: "Pad A",
				index: 0,
				buttons: [],
				axes: [],
				timestamp: 1,
				haptics: { supported: false, mode: "none", actuatorType: null },
			},
			{
				id: "Pad B",
				index: 2,
				buttons: [],
				axes: [],
				timestamp: 2,
				haptics: { supported: false, mode: "none", actuatorType: null },
			},
		];

		it("returns the selected controller when its slot is still connected", () => {
			expect(resolveActiveGamepad(snapshots, 2)?.id).toBe("Pad B");
		});

		it("falls back to the first connected controller when the selected slot disappears", () => {
			expect(resolveActiveGamepad(snapshots, 5)?.id).toBe("Pad A");
		});

		it("returns null when no controllers are connected", () => {
			expect(resolveActiveGamepad([], 0)).toBeNull();
		});
	});

	describe("resolveGamepadHapticsCapability", () => {
		it("detects vibrationActuator support when exposed", () => {
			const capability = resolveGamepadHapticsCapability(
				createGamepadStub({
					vibrationActuator: {
						type: "dual-rumble",
						playEffect: async () => "complete",
					},
				}),
			);

			expect(capability).toEqual({
				supported: true,
				mode: "vibrationActuator",
				actuatorType: "dual-rumble",
			});
		});

		it("falls back to hapticActuators arrays when present", () => {
			const capability = resolveGamepadHapticsCapability(
				createGamepadStub({
					hapticActuators: [{ type: "vibration" }],
					vibrationActuator: null,
				}),
			);

			expect(capability).toEqual({
				supported: true,
				mode: "hapticActuators",
				actuatorType: "vibration",
			});
		});

		it("returns none when the controller does not expose haptics", () => {
			expect(resolveGamepadHapticsCapability(createGamepadStub())).toEqual({
				supported: false,
				mode: "none",
				actuatorType: null,
			});
		});
	});

	describe("triggerGamepadHaptics", () => {
		it("uses vibrationActuator.playEffect when available", async () => {
			const playEffect = vi.fn(async () => "complete");
			stubNavigatorGamepads([
				createGamepadStub({
					index: 0,
					vibrationActuator: {
						type: "dual-rumble",
						playEffect,
					},
				}),
			]);

			await expect(triggerGamepadHaptics(0)).resolves.toBe(true);
			expect(playEffect).toHaveBeenCalled();
		});

		it("fails safely when the selected controller has no haptics support", async () => {
			stubNavigatorGamepads([createGamepadStub({ index: 0 })]);
			await expect(triggerGamepadHaptics(0)).resolves.toBe(false);
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
