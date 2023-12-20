export default class Etat {
	nom: string;
	readables: Readable[];

	constructor(nom: string, readables: Readable[]) {
		this.nom = nom;
		this.readables = readables;
	}
}

export class Readable {
	symbole: string;
	nouvelleValeur: string | null;
	direction: 'right' | 'left' | null;
	nouvelleEtat: string | null;

	constructor(
		symbole: string,
		nouvelleValeur: string | null,
		direction: 'right' | 'left' | null,
		nouvelleEtat: string | null
	) {
		this.symbole = symbole;
		this.nouvelleValeur = nouvelleValeur;
		this.direction = direction;
		this.nouvelleEtat = nouvelleEtat;
	}
}
