import { GlobalVariables } from '../GlobalVariables';

export default class Etat {
	id: number;
	nom: string;
	readables: Readable[];

	constructor(nom: string, readables: Readable[], id: number = GlobalVariables.idCounter) {
		this.nom = nom;
		this.readables = readables;
		this.id = id;

		GlobalVariables.idCounter++;
	}
}

export class Readable {
	symbole: string;
	nouvelleValeur: string | null;
	direction: 'right' | 'left' | null;
	nouvelEtatId: number | null;

	constructor(
		symbole: string,
		nouvelleValeur: string | null,
		direction: 'right' | 'left' | null,
		nouvelleEtatId: number | null
	) {
		this.symbole = symbole;
		this.nouvelleValeur = nouvelleValeur;
		this.direction = direction;
		this.nouvelEtatId = nouvelleEtatId;
	}
}
