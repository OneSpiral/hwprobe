<script lang="ts">
	import { tools } from "$lib/tools";
	import {
		Gamepad2,
		Keyboard,
		Mouse,
		Monitor,
		Mic,
		Volume2,
		ArrowRight,
		Shield,
		Zap,
		Globe,
	} from "lucide-svelte";

	const iconMap: Record<string, typeof Gamepad2> = {
		"gamepad-2": Gamepad2,
		keyboard: Keyboard,
		mouse: Mouse,
		monitor: Monitor,
		mic: Mic,
		"volume-2": Volume2,
	};
</script>

<svelte:head>
	<title>HWProbe — Free Online Hardware Testing Tools</title>
	<meta
		name="description"
		content="Test your gamepad, keyboard, mouse, monitor, microphone and speakers directly in the browser. Free, open-source, no install required."
	/>
</svelte:head>

<section class="px-4 py-16 text-center md:py-24">
	<h1 class="mb-4 text-4xl font-bold md:text-5xl">
		Test Your Hardware
		<span class="text-brand">Instantly</span>
	</h1>
	<p class="text-text-muted mx-auto mb-8 max-w-2xl text-lg md:text-xl">
		Free, open-source browser tools to test your gamepad, keyboard, mouse, monitor, microphone &
		speakers. No downloads. No data collection. 100% client-side.
	</p>

	<div class="text-text-muted mx-auto flex flex-wrap items-center justify-center gap-6 text-sm">
		<span class="flex items-center gap-1.5">
			<Shield class="text-success h-4 w-4" />
			Privacy First
		</span>
		<span class="flex items-center gap-1.5">
			<Zap class="text-warning h-4 w-4" />
			Zero Latency
		</span>
		<span class="flex items-center gap-1.5">
			<Globe class="text-brand-light h-4 w-4" />
			Works Everywhere
		</span>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-16">
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each tools as tool}
			{@const Icon = iconMap[tool.icon]}
			<a
				href="/{tool.slug}"
				class="bg-surface-light hover:border-brand/50 group rounded-xl border border-transparent p-6 transition-all hover:scale-[1.02]"
			>
				<div class="mb-4 flex items-center gap-3">
					{#if Icon}
						<div class="bg-brand/10 group-hover:bg-brand/20 rounded-lg p-2.5 transition-colors">
							<Icon class="text-brand h-6 w-6" />
						</div>
					{/if}
					<h2 class="text-lg font-semibold">{tool.name}</h2>
				</div>
				<p class="text-text-muted mb-4 text-sm leading-relaxed">{tool.description}</p>
				<span
					class="text-brand-light group-hover:text-brand inline-flex items-center gap-1 text-sm font-medium transition-colors"
				>
					Start Test
					<ArrowRight
						class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
					/>
				</span>
			</a>
		{/each}
	</div>
</section>
