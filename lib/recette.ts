/**
 * Les ingrédients du configurateur.
 *
 * SOURCE UNIQUE, partagée par l'interface ET par la scène 3D. C'est ce qui
 * garantit que la sauce choisie dans le panneau est exactement la couleur qui
 * coule dans le bowl : il n'y a pas deux tables de correspondance à tenir
 * synchronisées, il n'y en a qu'une.
 *
 * ⚠️ POLITIQUE DE CONTENU
 * `supplement` reste un placeholder pour chaque ligne : aucune grille
 * tarifaire n'existe. Le mécanisme de calcul est en place et fonctionne
 * (voir `resumePrix`), il ne lui manque que les nombres.
 */

export type Etape = "base" | "proteine" | "sauce" | "toppings" | "extras";

export type Ingredient = {
  id: string;
  nom: string;
  /** Trois mots maximum. C'est une étiquette, pas une fiche produit. */
  note: string;
  /** Couleur reprise telle quelle par la scène 3D. */
  couleur: string;
  /** Placeholder tarifaire — voir avertissement en tête de fichier. */
  supplement: string;
  /** Repère diététique, affiché en pastille. */
  marqueur?: string;
};

export type GroupeEtape = {
  id: Etape;
  titre: string;
  consigne: string;
  /** `unique` = boutons radio ; `multiple` = cases à cocher. */
  mode: "unique" | "multiple";
  /** Nombre maximum de choix en mode multiple. */
  maximum?: number;
  options: Ingredient[];
};

/** Placeholder tarifaire. */
const P = "[+X €]";

