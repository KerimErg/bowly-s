/**
 * Registre des visuels — point d'entrée UNIQUE de tout ce que le site affiche.
 *
 * DEUX COUCHES, ET UNE SEULE RÈGLE
 *   1. `lib/photos.ts` — VOS photos et vos vidéos. C'est le fichier à remplir.
 *   2. `public/assets/` — les illustrations dessinées, qui prennent le relais
 *      tant que la ligne correspondante est vide.
 *
 * La photo gagne toujours quand elle existe. Aucun composant ne connaît cette
 * bascule : ils demandent un visuel, ils en reçoivent un.
 *
 * Voir `public/assets/README.md` pour la convention de nommage.
 */

import { estFournie, photosBowls, photosCinema } from "@/lib/photos";

/**
 * Préfixe de déploiement en sous-répertoire (GitHub Pages « projet »).
 *
 * `next/image` préfixe automatiquement les chemins absolus, mais pas les URLs
 * qu'on écrit soi-même dans du CSS en ligne ou dans un attribut `poster`.
 * Cette fonction couvre ces cas-là.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") ?? "";

function chemin(relatif: string): string {
  return `${BASE}/assets/${relatif}`;
}

/**
 * Préfixe une adresse fournie par l'utilisateur, si elle en a besoin.
 *
 * Une adresse `https://…` part telle quelle. Un chemin local `/assets/…` doit
 * en revanche recevoir le `basePath` du déploiement, sans quoi il pointe à
 * côté sur GitHub Pages — l'erreur classique quand on colle un chemin trouvé
 * dans l'explorateur de fichiers.
 */
function normaliser(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  const propre = src.startsWith("/") ? src : `/${src}`;
  return `${BASE}${propre}`;
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
    accent: "#ee4520",
  },
  "spicy-bowly": {
    src: chemin("products/spicy-bowly.svg"),
    alt: "Bowl Spicy Bowly vu de dessus : poulet glacé au piment, sauce rouge vif, graines dorées",
    accent: "#e01000",
  },
  "crispy-korean": {
    src: chemin("products/crispy-korean.svg"),
    alt: "Bowl Crispy Korean vu de dessus : poulet laqué, sauce gochujang, oignons verts et sésame",
    accent: "#d63317",
  },
  "green-riot": {
    src: chemin("products/green-riot.svg"),
    alt: "Bowl Green Riot vu de dessus : base de verdure, cubes dorés, sauce aux herbes verte",
    accent: "#8fd11f",
  },
  "blue-lagoon": {
    src: chemin("products/blue-lagoon.svg"),
    alt: "Bowl Blue Lagoon vu de dessus : riz vinaigré, cubes de saumon, sauce agrumes et éclats bleutés",
    accent: "#4fb0bf",
  },
  "the-heavy": {
    src: chemin("products/the-heavy.svg"),
    alt: "Bowl The Heavy vu de dessus : céréales complètes, viande émiettée, sauce brune épaisse",
    accent: "#b82a0e",
  },
  "smoke-show": {
    src: chemin("products/smoke-show.svg"),
    alt: "Bowl Smoke Show vu de dessus : base fumée, morceaux caramélisés, sauce barbecue sombre",
    accent: "#e07a2e",
  },
  "the-side": {
    src: chemin("products/the-side.svg"),
    alt: "Assortiment de sides croustillants vu de dessus : oignons frits, pois chiches soufflés, sauces",
    accent: "#ffbf2e",
  },
} as const satisfies Record<string, VisuelBowl>;

export type CleBowl = keyof typeof visuelsBowls;

/**
 * Le visuel réellement affiché pour un bowl.
 *
 * ⚠️ C'EST LA SEULE FONCTION QUE LES COMPOSANTS DOIVENT APPELER.
 * Elle applique la règle « votre photo d'abord, l'illustration sinon », et
 * indique laquelle des deux a été retenue — ce qui permet à l'interface de
 * traiter les deux différemment : une photo est recadrée en `cover`, une
 * illustration est posée en `contain` sur un fond de couleur.
 */
export function visuelBowl(cle: CleBowl): VisuelBowl & { estPhoto: boolean } {
  const dessin = visuelsBowls[cle];
  const fournie = photosBowls[cle];

  if (fournie && estFournie(fournie.src)) {
    return {
      src: normaliser(fournie.src),
      alt: fournie.alt || dessin.alt,
      accent: dessin.accent,
      estPhoto: true,
    };
  }

  return { ...dessin, estPhoto: false };
}

/** Marque. */
export const branding = {
  marque: chemin("branding/mark.svg"),
  marqueMono: chemin("branding/mark-mono.svg"),
  og: chemin("branding/og.svg"),
} as const;

/** Un plan de la section cinématique. */
export type PlanCinema = {
  cle: string;
  poster: string;
  video: string | null;
  alt: string;
  /** Le mot posé sur le plan. Un seul, très gros. */
  mot: string;
  accent: string;
  /** Vrai si `poster` est une vraie photo, faux si c'est l'illustration. */
  estPhoto: boolean;
};

/** Les quatre plans, avant application de ce que vous avez fourni. */
const PLANS_PAR_DEFAUT = [
  { cle: "croustillant", mot: "CRAQUE", accent: "#ee4520" },
  { cle: "sauce", mot: "COULE", accent: "#b82a0e" },
  { cle: "braise", mot: "FUME", accent: "#ffbf2e" },
  { cle: "verdure", mot: "CROQUE", accent: "#8fd11f" },
] as const;

/**
 * Les plans de la section cinéma, photo et vidéo résolues.
 *
 * `video` reste `null` tant qu'aucun fichier n'est fourni : la section
 * affiche alors l'image fixe, sans lecteur cassé ni espace vide.
 */
export const plansCinema: PlanCinema[] = PLANS_PAR_DEFAUT.map((plan) => {
  const fourni = photosCinema[plan.cle];
  const photoFournie = fourni && estFournie(fourni.photo);

  return {
    cle: plan.cle,
    mot: plan.mot,
    accent: plan.accent,
    poster: photoFournie ? normaliser(fourni.photo) : chemin(`food/${plan.cle}.svg`),
    video: fourni && estFournie(fourni.video) ? normaliser(fourni.video) : null,
    alt: fourni?.alt || `Gros plan ${plan.cle}`,
    estPhoto: Boolean(photoFournie),
  };
});
