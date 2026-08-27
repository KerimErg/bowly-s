/**
 * Registre des visuels — point d'entrée UNIQUE de tout ce que le site affiche.
 *
 * Aucun composant ne construit un chemin d'image à la main. Conséquences :
 *  - remplacer un visuel = éditer une ligne ici, jamais chasser dans le JSX ;
 *  - un fichier manquant se voit ici, il n'est pas deviné ailleurs ;
 *  - le `basePath` de GitHub Pages est appliqué à un seul endroit.
 *
 * Voir `public/assets/README.md` pour la convention de nommage et la marche à
 * suivre le jour du shooting photo.
 */

/**
 * Préfixe de déploiement en sous-répertoire (GitHub Pages « projet »).
 *
 * `next/image` et `<Image>` préfixent automatiquement les chemins absolus,
 * mais pas les URLs qu'on écrit soi-même dans du CSS en ligne ou dans un
 * attribut `poster`. Cette fonction couvre ces cas-là.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") ?? "";

function chemin(relatif: string): string {
  return `${BASE}/assets/${relatif}`;
}

/** Un visuel de bowl, tel que consommé par la carte et la scène 3D. */
export type VisuelBowl = {
  /** Chemin public de l'illustration. */
  src: string;
  /** Texte alternatif — obligatoire, jamais vide. */
  alt: string;
  /**
   * Couleur dominante du plat. Sert d'accent d'interface quand le bowl est
   * sélectionné, et de couleur d'émission dans la scène 3D : c'est ce qui
   * fait que chaque bowl « éclaire » la page à sa manière.
   */
  accent: string;
};

/** Illustrations de la carte. Une entrée par bowl, clé = identifiant du plat. */
export const visuelsBowls = {
  "the-og": {
    src: chemin("products/the-og.svg"),
    alt: "Bowl The OG vu de dessus : riz, poulet croustillant doré, filet de sauce rouge et oignons frits",
    accent: "#f0452a",
  },
  "spicy-bowly": {
    src: chemin("products/spicy-bowly.svg"),
    alt: "Bowl Spicy Bowly vu de dessus : poulet glacé au piment, sauce rouge vif, graines dorées",
    accent: "#ff2d10",
  },
  "crispy-korean": {
    src: chemin("products/crispy-korean.svg"),
    alt: "Bowl Crispy Korean vu de dessus : poulet laqué, sauce gochujang, oignons verts et sésame",
    accent: "#e8342e",
  },
  "green-riot": {
    src: chemin("products/green-riot.svg"),
    alt: "Bowl Green Riot vu de dessus : base de verdure, cubes dorés, sauce aux herbes verte",
    accent: "#a7d84b",
  },
  "blue-lagoon": {
    src: chemin("products/blue-lagoon.svg"),
    alt: "Bowl Blue Lagoon vu de dessus : riz vinaigré, cubes de saumon, sauce agrumes et éclats bleutés",
    accent: "#61c6d6",
  },
  "the-heavy": {
    src: chemin("products/the-heavy.svg"),
    alt: "Bowl The Heavy vu de dessus : céréales complètes, viande émiettée, sauce brune épaisse",
    accent: "#c9421f",
  },
  "smoke-show": {
    src: chemin("products/smoke-show.svg"),
    alt: "Bowl Smoke Show vu de dessus : base fumée, morceaux caramélisés, sauce barbecue sombre",
    accent: "#ff6a3d",
  },
  "the-side": {
    src: chemin("products/the-side.svg"),
    alt: "Assortiment de sides croustillants vu de dessus : oignons frits, pois chiches soufflés, sauces",
    accent: "#ffc23d",
  },
} as const satisfies Record<string, VisuelBowl>;

export type CleBowl = keyof typeof visuelsBowls;

/** Marque. */
export const branding = {
  marque: chemin("branding/mark.svg"),
  marqueMono: chemin("branding/mark-mono.svg"),
  og: chemin("branding/og.svg"),
} as const;

/**
 * Plans de la section cinématique.
 *
 * `video` pointe vers un fichier qui **n'existe pas encore** : la section
 * teste sa présence et retombe sur `poster` sans laisser de lecteur cassé.
 * Déposez les rushes dans `public/assets/videos/` et tout s'allume.
 */
export type PlanCinema = {
  cle: string;
  poster: string;
  video: string | null;
  alt: string;
  /** Le mot posé sur le plan. Un seul, très gros. */
  mot: string;
  accent: string;
};

export const plansCinema: PlanCinema[] = [
  {
    cle: "croustillant",
    poster: chemin("food/croustillant.svg"),
    video: null,
    alt: "Gros plan sur une panure dorée qui craque",
    mot: "CRAQUE",
    accent: "#f0452a",
  },
  {
    cle: "sauce",
    poster: chemin("food/sauce.svg"),
    video: null,
    alt: "Gros plan sur une sauce épaisse qui coule",
    mot: "COULE",
    accent: "#c9421f",
  },
  {
    cle: "braise",
    poster: chemin("food/braise.svg"),
    video: null,
    alt: "Gros plan sur des morceaux caramélisés à la braise",
    mot: "FUME",
    accent: "#ffc23d",
  },
  {
    cle: "verdure",
    poster: chemin("food/verdure.svg"),
    video: null,
    alt: "Gros plan sur des herbes fraîches et des graines",
    mot: "CROQUE",
    accent: "#8ec44a",
  },
];