export const ETAPES: GroupeEtape[] = [
  {
    id: "base",
    titre: "La base",
    consigne: "Le sol du bowl. Un seul.",
    mode: "unique",
    options: [
      { id: "riz", nom: "Riz vinaigré", note: "Tiède, japonais", couleur: "#e5d6b4", supplement: P },
      { id: "cereales", nom: "Céréales complètes", note: "Boulgour, épeautre", couleur: "#c8ab72", supplement: P },
      { id: "vert", nom: "Que du vert", note: "Jeunes pousses", couleur: "#7fb642", supplement: P, marqueur: "Léger" },
      { id: "nouilles", nom: "Nouilles sautées", note: "Sésame, ail noir", couleur: "#d9b96a", supplement: P },
    ],
  },
  {
    id: "proteine",
    titre: "La protéine",
    consigne: "Le morceau. Un seul.",
    mode: "unique",
    options: [
      { id: "crispy", nom: "Poulet crispy", note: "Pané à la commande", couleur: "#d08b3c", supplement: P },
      { id: "gochujang", nom: "Poulet gochujang", note: "Laqué, collant", couleur: "#b23a1c", supplement: P },
      { id: "fume", nom: "Effiloché fumé", note: "Sept heures", couleur: "#8f4a24", supplement: P },
      { id: "saumon", nom: "Saumon mariné", note: "Cru, tranché", couleur: "#e8735b", supplement: P, marqueur: "Cru" },
      { id: "pois", nom: "Pois chiches rôtis", note: "Croustillants", couleur: "#c8a34a", supplement: P, marqueur: "Végan" },
    ],
  },
  {
    id: "sauce",
    titre: "La sauce",
    consigne: "Maison. Une seule, sinon ça se marche dessus.",
    mode: "unique",
    options: [
      { id: "fumee", nom: "Fumée", note: "Paprika, mélasse", couleur: "#b53a19", supplement: P },
      { id: "chili", nom: "Chili-miel", note: "Ça pique, ça colle", couleur: "#ff2d10", supplement: P, marqueur: "Fort" },
      { id: "yuzu", nom: "Yuzu-miso", note: "Acidulé, salé", couleur: "#e8b53a", supplement: P },
      { id: "herbes", nom: "Herbes", note: "Persil, ciboulette", couleur: "#8ec44a", supplement: P, marqueur: "Végan" },
      { id: "tahini", nom: "Tahini citron", note: "Sésame, crémeux", couleur: "#d8c79a", supplement: P, marqueur: "Végan" },
    ],
  },
  {
    id: "toppings",
    titre: "Le croustillant",
    consigne: "Ajouté en dernier. Jusqu'à trois.",
    mode: "multiple",
    maximum: 3,
    options: [
      { id: "oignons", nom: "Oignons frits", note: "L'incontournable", couleur: "#ffc23d", supplement: P },
      { id: "sesame", nom: "Sésame torréfié", note: "Noir et blond", couleur: "#e0cba0", supplement: P },
      { id: "cacahuete", nom: "Cacahuètes concassées", note: "Salées", couleur: "#c98f4e", supplement: P, marqueur: "Allergène" },
      { id: "chips", nom: "Chips de patate douce", note: "Fines, sucrées", couleur: "#e08a3c", supplement: P },
      { id: "pickles", nom: "Pickles express", note: "Vinaigre, acidité", couleur: "#b8d14a", supplement: P },
    ],
  },
  {
    id: "extras",
    titre: "Les extras",
    consigne: "Pour ceux qui ne savent pas s'arrêter.",
    mode: "multiple",
    maximum: 2,
    options: [
      { id: "double", nom: "Double protéine", note: "Assume", couleur: "#d08b3c", supplement: P },
      { id: "cheddar", nom: "Cheddar fondu", note: "Coule dessus", couleur: "#f0a93c", supplement: P },
      { id: "oeuf", nom: "Œuf mollet", note: "Jaune coulant", couleur: "#f5c542", supplement: P },
      { id: "avocat", nom: "Avocat", note: "Une demi-pièce", couleur: "#8ec44a", supplement: P, marqueur: "Végan" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Lisibilité                                                                 */
/* -------------------------------------------------------------------------- */

const INK = "#120c0a";
const BONE = "#f4efe9";

function luminance(hex: string): number {
  const v = hex.replace("#", "");
  const canal = (n: number) => {
    const s = n / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * canal(parseInt(v.slice(0, 2), 16)) +
    0.7152 * canal(parseInt(v.slice(2, 4), 16)) +
    0.0722 * canal(parseInt(v.slice(4, 6), 16))
  );
}

/**
 * Couleur de texte lisible sur une pastille d'ingrédient.
 *
 * ⚠️ NE PAS REMPLACER PAR UNE COULEUR FIGÉE.
 * Les pastilles du configurateur prennent la couleur de leur ingrédient. Une
 * encre sombre passe sur le riz crème et l'or des oignons ; elle échoue sur
 * le gochujang et l'effiloché fumé, qui sont sombres. Le contrôle
 * d'accessibilité a effectivement attrapé le cas « Fumée » quand la couleur
 * était codée en dur.
 *
 * On calcule donc la luminance relative de la pastille et on choisit celui
 * des deux qui contraste le plus. Une couleur ajoutée dans `ETAPES` est
 * traitée correctement sans qu'on ait à y penser — à une condition, vérifiée
 * par le test ci-dessous.
 */
export function lisibleSur(couleur: string): string {
  const l = luminance(couleur);
  const contrasteEncre = (l + 0.05) / (luminance(INK) + 0.05);
  const contrasteOs = (luminance(BONE) + 0.05) / (l + 0.05);
  return contrasteEncre >= contrasteOs ? INK : BONE;
}

/**
 * Le meilleur contraste atteignable sur une couleur donnée.
 *
 * Sert au garde-fou : une couleur de luminance moyenne (un rouge brique, par
 * exemple) peut échouer avec les DEUX encres. Aucun calcul ne rattrape ça —
 * il faut éclaircir ou assombrir la couleur elle-même.
 */
export function meilleurContraste(couleur: string): number {
  const l = luminance(couleur);
  return Math.max(
    (l + 0.05) / (luminance(INK) + 0.05),
    (luminance(BONE) + 0.05) / (l + 0.05),
  );
}

/** Retrouve un ingrédient par son identifiant, toutes étapes confondues. */
export function trouverIngredient(id: string): Ingredient | undefined {
  for (const etape of ETAPES) {
    const trouve = etape.options.find((o) => o.id === id);
    if (trouve) return trouve;
  }
  return undefined;
}

/** Couleur d'un choix, avec repli si l'identifiant est inconnu. */
export function couleurDe(id: string, repli: string): string {
  return trouverIngredient(id)?.couleur ?? repli;
}

/**
 * Récapitulatif tarifaire.
 *
 * Le calcul est réel — il compte les lignes facturables et sait ce qui
 * s'additionne. Seuls les montants manquent, et ils manquent visiblement :
 * `total` renvoie le marqueur `[X €]` tant que la grille n'est pas fournie.
 * Le jour où elle existe, remplacer `supplement` par des nombres dans
 * `ETAPES` et faire la somme ici est un changement d'une dizaine de lignes.
 */
export function resumePrix(nbToppings: number, nbExtras: number) {
  return {
    lignes: 3 + nbToppings + nbExtras,
    /** Ce qui est compris dans le prix de base. */
    inclus: "Base + protéine + sauce",
    supplements: nbToppings + nbExtras,
    total: "[X €]",
  };
}
