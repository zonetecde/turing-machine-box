import { GlobalVariables } from '../GlobalVariables';

export default class Etat {
	id: number;
	nom: string;
	readables: Readable[];
	start: boolean;

	constructor(
		nom: string,
		readables: Readable[],
		id: number = GlobalVariables.idCounter,
		start: boolean = false
	) {
		this.nom = nom;
		this.readables = readables;
		this.id = id;
		this.start = start;

		GlobalVariables.idCounter++;
	}
}

export class Readable {
	id: number;
	symbole: string | null;
	nouvelleValeur: string | null;
	direction: 'right' | 'left' | null;
	nouvelEtatId: number | null;

	constructor(
		symbole: string | null,
		nouvelleValeur: string | null,
		direction: 'right' | 'left' | null,
		nouvelleEtatId: number | null
	) {
		this.symbole = symbole;
		this.nouvelleValeur = nouvelleValeur;
		this.direction = direction;
		this.nouvelEtatId = nouvelleEtatId;

		this.id = GlobalVariables.idCounter;
		GlobalVariables.idCounter++;
	}
}
