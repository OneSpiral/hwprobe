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

export interface GamepadSnapshot {
	id: string;
	index: number;
	buttons: { pressed: boolean; value: number }[];
	axes: number[];
	timestamp: number;
}

/** Read current state of a connected gamepad */
export function readGamepad(index: number): GamepadSnapshot | null {
	const gp = navigator.getGamepads()[index];
	if (!gp) return null;

	return {
		id: gp.id,
		index: gp.index,
		buttons: gp.buttons.map((b) => ({ pressed: b.pressed, value: b.value })),
		axes: gp.axes.map((a) => a),
		timestamp: gp.timestamp,
	};
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
