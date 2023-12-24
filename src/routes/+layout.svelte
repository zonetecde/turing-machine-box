<script lang="ts">
	import '../App.css';
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster />

<div class="w-screen min-h-screen bg-blue-300 p-5">
	<slot />
</div>
