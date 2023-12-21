<script lang="ts">
	import Ruban from '../components/Ruban.svelte';
	import RulesTable from '../components/RulesTable.svelte';
	import Etat, { Readable } from '../models/Etat';

	let rules: Etat[] = [
		new Etat(
			'q1',
			[new Readable('', '1', 'right', 1), new Readable('1', null, 'right', null)],
			0,
			true
		),
		new Etat('q2', [new Readable('', null, 'left', 2), new Readable('1', null, 'right', null)], 1),
		new Etat('q3', [new Readable('1', '', null, -1)], 2)
	];
</script>

<div class="flex justify-center overflow-visible relative mt-10 flex-col">
	<Ruban />

	<br />
	<br />
	<br />

	<RulesTable bind:rules />
</div>
