/**
 * Photothèque Unsplash — point d'entrée UNIQUE de toutes les images distantes.
 *
 * Pourquoi centraliser ?
 *  - un seul endroit à éditer le jour où la marque aura ses propres visuels ;
 *  - la liste des hôtes autorisés dans `next.config.ts` reste minimale ;
 *  - chaque photo porte son `alt` en français, obligatoire pour l'accessibilité.
 *
 * ⚠️ À VÉRIFIER AVANT MISE EN LIGNE
 * Les identifiants Unsplash ci-dessous n'ont pas pu être testés depuis
 * l'environnement de développement (accès réseau à `images.unsplash.com`
 * bloqué). Ouvrez chaque URL une fois en local : si l'une renvoie 404,
 * remplacez simplement son `id` par celui d'une autre photo Unsplash.
 * Le composant `<SmartImage />` affiche un dégradé de marque en secours,
 * donc une photo manquante ne "casse" jamais la mise en page.
 */

export type Photo = {
  /** Identifiant Unsplash, c.-à-d. le segment `photo-...` de l'URL. */
  id: string;
  /** Texte alternatif descriptif (SEO + lecteurs d'écran). */
  alt: string;
};

/** Construit une URL Unsplash optimisée pour une largeur de rendu donnée. */
export function unsplash(id: string, width = 1200): string {
  return `https://images.unsplash.com/${id}?w=${width}&auto=format&fit=crop&q=80`;
}

export const photos = {
  heroBowl: {
    id: "photo-1546069901-ba9599a7e63c",
    alt: "Bowl composé de poulet grillé, riz, avocat et légumes frais",
  },
  heroSecondary: {
    id: "photo-1512621776951-a57141f2eefd",
    alt: "Bol de légumes croquants et de céréales complètes vu de dessus",
  },
  crispyChicken: {
    id: "photo-1604909052743-94e838986d24",
    alt: "Bowl de poulet croustillant pané, chou rouge et sauce crémeuse",
  },
  veggie: {
    id: "photo-1540189549336-e6e99c3679fe",
    alt: "Bowl végétarien coloré aux pois chiches rôtis et jeunes pousses",
  },
  salmon: {
    id: "photo-1467003909585-2f8a72700288",
    alt: "Pavé de saumon rosé sur un lit de céréales et d'herbes fraîches",
  },
  protein: {
    id: "photo-1490645935967-10de6ba17061",
    alt: "Bowl protéiné composé de quinoa, œuf et légumes verts",
  },
  spicy: {
    id: "photo-1543339308-43e59d6b73a6",
    alt: "Bowl relevé au piment, garni de graines de sésame et d'oignons frits",
  },
  ingredients: {
    id: "photo-1466637574441-749b8f19452f",
    alt: "Étal de légumes frais de saison prêts à être découpés",
  },
  kitchen: {
    id: "photo-1556910103-1c02745aae4d",
    alt: "Plan de travail de cuisine où sont assemblés des bowls",
  },
  restaurant: {
    id: "photo-1414235077428-338989a2e8c0",
    alt: "Salle d'un restaurant fast-casual à l'ambiance chaleureuse",
  },
  storyTeaser: {
    id: "photo-1498837167922-ddd27525d352",
    alt: "Table garnie de bols et d'ingrédients frais partagés entre amis",
  },
  toppings: {
    id: "photo-1512058564366-18510be2db19",
    alt: "Toppings croustillants : graines torréfiées, oignons frits et herbes",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
