export const MOTION_GHOSTING_SPEEDS = [240, 480, 960, 1440] as const;

export function motionPatternTravelPx(viewportWidth: number, barWidth: number): number {
	return Math.max(0, viewportWidth + barWidth);
}

export function motionPatternDurationMs(
	travelPx: number,
	speedPxPerSecond: number,
): number {
	if (speedPxPerSecond <= 0) return 0;
	return Math.round((travelPx / speedPxPerSecond) * 1000);
}
