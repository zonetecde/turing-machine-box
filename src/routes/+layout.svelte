<script lang="ts">
	import { onMount } from 'svelte';
	import '../App.css';
	import { Toaster } from 'svelte-sonner';

	onMount(() => {
		//@ts-ignore
		kofiWidgetOverlay.draw('zonetecde', {
			type: 'floating-chat',
			'floating-chat.donateButton.text': 'Support me',
			'floating-chat.donateButton.background-color': '#323842',
			'floating-chat.donateButton.text-color': '#fff'
		});
	});
</script>

<Toaster />

<div class="w-screen min-h-screen bg-blue-300 p-5">
	<slot />

	<p class="absolute bottom-2 font-bold right-2 text-right">
		<a class="text-green-800 hover:underline" target="_blank" href="https://www.rayanestaszewski.fr"
			>Rayane STASZEWSKI</a
		> <br />
		<a
			class="text-blue-800 hover:underline"
			target="_blank"
			href="https://github.com/zonetecde/turing-machine-box">GitHub</a
		>
		<br />

		<a class="text-red-800 hover:underline" target="_blank" href="https://ko-fi.com/vzero"
			>Support me</a
		>
	</p>
</div>
