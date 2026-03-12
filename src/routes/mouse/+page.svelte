<script lang="ts">
	import { onMount } from "svelte";
	import { Mouse, RotateCcw } from "lucide-svelte";

	let clickCounts = $state<Record<number, number>>({});
	let cpsClicks = $state<number[]>([]);
	let cps = $state(0);
	let scrollDelta = $state(0);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let moveDistance = $state(0);
	let lastX = 0;
	let lastY = 0;
	let testActive = $state(false);
	let cpsTimer: ReturnType<typeof setInterval> | null = null;

	const BUTTON_NAMES: Record<number, string> = {
		0: "Left",
		1: "Middle",
		2: "Right",
		3: "Back",
		4: "Forward",
	};

	function handleMouseDown(e: MouseEvent) {
		clickCounts[e.button] = (clickCounts[e.button] ?? 0) + 1;
		clickCounts = { ...clickCounts };
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	function handleWheel(e: WheelEvent) {
		scrollDelta += Math.abs(e.deltaY);
	}

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		if (lastX || lastY) {
			const dx = e.clientX - lastX;
			const dy = e.clientY - lastY;
			moveDistance += Math.sqrt(dx * dx + dy * dy);
		}
		lastX = e.clientX;
		lastY = e.clientY;
	}

	// CPS Test
	function startCpsTest() {
		testActive = true;
		cpsClicks = [];
		cps = 0;

		cpsTimer = setInterval(() => {
			const now = Date.now();
			cpsClicks = cpsClicks.filter((t) => now - t < 1000);
			cps = cpsClicks.length;
		}, 100);

		setTimeout(() => {
			stopCpsTest();
		}, 10000);
	}

	function cpsClick() {
		if (!testActive) return;
		cpsClicks.push(Date.now());
		cpsClicks = [...cpsClicks];
	}

	function stopCpsTest() {
		testActive = false;
		if (cpsTimer) clearInterval(cpsTimer);
	}

	function reset() {
		clickCounts = {};
		scrollDelta = 0;
		moveDistance = 0;
		cps = 0;
		cpsClicks = [];
		testActive = false;
		if (cpsTimer) clearInterval(cpsTimer);
	}

	onMount(() => {
		return () => {
			if (cpsTimer) clearInterval(cpsTimer);
		};
	});
</script>

<svelte:head>
	<title>Mouse Tester — Browser Hardware Diagnostics</title>
	<meta
		name="description"
		content="Test mouse click speed (CPS), buttons, scroll wheel, and tracking accuracy. Free online tool."
	/>
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="mx-auto max-w-4xl px-4 py-8"
	onmousedown={handleMouseDown}
	oncontextmenu={handleContextMenu}
	onwheel={handleWheel}
	onmousemove={handleMouseMove}
>
	<div class="mb-8 text-center">
		<h1 class="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
			<Mouse class="text-brand h-8 w-8" />
			Mouse Tester
		</h1>
		<p class="text-text-muted">Click, scroll, and move your mouse to test all functions.</p>
	</div>

	<!-- Stats -->
	<div class="mb-6 flex justify-end">
		<button
			onclick={reset}
			class="bg-surface-light hover:bg-surface-lighter flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors"
		>
			<RotateCcw class="h-3.5 w-3.5" />
			Reset
		</button>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Button Detection -->
		<div class="bg-surface-light rounded-xl p-5">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Button Clicks</h2>
			<div class="space-y-2">
				{#each Object.entries(BUTTON_NAMES) as [btn, name]}
					{@const count = clickCounts[Number(btn)] ?? 0}
					<div
						class="flex items-center justify-between rounded-lg px-3 py-2 {count > 0
							? 'bg-brand/10 text-brand-light'
							: 'bg-surface text-text-muted'}"
					>
						<span class="text-sm">{name}</span>
						<span class="font-mono text-sm font-bold">{count}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- CPS Test -->
		<div class="bg-surface-light rounded-xl p-5">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Click Speed (CPS)</h2>
			{#if !testActive}
				<button
					onclick={startCpsTest}
					class="bg-brand hover:bg-brand-dark w-full rounded-lg px-4 py-8 text-lg font-bold text-white transition-colors"
				>
					Start 10s Test
				</button>
			{:else}
				<button
					onclick={cpsClick}
					class="bg-brand hover:bg-brand-dark w-full rounded-lg px-4 py-6 transition-colors"
				>
					<div class="text-3xl font-bold text-white">{cps}</div>
					<div class="text-sm text-white/70">clicks/sec</div>
				</button>
				<p class="text-text-muted mt-2 text-center text-xs">
					Total: {cpsClicks.length} clicks
				</p>
			{/if}
		</div>

		<!-- Scroll & Movement -->
		<div class="bg-surface-light rounded-xl p-5">
			<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Movement & Scroll</h2>
			<div class="space-y-4">
				<div>
					<p class="text-text-muted text-xs">Scroll Distance</p>
					<p class="text-brand-light font-mono text-2xl font-bold">
						{Math.round(scrollDelta)}
					</p>
				</div>
				<div>
					<p class="text-text-muted text-xs">Move Distance (px)</p>
					<p class="text-brand-light font-mono text-2xl font-bold">
						{Math.round(moveDistance)}
					</p>
				</div>
				<div>
					<p class="text-text-muted text-xs">Position</p>
					<p class="text-text-muted font-mono text-sm">
						{Math.round(mouseX)}, {Math.round(mouseY)}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
