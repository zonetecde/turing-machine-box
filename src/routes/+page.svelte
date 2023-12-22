<script lang="ts">
	import { readable } from 'svelte/store';
	import Ruban from '../components/Ruban.svelte';
	import RulesTable from '../components/RulesTable.svelte';
	import Etat, { Readable } from '../models/Etat';

	// let rules: Etat[] = [
	// 	new Etat(
	// 		'q1',
	// 		[new Readable('', '1', 'right', 1), new Readable('1', null, 'right', null)],
	// 		0,
	// 		true
	// 	),
	// 	new Etat('q2', [new Readable('', null, 'left', 2), new Readable('1', null, 'right', null)], 1),
	// 	new Etat('q3', [new Readable('1', '', null, -1)], 2)
	// ];

	// let rules: Etat[] = [
	// 	new Etat(
	// 		'e1',
	// 		[new Readable('0', null, null, -1), new Readable('1', '0', 'right', 1)],
	// 		0,
	// 		true
	// 	),
	// 	new Etat('e2', [new Readable('1', '1', 'right', 1), new Readable('0', '0', 'right', 2)], 1),
	// 	new Etat('e3', [new Readable('1', '1', 'right', 2), new Readable('0', '1', 'left', 3)], 2),
	// 	new Etat('e4', [new Readable('1', '1', 'left', 3), new Readable('0', '0', 'left', 4)], 3),
	// 	new Etat('e5', [new Readable('1', '1', 'left', 4), new Readable('0', '1', 'right', 0)], 4)
	// ];

	let rules: Etat[] = [
		new Etat(
			'q1',
			[
				new Readable('', '1', 'right', null),
				new Readable('1', '0', 'right', null),
				new Readable('0', '', 'left', 2)
			],
			1,
			true
		),
		new Etat('q2', [new Readable('1', '1', 'left', 2), new Readable('0', '0', 'left', 3)], 2)
	];

	let ruban: Ruban;

	/**
	 * Lance l'algorithme d'exécution
	 */
	function handleExecuteButtonClicked() {
		let currentState = rules.find((rule) => rule.start === true);

		const limitedInterval = setInterval(() => {
			// Regarde la lecture de la case actuelle
			const currentCell = ruban.readCell();

			// Cherche la règle correspondante dans l'état actuel
			const rule = currentState?.readables.find(
				(readable) => readable.symbole?.toString() === currentCell?.toString()
			);

			console.log(currentCell);
			console.log(rule);
			console.log(currentState);

			if (rule === undefined) {
				// Boucle infini, on arrête
				clearInterval(limitedInterval);
				return;
			}

			// Regarde les actions de la règle
			// Nouvelle valeur
			if (rule.nouvelleValeur !== null) {
				// Ecrit la nouvelle valeur
				ruban.writeCell(rule.nouvelleValeur);
			}
			// Direction
			if (rule.direction !== null) {
				ruban.moveCursor(rule.direction);
			}
			// Nouvel état
			if (rule.nouvelEtatId !== null) {
				if (rule.nouvelEtatId === -1) {
					// Fin
					clearInterval(limitedInterval);
					return;
				}
				currentState = rules.find((_rule) => _rule.id === rule.nouvelEtatId);
			}
		}, 1450);
	}
</script>

<div class="flex justify-center overflow-visible relative mt-10 flex-col">
	<Ruban bind:this={ruban} />

	<br />
	<br />

	<!-- Play button -->
	<button
		class="relative bg-blue-700 hover:bg-blue-800 duration-150 hover:scale-110 rounded-md shadow-md shadow-blue-900 text-white pr-1 pt-1.5 py-1 flex flex-row gap-x-2 w-40 text-xl mx-auto items-center justify-center"
		on:click={handleExecuteButtonClicked}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="white"
			class="h-8"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
			/>
		</svg>

		<span class="left-0 right-0">Éxecuter</span>
	</button>

	<br />
	<br />

	<RulesTable bind:rules />
</div>
