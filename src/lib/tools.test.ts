import { describe, it, expect } from "vitest";
import { tools } from "./tools";

describe("tools", () => {
	it("has 6 tools", () => {
		expect(tools).toHaveLength(6);
	});

	it("each tool has required fields", () => {
		for (const tool of tools) {
			expect(tool.slug).toBeTruthy();
			expect(tool.name).toBeTruthy();
			expect(tool.description).toBeTruthy();
			expect(tool.icon).toBeTruthy();
			expect(tool.keywords.length).toBeGreaterThan(0);
		}
	});

	it("has unique slugs", () => {
		const slugs = tools.map((t) => t.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("includes gamepad as first tool", () => {
		expect(tools[0].slug).toBe("gamepad");
	});
});
