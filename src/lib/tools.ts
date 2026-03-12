export interface Tool {
	slug: string;
	name: string;
	description: string;
	icon: string;
	keywords: string[];
}

export const tools: Tool[] = [
	{
		slug: "gamepad",
		name: "Gamepad Tester",
		description:
			"Test joystick deadzone, button mapping, vibration & drift detection for Xbox, PlayStation, Nintendo controllers.",
		icon: "gamepad-2",
		keywords: [
			"gamepad",
			"joystick",
			"controller",
			"deadzone",
			"drift",
			"xbox",
			"playstation",
		],
	},
	{
		slug: "keyboard",
		name: "Keyboard Tester",
		description:
			"Test every key on your keyboard. Detect ghosting, stuck keys, and key rollover. Visual layout display.",
		icon: "keyboard",
		keywords: [
			"keyboard",
			"key test",
			"ghosting",
			"rollover",
			"stuck key",
			"mechanical",
		],
	},
	{
		slug: "mouse",
		name: "Mouse Tester",
		description:
			"Test click speed (CPS), DPI accuracy, polling rate, scroll wheel, and button detection.",
		icon: "mouse",
		keywords: [
			"mouse",
			"click speed",
			"CPS",
			"DPI",
			"polling rate",
			"scroll",
		],
	},
	{
		slug: "monitor",
		name: "Monitor Tester",
		description:
			"Test refresh rate, dead pixels, color accuracy, response time, and screen uniformity.",
		icon: "monitor",
		keywords: [
			"monitor",
			"refresh rate",
			"dead pixel",
			"color",
			"response time",
			"display",
		],
	},
	{
		slug: "microphone",
		name: "Microphone Tester",
		description:
			"Test your microphone with real-time waveform, volume meter, frequency spectrum, and recording playback.",
		icon: "mic",
		keywords: [
			"microphone",
			"mic test",
			"audio input",
			"recording",
			"volume",
			"spectrum",
		],
	},
	{
		slug: "speakers",
		name: "Speaker Tester",
		description:
			"Test left/right channels, frequency range, bass response, and surround sound with tone generator.",
		icon: "volume-2",
		keywords: [
			"speaker",
			"audio",
			"left right",
			"channel",
			"frequency",
			"bass",
			"tone",
		],
	},
];
