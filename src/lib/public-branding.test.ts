import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const files = [
	"src/app.html",
	"src/lib/components/nav.svelte",
	"src/routes/+page.svelte",
	"src/routes/gamepad/+page.svelte",
	"src/routes/keyboard/+page.svelte",
	"src/routes/mouse/+page.svelte",
	"src/routes/monitor/+page.svelte",
	"src/routes/microphone/+page.svelte",
	"src/routes/speakers/+page.svelte",
];

describe("public branding boundary", () => {
	it("keeps the public toolkit UI free of HWProbe product branding", () => {
		for (const file of files) {
			const content = readFileSync(resolve(root, file), "utf8");
			expect(content).not.toContain("HWProbe");
		}
	});
});
