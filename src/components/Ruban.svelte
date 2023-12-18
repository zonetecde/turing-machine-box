<script lang="ts">
	import { onMount } from 'svelte';

	const lists: (string | number | null)[] = [
		0,
		1,
		1,
		0,
		null,
		null,
		0,
		1,
		0,
		1,
		0,
		1,
		1,
		0,
		5000,
		null,
		0,
		1,
		0,
		1,
		0,
		1,
		1,
		0,
		null,
		null,
		0,
		1,
		0,
		1
	];

	// On ajoute des éléments nulls au début et à la fin du ruban pour l'effet infini
	// Nombre d'éléments nulls à ajouter au début et à la fin du ruban
	const paddingElements = 10;
	// On concatène les éléments nulls avec la liste affichée
	$: showedElements = Array(paddingElements)
		.fill(null)
		.concat(lists)
		.concat(Array(paddingElements).fill(null));

	let ruban: HTMLDivElement;

	onMount(() => {
		const rubanBeginPosX = 80 * paddingElements;
		ruban.scrollTo({
			left: rubanBeginPosX, // Vers le début du ruban
			behavior: 'smooth'
		});
	});

	let cursorPosition = -2; // 0 = début du ruban. Par défaut, on place le curseur à -3 du ruban
	$: firstElementRelativeIndex = showedElements.findIndex((element) => element !== null);
	$: cursorIndex = firstElementRelativeIndex + cursorPosition;
</script>

<div
	bind:this={ruban}
	class="w-8/12 h-32 overflow-x-auto overflow-clip bg-white border-t-2 border-b-2 border-black flex items-row [mask-image:linear-gradient(90deg,#0000,#000,#000,#000,#0000)]"
>
	{#each showedElements as element, i}
		<section
			class="min-w-[120px] h-full flex justify-center items-center border-l border-r border-b-2 border-black relative"
		>
			<p class="text-3xl font-bold">{element ?? ''}</p>

			{#if i === cursorIndex}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					data-slot="icon"
					class="w-6 h-6 absolute -translate-y-3 top-0"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
				</svg>
			{/if}
		</section>
	{/each}
</div>

<style>
	::-webkit-scrollbar {
		height: 5px;
	}

	::-webkit-scrollbar-track {
		background-color: #ffffff;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.75);
		border-radius: 10px;
	}
</style>
