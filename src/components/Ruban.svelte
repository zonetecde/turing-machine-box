<script lang="ts">
	import { onMount } from 'svelte';

	let cellSize = 85; // Taille d'une cellule du ruban

	// Taille du ruban : offset pour centrer le ruban sur le curseur
	const offsets: { [key: number]: number } = {
		575: 1,
		745: 0,
		915: -1,
		1085: -2,
		1425: -4
	};

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
	let paddingElements = 10;
	// On concatène les éléments nulls avec la liste affichée
	$: showedElements = Array(paddingElements)
		.fill(null)
		.concat(lists)
		.concat(Array(paddingElements).fill(null));

	let ruban: HTMLDivElement;

	onMount(() => {
		// Initial call
		updateRibonWidth();

		window.addEventListener('resize', updateRibonWidth);

		return () => {
			window.removeEventListener('resize', updateRibonWidth);
		};
	});

	let rubanWidth = 745; // Taille du ruban
	let cursorOffset = 0; // Offset du curseur (par rapport à la taille du ruban)
	let cursorPosition = -2; // 0 = début du ruban.
	$: firstElementRelativeIndex = showedElements.findIndex((element) => element !== null);

	$: {
		cursorPosition;
		// Vérifie qu'elle a toujours un endroit où aller
		if (Math.abs(cursorPosition) >= paddingElements - 8) {
			// Rajoute des éléments nulls au début ou à la fin du ruban
			paddingElements += 10;
		}
	}

	/**
	 * Donne la position de la scrollbar pour centrer le ruban sur le curseur à sa position actuelle
	 */
	function getCursorPosition() {
		const firstCellToCursorLength = 4 * cellSize;
		const cursorIndex = firstElementRelativeIndex + cursorPosition + cursorOffset;
		return cursorIndex * cellSize - firstCellToCursorLength;
	}

	// On bouge le ruban pour centrer le curseur sur sa position à chaque fois que le curseur change de position
	$: {
		cursorPosition;
		rubanWidth;
		cursorOffset;

		if (ruban) {
			const initialScrollPosition = ruban.scrollLeft;
			const newScrollPosition = getCursorPosition();

			ruban.scrollTo({
				left: newScrollPosition,
				behavior: 'smooth'
			});

			// Si la position de défilement n'a pas changé après un délai, utilise scrollLeft (car scrollTo peut être beugé)
			setTimeout(() => {
				if (ruban) {
					if (ruban.scrollLeft === initialScrollPosition) {
						ruban.scrollLeft = newScrollPosition;
					}
				}
			}, 100);
		}
	}

	/**
	 * Met à jour la taille du ruban en fonction de la taille de la fenêtre
	 */
	function updateRibonWidth() {
		// On récupère la taille de la fenêtre
		const windowWidth = window.innerWidth;
		// On récupère la taille du ruban la plus proche de la taille de la fenêtre sans la dépasser
		rubanWidth = Object.keys(offsets)
			.map((offset) => parseInt(offset))
			.filter((offset) => offset <= windowWidth)
			.reduce((prev, curr) =>
				Math.abs(curr - windowWidth) < Math.abs(prev - windowWidth) ? curr : prev
			);

		cursorOffset = offsets[rubanWidth];
	}
</script>

<div class={'w-[' + rubanWidth + 'px] ' + 'h-[' + (cellSize + 10) + 'px]'}>
	<div
		bind:this={ruban}
		class="h-full overflow-x-hidden flex items-row border-t-2 border-b-2 bg-white border-black [mask-image:linear-gradient(90deg,#0000,#000,#000,#000,#0000)]"
	>
		{#each showedElements as element}
			<section
				class={'h-full flex justify-center items-center border-l border-r border-black relative ' +
					'min-w-[' +
					cellSize +
					'px]'}
			>
				<p class="text-3xl font-bold select-none">{element ?? ''}</p>
			</section>
		{/each}
	</div>

	<!-- Curseur -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="skyblue"
		data-slot="icon"
		class="w-6 h-6 absolute left-1/2 -top-7 z-20 bg-blue-700 rounded-full pt-0.5"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
	</svg>
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
