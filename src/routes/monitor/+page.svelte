<script lang="ts">
	import { onMount } from "svelte";
	import { Monitor, Maximize, X } from "lucide-svelte";
	import {
		MOTION_GHOSTING_SPEEDS,
		motionPatternDurationMs,
		motionPatternTravelPx,
	} from "$lib/utils/monitor";

	let fps = $state(0);
	let fpsHistory = $state<number[]>([]);
	let frameCount = 0;
	let lastTime = 0;
	let animFrame = 0;
	let fullscreenMode = $state<string | null>(null);
	let ghostingSpeedPxPerSecond = $state<(typeof MOTION_GHOSTING_SPEEDS)[number]>(960);
	let screenWidth = $state(0);
	let screenHeight = $state(0);
	let viewportWidth = $state(0);
	let viewportHeight = $state(0);
	let pixelRatio = $state(1);
	let colorDepth = $state(24);

	const DEAD_PIXEL_COLORS = [
		{ name: "White", color: "#ffffff" },
		{ name: "Black", color: "#000000" },
		{ name: "Red", color: "#ff0000" },
		{ name: "Green", color: "#00ff00" },
		{ name: "Blue", color: "#0000ff" },
	];
	const MOTION_BAR_WIDTH = 96;

	function measureFps(timestamp: number) {
		frameCount++;
		if (timestamp - lastTime >= 1000) {
			fps = frameCount;
			fpsHistory = [...fpsHistory.slice(-59), frameCount];
			frameCount = 0;
			lastTime = timestamp;
		}
		animFrame = requestAnimationFrame(measureFps);
	}

	function enterFullscreen(mode: string) {
		fullscreenMode = mode;
		document.documentElement.requestFullscreen?.();
	}

	function exitFullscreen() {
		fullscreenMode = null;
		document.exitFullscreen?.();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape" && fullscreenMode) {
			fullscreenMode = null;
		}
	}

	function updateDisplayMetrics() {
		screenWidth = screen.width;
		screenHeight = screen.height;
		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;
		pixelRatio = window.devicePixelRatio;
		colorDepth = screen.colorDepth;
	}

	onMount(() => {
		lastTime = performance.now();
		animFrame = requestAnimationFrame(measureFps);
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("resize", updateDisplayMetrics);

		updateDisplayMetrics();

		return () => {
			cancelAnimationFrame(animFrame);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("resize", updateDisplayMetrics);
		};
	});

	const motionTravelPx = $derived(
		motionPatternTravelPx(viewportWidth || screenWidth || 1920, MOTION_BAR_WIDTH),
	);
	const motionDuration = $derived(
		motionPatternDurationMs(motionTravelPx, ghostingSpeedPxPerSecond),
	);
	const avgFps = $derived(
		fpsHistory.length > 0
			? Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length)
			: 0,
	);
	const maxFps = $derived(fpsHistory.length > 0 ? Math.max(...fpsHistory) : 0);
</script>

<svelte:head>
	<title>Monitor Tester — Browser Hardware Diagnostics</title>
	<meta
		name="description"
		content="Test your monitor refresh rate, dead pixels, and color display. Free online display testing tool."
	/>
</svelte:head>

