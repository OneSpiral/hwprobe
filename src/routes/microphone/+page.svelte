<script lang="ts">
	import { onMount } from "svelte";
	import { Mic, MicOff, Play, Square } from "lucide-svelte";

	let stream: MediaStream | null = null;
	let audioCtx: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let dataArray: Uint8Array<ArrayBuffer> | null = null;
	let canvas = $state<HTMLCanvasElement | null>(null);

	let permitted = $state(false);
	let denied = $state(false);
	let volume = $state(0);
	let peakVolume = $state(0);
	let isRecording = $state(false);
	let recordedUrl = $state<string | null>(null);
	let mediaRecorder: MediaRecorder | null = null;
	let chunks: Blob[] = [];
	let animFrame = 0;

	async function requestMic() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			permitted = true;

			audioCtx = new AudioContext();
			const source = audioCtx.createMediaStreamSource(stream);
			analyser = audioCtx.createAnalyser();
			analyser.fftSize = 2048;
			source.connect(analyser);
			dataArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

			draw();
		} catch {
			denied = true;
		}
	}

	function draw() {
		if (!analyser || !dataArray || !canvas) return;

		analyser.getByteTimeDomainData(dataArray);

		// Calculate volume (RMS)
		let sum = 0;
		for (const v of dataArray) {
			const normalized = (v - 128) / 128;
			sum += normalized * normalized;
		}
		const rms = Math.sqrt(sum / dataArray.length);
		volume = Math.min(Math.round(rms * 200), 100);
		if (volume > peakVolume) peakVolume = volume;

		// Draw waveform
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const w = canvas.width;
		const h = canvas.height;
		ctx.fillStyle = "#1e293b";
		ctx.fillRect(0, 0, w, h);

		ctx.lineWidth = 2;
		ctx.strokeStyle = "#6366f1";
		ctx.beginPath();

		const sliceWidth = w / dataArray.length;
		let x = 0;

		for (let i = 0; i < dataArray.length; i++) {
			const v = dataArray[i] / 128.0;
			const y = (v * h) / 2;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
			x += sliceWidth;
		}

		ctx.lineTo(w, h / 2);
		ctx.stroke();

		// Draw frequency bars
		const freqData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(freqData);

		const barWidth = w / 64;
		for (let i = 0; i < 64; i++) {
			const barHeight = (freqData[i * 4] / 255) * h * 0.4;
			const hue = (i / 64) * 260 + 220;
			ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.6)`;
			ctx.fillRect(i * barWidth, h - barHeight, barWidth - 1, barHeight);
		}

		animFrame = requestAnimationFrame(draw);
	}

	function startRecording() {
		if (!stream) return;
		chunks = [];
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
		mediaRecorder.onstop = () => {
			const blob = new Blob(chunks, { type: "audio/webm" });
			if (recordedUrl) URL.revokeObjectURL(recordedUrl);
			recordedUrl = URL.createObjectURL(blob);
		};
		mediaRecorder.start();
		isRecording = true;
	}

	function stopRecording() {
		mediaRecorder?.stop();
		isRecording = false;
	}

	onMount(() => {
		return () => {
			cancelAnimationFrame(animFrame);
			stream?.getTracks().forEach((t) => t.stop());
			audioCtx?.close();
			if (recordedUrl) URL.revokeObjectURL(recordedUrl);
		};
	});
</script>

<svelte:head>
	<title>Microphone Tester — Browser Hardware Diagnostics</title>
	<meta
		name="description"
		content="Test your microphone with real-time waveform, volume meter, frequency spectrum and recording playback."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8 text-center">
		<h1 class="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
			<Mic class="text-brand h-8 w-8" />
			Microphone Tester
		</h1>
		<p class="text-text-muted">Test your microphone with real-time audio visualization.</p>
	</div>

	{#if !permitted && !denied}
		<div class="bg-surface-light mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl p-12 text-center">
			<div class="bg-brand/10 rounded-full p-4">
				<Mic class="text-brand h-12 w-12" />
			</div>
			<p class="text-lg font-medium">Allow microphone access to start</p>
			<button
				onclick={requestMic}
				class="bg-brand hover:bg-brand-dark rounded-lg px-6 py-3 font-medium text-white transition-colors"
			>
				Enable Microphone
			</button>
		</div>
	{:else if denied}
		<div class="bg-surface-light mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl p-12 text-center">
			<div class="bg-danger/10 rounded-full p-4">
				<MicOff class="text-danger h-12 w-12" />
			</div>
			<p class="text-lg font-medium">Microphone access denied</p>
			<p class="text-text-muted text-sm">
				Please allow microphone access in your browser settings and refresh the page.
			</p>
		</div>
	{:else}
		<!-- Waveform -->
		<div class="bg-surface-light mb-6 overflow-hidden rounded-xl">
			<canvas
				bind:this={canvas}
				width={800}
				height={200}
				class="h-48 w-full"
			></canvas>
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			<!-- Volume Meter -->
			<div class="bg-surface-light rounded-xl p-6">
				<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Volume Level</h2>
				<div class="mb-2 text-center">
					<span class="text-brand text-4xl font-bold">{volume}</span>
					<span class="text-text-muted text-sm">%</span>
				</div>
				<div class="bg-surface h-4 overflow-hidden rounded-full">
					<div
						class="h-full rounded-full transition-all {volume > 80
							? 'bg-danger'
							: volume > 50
								? 'bg-warning'
								: 'bg-success'}"
						style="width: {volume}%;"
					></div>
				</div>
				<div class="text-text-muted mt-2 text-right text-xs">
					Peak: {peakVolume}%
				</div>
			</div>

			<!-- Recording -->
			<div class="bg-surface-light rounded-xl p-6">
				<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider">Recording</h2>
				{#if !isRecording}
					<button
						onclick={startRecording}
						class="bg-danger hover:bg-danger/80 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors"
					>
						<Play class="h-4 w-4" />
						Start Recording
					</button>
				{:else}
					<button
						onclick={stopRecording}
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-600 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-500"
					>
						<Square class="h-4 w-4" />
						Stop Recording
					</button>
				{/if}

				{#if recordedUrl}
					<div class="mt-4">
						<p class="text-text-muted mb-2 text-xs">Playback:</p>
						<audio controls src={recordedUrl} class="w-full"></audio>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
