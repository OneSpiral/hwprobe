/** Standard gamepad button labels (Xbox layout) */
export const BUTTON_LABELS = [
	"A",
	"B",
	"X",
	"Y",
	"LB",
	"RB",
	"LT",
	"RT",
	"Back",
	"Start",
	"LS",
	"RS",
	"Up",
	"Down",
	"Left",
	"Right",
	"Home",
] as const;

export type GamepadHapticsMode = "vibrationActuator" | "hapticActuators" | "none";

export interface GamepadHapticsCapability {
	supported: boolean;
	mode: GamepadHapticsMode;
	actuatorType: string | null;
}

export interface GamepadSnapshot {
	id: string;
	index: number;
	buttons: { pressed: boolean; value: number }[];
	axes: number[];
	timestamp: number;
	haptics: GamepadHapticsCapability;
}

interface GamepadHapticActuatorLike {
	type?: string;
	playEffect?: (
		effectType: string,
		params: {
			duration: number;
			startDelay?: number;
			strongMagnitude?: number;
			weakMagnitude?: number;
		},
	) => Promise<unknown> | unknown;
	pulse?: (value: number, duration: number) => Promise<unknown> | unknown;
}

type ExtendedGamepad = Gamepad & {
	vibrationActuator?: GamepadHapticActuatorLike | null;
	hapticActuators?: GamepadHapticActuatorLike[] | null;
};

function snapshotGamepad(gamepad: Gamepad): GamepadSnapshot {
	return {
		id: gamepad.id,
		index: gamepad.index,
		buttons: gamepad.buttons.map((b) => ({ pressed: b.pressed, value: b.value })),
		axes: gamepad.axes.map((a) => a),
		timestamp: gamepad.timestamp,
		haptics: resolveGamepadHapticsCapability(gamepad),
	};
}

/** Read current state of a connected gamepad */
export function readGamepad(index: number): GamepadSnapshot | null {
	const gp = navigator.getGamepads()[index];
	if (!gp) return null;
	return snapshotGamepad(gp);
}

/** Read snapshots for all currently connected gamepads */
export function readConnectedGamepads(): GamepadSnapshot[] {
	return Array.from(navigator.getGamepads())
		.filter((gamepad): gamepad is Gamepad => gamepad !== null)
		.map(snapshotGamepad);
}

/** Resolve the active controller from the current connected snapshots */
export function resolveActiveGamepad(
	snapshots: GamepadSnapshot[],
	selectedIndex: number | null,
): GamepadSnapshot | null {
	if (snapshots.length === 0) return null;
	if (selectedIndex !== null) {
		const selected = snapshots.find((snapshot) => snapshot.index === selectedIndex);
		if (selected) return selected;
	}
	return snapshots[0];
}

export function resolveGamepadHapticsCapability(gamepad: Gamepad): GamepadHapticsCapability {
	const extendedGamepad = gamepad as ExtendedGamepad;

	if (extendedGamepad.vibrationActuator) {
		return {
			supported: true,
			mode: "vibrationActuator",
			actuatorType: extendedGamepad.vibrationActuator.type ?? null,
		};
	}

	if (Array.isArray(extendedGamepad.hapticActuators) && extendedGamepad.hapticActuators.length > 0) {
		return {
			supported: true,
			mode: "hapticActuators",
			actuatorType: extendedGamepad.hapticActuators[0]?.type ?? null,
		};
	}

	return {
		supported: false,
		mode: "none",
		actuatorType: null,
	};
}

function resolveGamepadActuator(gamepad: Gamepad): GamepadHapticActuatorLike | null {
	const extendedGamepad = gamepad as ExtendedGamepad;
	if (extendedGamepad.vibrationActuator) return extendedGamepad.vibrationActuator;
	if (Array.isArray(extendedGamepad.hapticActuators) && extendedGamepad.hapticActuators.length > 0) {
		return extendedGamepad.hapticActuators[0] ?? null;
	}
	return null;
}

export async function triggerGamepadHaptics(index: number): Promise<boolean> {
	const gamepad = navigator.getGamepads()[index];
	if (!gamepad) return false;

	const actuator = resolveGamepadActuator(gamepad);
	if (!actuator) return false;

	try {
		if (typeof actuator.playEffect === "function") {
			await actuator.playEffect("dual-rumble", {
				duration: 250,
				startDelay: 0,
				strongMagnitude: 1,
				weakMagnitude: 0.75,
			});
			return true;
		}

		if (typeof actuator.pulse === "function") {
			await actuator.pulse(1, 250);
			return true;
		}
	} catch {
		return false;
	}

	return false;
}

/** Calculate deadzone percentage from axis values */
export function calcDeadzone(axisValue: number): number {
	return Math.round(Math.abs(axisValue) * 100);
}

/** Map axis value to pixel position in a square area */
export function axisToPixel(
	axisValue: number,
	size: number,
): number {
	return ((axisValue + 1) / 2) * size;
}
