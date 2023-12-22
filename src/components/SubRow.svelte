<script lang="ts">
	import { toast } from 'svelte-sonner';
	import type Etat from '../models/Etat';

	export let value: string | number | null | undefined = ''; // Valeur de la cellule
	export let last: boolean = false; // Si c'est la dernière cellule de la ligne
	export let maxLength = 1; // Longueur maximale de la valeur
	export let acceptNull = true; // Si la valeur peut être null
	export let acceptableValues: string[] = []; // Valeurs acceptables (si empty alors toutes les valeurs sont acceptées)
	export let parentStateName: string;
	export let forbiddenValues: any[] = []; // Valeurs interdites (si empty alors aucune valeur n'est interdite)

	// Gère l'affichage du nom de l'état
	export let isStateSelection = false; // Si c'est une sélection d'état
	export let etats: Etat[] = []; // Liste des états (pour récupérer leur nom)
	$: etatName = etats.find((x) => x.id === value)?.nom; // Nom de l'état (s'update automatiquement quand son nom change)

	let editMode = false;
</script>

{#if value !== null}
	<div class="relative">
		{#if !editMode}
			<div class="relative">
				<button
					class={'min-h-[41px] w-full text-left cursor-text pl-3 py-1.5 border-black ' +
						(last ? '' : 'border-b')}
					on:click={() => (editMode = true)}
				>
					<!-- Si c'est une sélection d'état on affiche either le nom de l'état ou si c'est -1 que c'est l'état final -->
					{#if isStateSelection}
						<span class="text-xl">{etatName ? etatName : 'Fin'}</span>
					{:else}
						<!-- Si la valeur est vide on affiche NULL (= on lit une case vide) -->
						<span class={'text-xl ' + (value === '' ? 'italic' : '')}
							>{value === '' ? 'NULL' : value}</span
						>
					{/if}
				</button>

				{#if isStateSelection && etatName === undefined}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="red"
						class="w-10 h-10 absolute -right-12 top-1/2 -translate-y-1/2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				{/if}
			</div>
		{:else}
			<!-- Combobox pour sélectionner soit la direction soit le nouvel état -->
			{#if acceptableValues.length > 0}
				<select
					class={'w-full text-left outline-none bg-transparent text-xl cursor-text py-1.5 pl-3 flex flex-row items-center bg-gray-100 border-black ' +
						(last ? '' : 'border-b')}
					bind:value
					on:blur={() => {
						setTimeout(() => {
							editMode = false;
						}, 100);
					}}
					size={acceptableValues.length}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							editMode = false;
						}
					}}
					on:change={() => {
						if (isStateSelection) {
							// Convertis le nom de l'état en id
							if (value === 'Fin') value = -1;
							else value = etats.find((x) => x.nom === value)?.id;
						}

						editMode = false;
					}}
				>
					{#each acceptableValues as val}
						{#if val !== parentStateName}
							<option value={val} class={val === etatName ? 'bg-gray-400' : ''}>{val}</option>
						{/if}
					{/each}

					<!-- Etat final -->
					{#if isStateSelection}
						<option value={'Fin'} class={etatName === undefined ? 'bg-gray-400' : ''}>Fin</option>
					{/if}
				</select>
			{:else}
				<!-- Input pour modifier la valeur de la cellule -->
				<!-- svelte-ignore a11y-autofocus -->
				<input
					class={'w-full text-left outline-none bg-gray-100 text-xl cursor-text pl-3 py-1.5 border-black ' +
						(last ? '' : 'border-b')}
					type="text"
					spellcheck="false"
					autofocus
					bind:value
					maxlength={maxLength}
					on:blur={() => {
						setTimeout(() => {
							// Si la valeur est un espace et qu'on accepte les valeurs nulles on la convertis en chaine vide
							if (value === ' ' && acceptNull) value = '';
							// Si la valeur est vide et qu'on accepte pas les valeurs nulles on la convertis en null
							else if (value === '' && acceptNull === false) value = null;
							// Les chaines qui restent vide = on lit une case vide

							// Vérifie que ce n'est pas une valeur interdite
							if (forbiddenValues.includes(value)) {
								value = null;
								toast.error('Une règle de cet état lit déjà cette valeur.');
							}

							editMode = false;
						}, 100);
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							editMode = false;
						}
					}}
				/>
			{/if}
			<!-- Delete button -->
			<button
				class="absolute right-1 px-1 top-1 bottom-1 bg-red-500 hover:bg-red-600 text-white flex justify-center items-center"
				on:click={() => {
					value = null;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
	</div>
{:else}
	<!-- Empty line -->
	<button
		class={'h-[41px] border-black cursor-text ' + (last ? '' : 'border-b')}
		on:click={() => {
			editMode = true;
			value = '';
		}}
	></button>
{/if}
