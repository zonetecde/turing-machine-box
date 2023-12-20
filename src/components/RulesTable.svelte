<script lang="ts">
	import Etat from '../models/Etat';
	import { Readable } from '../models/Etat';
	import Rule from './Rule.svelte';

	export let rules: Etat[];
</script>

<div class="w-full flex justify-center">
	<div class="w-10/12 border-2 border-slate-500 shadow-xl shadow-slate-600">
		<Rule header={true} />
		{#each rules as rule}
			<Rule bind:rule {rules} />
		{/each}
	</div>
</div>
