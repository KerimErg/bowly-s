import { visuelsBowls, type CleBowl } from "@/lib/assets";

/**
 * La carte Bowly's.
 *
 * ⚠️ POLITIQUE DE CONTENU
 * Aucun tarif n'a été arrêté : `prix` vaut `[X €]` partout et ne doit pas
 * être remplacé par une valeur inventée. Idem pour toute donnée réelle
 * (allergènes, valeurs nutritionnelles) — voir `lib/site.ts`.
 *
 * PARTI PRIS ÉDITORIAL
 * Un bowl n'est pas une ligne de carte, c'est un personnage. Chacun a donc
 * un `temperament` (une phrase, jamais deux), une `intensite` et une couleur
 * qui lui appartient. C'est ce qui permet à la page menu de ressembler à un
 * casting plutôt qu'à un tableur.
 */

export type Famille = "signature" | "vegetal" | "cru" | "cote";

export const familles: { id: Famille; label: string; ligne: string }[] = [
  { id: "signature", label: "Signature", ligne: "Le croustillant. Notre raison d'être." },
  { id: "vegetal", label: "Végétal", ligne: "Vert. Vif. Jamais triste." },
  { id: "cru", label: "Cru", ligne: "Frais du matin, tranché à la commande." },
  { id: "cote", label: "À côté", ligne: "Ce qui va avec." },
];

export type Bowl = {
  id: CleBowl;
  nom: string;
  /** La phrase du personnage. Une seule. Elle doit tenir sur une ligne. */
  temperament: string;
  famille: Famille;
  /** Ce qu'il y a dedans, en clair. */
  composition: string;
  /** Placeholder tarifaire — voir avertissement en tête de fichier. */
  prix: string;
  /** 0 = doux, 3 = ça pique vraiment. Affiché en pastilles, pas en texte. */
  intensite: 0 | 1 | 2 | 3;
  etiquettes: string[];
  /** Mis en avant sur la page d'accueil. */
  vedette?: boolean;
};

/** Prix non défini : format imposé par la charte de contenu. */
const PRIX = "[X €]";

export const bowls: Bowl[] = [
  {
    id: "the-og",
    nom: "The OG",
    temperament: "Le premier. Celui qu'on copie.",
    famille: "signature",
    composition: "Poulet pané maison, riz vinaigré, cheddar fondu, sauce fumée, oignons frits.",
    prix: PRIX,
    intensite: 1,
    etiquettes: ["Best-seller"],
    vedette: true,
  },
  {
    id: "spicy-bowly",
    nom: "Spicy Bowly",
    temperament: "Pour ceux qui aiment regretter.",
    famille: "signature",
    composition: "Poulet glacé au piment, riz, patate douce rôtie, sauce chili-miel, graines torréfiées.",
    prix: PRIX,
    intensite: 3,
    etiquettes: ["Ça pique"],
    vedette: true,
  },
  {
    id: "crispy-korean",
    nom: "Crispy Korean",
    temperament: "Laqué, collant, impossible à poser.",
    famille: "signature",
    composition: "Poulet croustillant laqué gochujang, riz, kimchi, oignons verts, sésame.",
    prix: PRIX,
    intensite: 2,
    etiquettes: ["Nouveau"],
    vedette: true,
  },
  {
    id: "smoke-show",
    nom: "Smoke Show",
    temperament: "Cuit lentement. Mangé vite.",
    famille: "signature",
    composition: "Effiloché fumé, boulgour, maïs grillé, sauce barbecue noire, pickles.",
    prix: PRIX,
    intensite: 1,
    etiquettes: [],
  },
  {
    id: "green-riot",
    nom: "Green Riot",
    temperament: "Végétal. Pas végétarien d'excuse.",
    famille: "vegetal",
    composition: "Pois chiches rôtis, jeunes pousses, avocat, sauce verte aux herbes, éclats de noisette.",
    prix: PRIX,
    intensite: 0,
    etiquettes: ["Végan"],
    vedette: true,
  },
  {
    id: "the-heavy",
    nom: "The Heavy",
    temperament: "Tu ne finiras pas. Essaie quand même.",
    famille: "signature",
    composition: "Double protéine, céréales complètes, cheddar, sauce brune épaisse, crispy à volonté.",
    prix: PRIX,
    intensite: 2,
    etiquettes: ["XXL"],
  },
  {
    id: "blue-lagoon",
    nom: "Blue Lagoon",
    temperament: "Le seul qui ne craque pas. Assumé.",
    famille: "cru",
    composition: "Saumon mariné, riz vinaigré, mangue, avocat, sauce agrumes, sésame noir.",
    prix: PRIX,
    intensite: 0,
    etiquettes: ["Cru"],
  },
  {
    id: "the-side",
    nom: "Les à-côtés",
    temperament: "Le croustillant, sans le reste.",
    famille: "cote",
    composition: "Oignons frits, pois chiches soufflés, graines torréfiées, les cinq sauces maison.",
    prix: PRIX,
    intensite: 0,
    etiquettes: ["À partager"],
  },
];

/** Chaque bowl porte la couleur de son illustration : une seule source. */
export function accentDe(bowl: Bowl): string {
  return visuelsBowls[bowl.id].accent;
}

export function visuelDe(bowl: Bowl) {
  return visuelsBowls[bowl.id];
}

/**
 * Point d'entrée unique de la carte.
 * TODO(back-office) : remplacer par un `fetch` vers l'API ou le CMS — la
 * forme de retour ne doit pas changer.
 */
export function getCarte(): Bowl[] {
  return bowls;
}

export function getVedettes(): Bowl[] {
  return bowls.filter((b) => b.vedette);
}
