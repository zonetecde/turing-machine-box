<script lang="ts">
	import '../App.css';
	import { Toaster } from 'svelte-sonner';
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

		<a
			class="text-red-800 hover:underline"
			target="_blank"
			href="https://www.buymeacoffee.com/zonetecde">Buy me a coffee</a
		>
	</p>
</div>
