<script lang="ts">
	import Etat from '../models/Etat';
	import { Readable } from '../models/Etat';
	import Rule from './Rule.svelte';

	let rules: Etat[] = [
		new Etat('q1', [new Readable('', '1', 'right', 'q2'), new Readable('1', null, 'right', null)]),
		new Etat('q2', [new Readable('', null, 'left', 'q3'), new Readable('1', null, 'right', null)]),
		new Etat('q3', [new Readable('1', '', null, 'qf')])
	];
</script>

<div class="w-full flex justify-center">
	<div class="w-10/12 border-2 border-slate-500 shadow-xl shadow-slate-600">
		<Rule header={true} />
		{#each rules as rule}
			<Rule {rule} />
		{/each}
	</div>
</div>
