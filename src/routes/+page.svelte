<script lang="ts">
	import { readable } from 'svelte/store';
	import Ruban from '../components/Ruban.svelte';
	import RulesTable from '../components/RulesTable.svelte';
	import Etat, { Readable } from '../models/Etat';
	import { playingState } from '../stores/store';
	import { GlobalVariables } from '../GlobalVariables';
	import { onMount } from 'svelte';

	let values = ['1', '0'];

	let states: Etat[] = [
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
		new Etat('q2', [new Readable('1', '1', 'left', null), new Readable('0', '0', 'left', 1)], 2)
	];

	let ruban: Ruban;
	const speed = 1000;
	let isExecuting = false;

	/**
	 * Lance l'algorithme d'exécution
	 */
	function handleExecuteButtonClicked() {
		if (isExecuting) {
			isExecuting = false;
			playingState.set({
				stateId: -5,
				ruleId: -5
			});

			return;
		}

		let currentState = states.find((rule) => rule.start === true);

		if (currentState === undefined) {
			isExecuting = false;
			return;
		}

		/**
		 * Fonction récursive pour exécuter les règles de la machine de Turing
		 * @param {Etat} state - L'état actuel
		 */
		async function executeRules(state: Etat) {
			// Regarde la lecture de la case actuelle
			const currentCell = ruban.readCell();

			// Cherche la règle correspondante dans l'état actuel
			const rule = state?.readables.find(
				(readable) => readable.symbole?.toString() === currentCell?.toString()
			);

			if (rule === undefined) {
				isExecuting = false;

				// Boucle infinie, on arrête
				playingState.set({
					stateId: -5,
					ruleId: -5
				});
				return;
			}

			isExecuting = true;

			playingState.set({
				stateId: state.id,
				ruleId: rule.id
			});

			// Regarde les actions de la règle
			// Nouvelle valeur
			if (rule.nouvelleValeur !== null) {
				// Ecrit la nouvelle valeur
				ruban.writeCell(rule.nouvelleValeur);

				await new Promise((resolve) => setTimeout(resolve, speed / GlobalVariables.speed / 2));
			}
			// Direction
			if (rule.direction !== null) {
				ruban.moveCursor(rule.direction);
			}
			// Nouvel état
			if (rule.nouvelEtatId !== null) {
				if (rule.nouvelEtatId === -1) {
					// Fin
					playingState.set({
						stateId: -5,
						ruleId: -5
					});
					return;
				}
				const nextState = states.find((_rule) => _rule.id === rule.nouvelEtatId);

				if (nextState === undefined) {
					isExecuting = false;

					playingState.set({
						stateId: -5,
						ruleId: -5
					});
					return;
				}

				setTimeout(() => {
					if (isExecuting) executeRules(nextState);
				}, speed / GlobalVariables.speed);
			} else {
				// On reste dans le même état
				setTimeout(() => {
					if (isExecuting) executeRules(state);
				}, speed / GlobalVariables.speed);
			}
		}

		if (currentState === undefined) {
			return;
		}

		executeRules(currentState);
	}
</script>

<div class="flex justify-center overflow-visible relative mt-10 flex-col">
	<Ruban bind:this={ruban} bind:values />

	<br />
	<br />

	<!-- Play button -->
	<button
		class={'relative duration-150 hover:scale-110 rounded-md shadow-md  text-white pr-1 pt-1.5 py-1 flex flex-row gap-x-2 w-40 text-xl mx-auto items-center justify-center ' +
			(isExecuting
				? 'bg-red-700 hover:bg-red-800 shadow-red-900'
				: 'bg-blue-700 hover:bg-blue-800 shadow-blue-900')}
		on:click={handleExecuteButtonClicked}
	>
		{#if isExecuting === false}
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
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="white"
				class="w-8"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
			</svg>
		{/if}

		<span class="left-0 right-0">{isExecuting ? 'Arrêter' : 'Éxecuter'}</span>
	</button>

	<br />
	<br />

	<RulesTable bind:states bind:values />
</div>
