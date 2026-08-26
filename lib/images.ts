/**
 * Photothèque Unsplash — point d'entrée UNIQUE de toutes les images distantes.
 *
 * Direction photo : de la **street-food en barquette**. Plats servis en
 * barquette ou en boîte à emporter, poulet croustillant, frites chargées,
 * bols garnis — cadrage serré, lumière chaude. Pas d'assiette de restaurant.
 *
 * ⚠️ IDENTIFIANTS À VÉRIFIER AVANT MISE EN LIGNE
 * Ils n'ont pas pu être testés depuis l'environnement de développement :
 * `images.unsplash.com` y est bloqué par la politique réseau. Ouvrez le site
 * une fois en local et remplacez ce qui manque — c'est une manipulation de
 * quelques secondes, chaque entrée porte le lien de recherche correspondant.
 *
 * Comment remplacer une photo :
 *   1. ouvrez le lien `recherche` de l'entrée ;
 *   2. choisissez une photo, ouvrez-la, copiez l'URL de l'image
 *      (clic droit → « Copier l'adresse de l'image ») ;
 *   3. gardez uniquement le segment `photo-...` et collez-le dans `id`.
 *
 * `<SmartImage />` affiche un dégradé de marque en secours : une photo
 * manquante ne casse jamais la mise en page.
 */

export type Photo = {
  /** Identifiant Unsplash, c.-à-d. le segment `photo-...` de l'URL. */
  id: string;
  /** Texte alternatif descriptif (SEO + lecteurs d'écran). */
  alt: string;
  /** Recherche Unsplash correspondante, pour remplacer la photo en un clic. */
  recherche: string;
};

/** Construit une URL Unsplash optimisée pour une largeur de rendu donnée. */
export function unsplash(id: string, width = 1200): string {
  return `https://images.unsplash.com/${id}?w=${width}&auto=format&fit=crop&q=80`;
}

const S = "https://unsplash.com/s/photos/";

export const photos = {
  heroBowl: {
    id: "photo-1626082927389-6cd097cee6a6",
    alt: "Barquette de poulet croustillant garnie de sauce et de sésame",
    recherche: `${S}korean-fried-chicken`,
  },
  heroSecondary: {
    id: "photo-1585109649139-366815a0d713",
    alt: "Frites chargées servies dans une barquette en carton",
    recherche: `${S}loaded-fries`,
  },
  crispyChicken: {
    id: "photo-1562967914-608f82629710",
    alt: "Morceaux de poulet pané croustillant dans une barquette",
    recherche: `${S}fried-chicken-box`,
  },
  veggie: {
    id: "photo-1540189549336-e6e99c3679fe",
    alt: "Bowl végétarien coloré aux pois chiches rôtis et jeunes pousses",
    recherche: `${S}veggie-bowl`,
  },
  salmon: {
    id: "photo-1467003909585-2f8a72700288",
    alt: "Pavé de saumon rosé sur un lit de céréales et d'herbes fraîches",
    recherche: `${S}salmon-bowl`,
  },
  protein: {
    id: "photo-1490645935967-10de6ba17061",
    alt: "Bowl protéiné composé de quinoa, œuf et légumes verts",
    recherche: `${S}protein-bowl`,
  },
  spicy: {
    id: "photo-1608039755401-742074f0548d",
    alt: "Poulet croustillant glacé à la sauce pimentée dans sa barquette",
    recherche: `${S}spicy-fried-chicken`,
  },
  ingredients: {
    id: "photo-1466637574441-749b8f19452f",
    alt: "Étal de légumes frais de saison prêts à être découpés",
    recherche: `${S}fresh-vegetables`,
  },
  kitchen: {
    id: "photo-1556910103-1c02745aae4d",
    alt: "Plan de travail de cuisine où sont assemblées les barquettes",
    recherche: `${S}restaurant-kitchen`,
  },
  restaurant: {
    id: "photo-1414235077428-338989a2e8c0",
    alt: "Salle d'un restaurant fast-casual à l'ambiance chaleureuse",
    recherche: `${S}fast-casual-restaurant`,
  },
  storyTeaser: {
    id: "photo-1610614819513-58e34989848b",
    alt: "Plusieurs barquettes de street-food partagées sur une table",
    recherche: `${S}street-food-tray`,
  },
  toppings: {
    id: "photo-1512058564366-18510be2db19",
    alt: "Toppings croustillants : graines torréfiées, oignons frits et herbes",
    recherche: `${S}crispy-toppings`,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
