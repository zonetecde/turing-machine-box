<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Readable } from '../models/Etat';
	import type Etat from '../models/Etat';
	import SubRow from './SubRow.svelte';
	import { error } from '@sveltejs/kit';

	export let rule: Etat | null = null;
	export let header: boolean = false;
	export let rules: Etat[] = [];

	let modifyStateName = false;

	$: if (rule && rule.nom) {
	}
</script>

{#if header}
	<div class="w-full h-12 flex flex-row border border-black text-center">
		<div class="w-1/6 bg-slate-200 border-r-2 border-black flex items-center justify-center">
			<p class="text-lg leading-5">Nom de l'état</p>
		</div>
		<div class="w-5/6 grid grid-cols-4 bg-slate-200">
			<section class="border-r-2 border-black flex items-center justify-center text-lg">
				Lecture
			</section>
			<section class="w-3/13 border-r-2 border-black flex items-center justify-center text-lg">
				Ecriture
			</section>
			<section class="w-3/13 border-r-2 border-black flex items-center justify-center text-lg">
				Déplacement
			</section>
			<section class="w-3/13 flex items-center justify-center text-lg leading-5">
				Nouvel état
			</section>
		</div>
	</div>
{:else if rule != null}
	<div class="w-full min-h-[40px] flex flex-row border border-black relative">
		{#if rule.start}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="green"
				class="w-14 h-14 absolute -left-[4.4rem] top-1/2 -translate-y-1/2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		{/if}

		<div class="w-1/6 bg-slate-200 border-r-2 border-black flex items-center justify-center">
			{#if modifyStateName}
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					class="text-2xl pb-1 outline-none text-center bg-transparent"
					bind:value={rule.nom}
					autofocus
					maxlength="15"
					on:keyup={(e) => {
						if (e.key === 'Enter') modifyStateName = false;
					}}
					on:blur={() => {
						if (rule) {
							// vérifie qu'il n'a pas le nom 'Fin'
							if (rule.nom === 'Fin') {
								toast.error("Un état ne peut pas s'appeler 'Fin'");
								rule.nom = 'q' + Math.floor(Math.random() * 1000);
							}

							// vérifie qu'il n'y a pas deux états qui ont le même nom
							if (rules.filter((r) => r.nom === rule?.nom).length > 1) {
								toast.error('Deux états ne peuvent pas avoir le même nom');
								rule.nom = 'q' + Math.floor(Math.random() * 1000);
							} else {
								if (rule.nom.trim() === '') rule.nom = 'q' + Math.floor(Math.random() * 1000);
								modifyStateName = false;
							}
						}
					}}
				/>
			{:else}
				<div class="relative w-full h-full flex items-center justify-center">
					<button on:click={() => (modifyStateName = true)}>
						<p class="text-2xl pb-1">{rule.nom}</p>
					</button>

					<!-- Add 'Readable' button -->
					<button
						class="absolute right-2 bottom-2 w-6 h-6"
						on:click={() => {
							if (rule) rule.readables = [...rule.readables, new Readable(null, null, null, null)];
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 stroke-current inline-block mr-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
		<div class="w-5/6 bg-white grid grid-cols-4">
			<section class="border-r-2 border-black flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						bind:value={readable.symbole}
						last={i === rule.readables.length - 1}
						parentStateName={rule.nom}
						forbiddenValues={rule.readables
							.filter((r) => r.symbole !== null && rule && r.id !== readable.id)
							.map((r) => r.symbole)}
					/>
				{/each}
			</section>
			<section class="w-3/13 border-r-2 border-black flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						bind:value={readable.nouvelleValeur}
						last={i === rule.readables.length - 1}
						parentStateName={rule.nom}
					/>
				{/each}
			</section>
			<section class="w-3/13 border-r-2 border-black flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						bind:value={readable.direction}
						last={i === rule.readables.length - 1}
						acceptNull={false}
						maxLength={5}
						acceptableValues={['left', 'right']}
						parentStateName={rule.nom}
					/>
				{/each}
			</section>
			<section class="w-3/13 flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						etats={rules}
						bind:value={readable.nouvelEtatId}
						last={i === rule.readables.length - 1}
						maxLength={99}
						acceptNull={false}
						acceptableValues={rules.map((r) => r.nom)}
						isStateSelection={true}
						parentStateName={rule.nom}
					/>
				{/each}
			</section>
		</div>
	</div>
{/if}
