<script lang="ts">
	import { Github } from "lucide-svelte";
</script>

<footer class="border-surface-lighter text-text-muted mt-auto border-t px-4 py-8 text-center text-sm">
	<div class="mx-auto max-w-7xl">
		<p class="mb-2">
			<strong class="text-text">HWProbe</strong> — Free, open-source hardware testing tools.
		</p>
		<p class="mb-4">No data leaves your browser. 100% client-side.</p>
		<a
			href="https://github.com/nicepkg/hwprobe"
			target="_blank"
			rel="noopener noreferrer"
			class="hover:text-brand-light inline-flex items-center gap-1 transition-colors"
		>
			<Github class="h-4 w-4" />
			Star on GitHub
		</a>
	</div>
</footer>