{#if fullscreenMode}
	<!-- Fullscreen overlay -->
	{#if fullscreenMode === "dead-pixel"}
		<div class="fixed inset-0 z-[9999] flex flex-col">
			<div class="flex gap-1 p-2">
				{#each DEAD_PIXEL_COLORS as { name, color }}
					<button
						onclick={() => {
							const el = document.getElementById("dp-screen");
							if (el) el.style.backgroundColor = color;
						}}
						class="rounded border border-white/20 px-3 py-1.5 text-xs font-medium text-white"
						style="background-color: {color}; {color === '#ffffff'
							? 'color: black; border-color: #ccc;'
							: ''}"
					>
						{name}
					</button>
				{/each}
				<button
					onclick={exitFullscreen}
					class="ml-auto rounded bg-red-600 px-3 py-1.5 text-xs text-white"
				>
					<X class="inline h-3 w-3" /> Exit
				</button>
			</div>
			<div id="dp-screen" class="flex-1 bg-white"></div>
		</div>
	{:else if fullscreenMode === "gradient"}
		<div class="fixed inset-0 z-[9999]">
			<button
				onclick={exitFullscreen}
				class="absolute right-4 top-4 z-10 rounded bg-black/50 px-3 py-1.5 text-xs text-white"
			>
				<X class="inline h-3 w-3" /> Exit
			</button>
			<div class="flex h-full">
				<div
					class="flex-1"
					style="background: linear-gradient(to bottom, #ff0000, #000000);"
				></div>
				<div
					class="flex-1"
					style="background: linear-gradient(to bottom, #00ff00, #000000);"
				></div>
				<div
					class="flex-1"
					style="background: linear-gradient(to bottom, #0000ff, #000000);"
				></div>
				<div
					class="flex-1"
					style="background: linear-gradient(to bottom, #ffffff, #000000);"
				></div>
			</div>
		</div>
	{:else if fullscreenMode === "motion-ghosting"}
		<div class="fixed inset-0 z-[9999] overflow-hidden bg-black text-white">
			<div class="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 bg-black/70 p-3 backdrop-blur-sm">
				<span class="text-xs font-medium text-white/80">Ghosting speed</span>
				{#each MOTION_GHOSTING_SPEEDS as speed}
					<button
						type="button"
						onclick={() => (ghostingSpeedPxPerSecond = speed)}
						class="rounded px-3 py-1.5 text-xs transition-colors {ghostingSpeedPxPerSecond === speed
							? 'bg-brand text-white'
							: 'bg-white/10 text-white/80 hover:bg-white/20'}"
						aria-pressed={ghostingSpeedPxPerSecond === speed}
					>
						{speed} px/s
					</button>
				{/each}
				<button
					onclick={exitFullscreen}
					class="ml-auto rounded bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
				>
					<X class="inline h-3 w-3" /> Exit
				</button>
			</div>
			<div class="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#111827,_#000000)] pt-16">
				<div class="absolute inset-0 opacity-25" style="background: repeating-linear-gradient(90deg, #000000 0px, #000000 48px, #f8fafc 48px, #f8fafc 96px);"></div>
				<div
					class="motion-sweep absolute top-1/2 rounded-xl border border-white/60 bg-white shadow-[0_0_32px_rgba(255,255,255,0.4)]"
					style="left: -{MOTION_BAR_WIDTH}px; width: {MOTION_BAR_WIDTH}px; height: 180px; --motion-travel: {motionTravelPx}px; animation-duration: {motionDuration}ms;"
				>
					<div class="absolute inset-y-0 left-0 w-3 bg-black/70"></div>
					<div class="absolute inset-y-0 right-0 w-3 bg-black/40"></div>
				</div>
				<div class="absolute bottom-6 left-1/2 max-w-xl -translate-x-1/2 px-4 text-center text-xs text-white/70">
					Observe the leading and trailing edges of the moving bar for motion blur, ghosting,
					and persistence artifacts. Browser compositing can affect what you see.
				</div>
			</div>
		</div>
	{/if}
{/if}

<div class="mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8 text-center">
		<h1 class="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
			<Monitor class="text-brand h-8 w-8" />
			Monitor Tester
		</h1>
		<p class="text-text-muted">
			Test your display refresh rate, dead pixels, and color accuracy.
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<!-- Refresh Rate -->
		<div class="bg-surface-light rounded-xl p-6">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Refresh Rate</h2>
			<div class="mb-4 text-center">
				<div class="text-brand text-5xl font-bold">{fps}</div>
				<div class="text-text-muted text-sm">FPS (≈ Hz)</div>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-text-muted">
					Avg: <strong class="text-text">{avgFps}</strong>
				</span>
				<span class="text-text-muted">
					Max: <strong class="text-text">{maxFps}</strong>
				</span>
			</div>
			<!-- Mini bar chart -->
			<div class="mt-4 flex h-16 items-end gap-px">
				{#each fpsHistory as f}
					<div
						class="bg-brand/60 min-w-[3px] flex-1 rounded-t transition-all"
						style="height: {Math.min((f / (maxFps || 60)) * 100, 100)}%;"
					></div>
				{/each}
			</div>
		</div>

		<!-- Screen Info -->
		<div class="bg-surface-light rounded-xl p-6">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Display Info</h2>
			<div class="space-y-3 text-sm">
				<div class="flex justify-between">
					<span class="text-text-muted">Resolution</span>
					<span class="font-mono">{screenWidth} × {screenHeight}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-text-muted">Viewport</span>
					<span class="font-mono">{viewportWidth} × {viewportHeight}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-text-muted">Pixel Ratio</span>
					<span class="font-mono">{pixelRatio}x</span>
				</div>
				<div class="flex justify-between">
					<span class="text-text-muted">Color Depth</span>
					<span class="font-mono">{colorDepth}-bit</span>
				</div>
			</div>
		</div>

		<!-- Dead Pixel Test -->
		<div class="bg-surface-light rounded-xl p-6">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Dead Pixel Test</h2>
			<p class="text-text-muted mb-4 text-sm">
				Fills your screen with solid colors. Look for any pixels that don't match.
			</p>
			<button
				onclick={() => enterFullscreen("dead-pixel")}
				class="bg-brand hover:bg-brand-dark flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors"
			>
				<Maximize class="h-4 w-4" />
				Start Dead Pixel Test
			</button>
		</div>

		<!-- Color Gradient -->
		<div class="bg-surface-light rounded-xl p-6">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Color Gradient</h2>
			<p class="text-text-muted mb-4 text-sm">
				Displays smooth RGB gradients. Check for banding or color uniformity issues.
			</p>
			<button
				onclick={() => enterFullscreen("gradient")}
				class="bg-brand hover:bg-brand-dark flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors"
			>
				<Maximize class="h-4 w-4" />
				Start Gradient Test
			</button>
		</div>

		<!-- Motion & Ghosting -->
		<div class="bg-surface-light rounded-xl p-6 sm:col-span-2">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Motion & Ghosting</h2>
			<p class="text-text-muted mb-4 text-sm">
				Runs a high-contrast moving bar pattern to help inspect motion blur, ghosting, and
				persistence artifacts in fullscreen.
			</p>
			<div class="mb-4 flex flex-wrap items-center gap-2">
				<span class="text-text-muted text-xs">Ghosting speed</span>
				{#each MOTION_GHOSTING_SPEEDS as speed}
					<button
						type="button"
						onclick={() => (ghostingSpeedPxPerSecond = speed)}
						class="rounded-lg px-3 py-1.5 text-xs transition-colors {ghostingSpeedPxPerSecond === speed
							? 'bg-brand/20 text-brand-light'
							: 'bg-surface text-text-muted hover:bg-surface-lighter'}"
						aria-pressed={ghostingSpeedPxPerSecond === speed}
					>
						{speed} px/s
					</button>
				{/each}
			</div>
			<button
				onclick={() => enterFullscreen("motion-ghosting")}
				class="bg-brand hover:bg-brand-dark flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors"
			>
				<Maximize class="h-4 w-4" />
				Run Motion Pattern
			</button>
			<p class="text-text-muted mt-3 text-xs">
				Interpret this as a browser-delivered pattern, not a direct panel measurement.
			</p>
		</div>
	</div>
</div>

<style>
	.motion-sweep {
		transform: translateY(-50%) translateX(0);
		animation-name: monitor-sweep;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes monitor-sweep {
		from {
			transform: translateY(-50%) translateX(0);
		}

		to {
			transform: translateY(-50%) translateX(var(--motion-travel));
		}
	}
</style>
