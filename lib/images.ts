/**
 * Photothèque Unsplash — point d'entrée UNIQUE de toutes les images du site,
 * carousel compris. Un seul fichier à corriger quand une photo ne va pas.
 *
 * Direction photo : « loaded bowl ». Généreux, sauce qui déborde, couleurs
 * saturées, éclairage studio. Pas de photo plate et sage.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠️  STATUT DE VÉRIFICATION
 *  `statut: "verifie"`     → URL testée, elle répond.
 *  `statut: "a-verifier"`  → choisie pour son sujet, mais JAMAIS testée :
 *                            l'environnement de développement bloque
 *                            `images.unsplash.com`.
 *
 *  Après déploiement, dites simplement lesquelles des `a-verifier` ne
 *  s'affichent pas — elles se remplacent ici, et nulle part ailleurs.
 *  Le lien `recherche` de chaque entrée ouvre la bonne recherche Unsplash.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Photo = {
  /** Identifiant Unsplash, c.-à-d. le segment `photo-...` de l'URL. */
  id: string;
  /** Texte alternatif descriptif (SEO + lecteurs d'écran). */
  alt: string;
  /** L'URL a-t-elle été réellement testée ? */
  statut: "verifie" | "a-verifier";
  /** Recherche Unsplash correspondante, pour remplacer la photo en un clic. */
  recherche: string;
};

/** Construit une URL Unsplash optimisée pour une largeur de rendu donnée. */
export function unsplash(id: string, width = 1200): string {
  return `https://images.unsplash.com/${id}?w=${width}&auto=format&fit=crop&q=80`;
}

const S = "https://unsplash.com/s/photos/";

export const photos = {
  /** ✅ Vérifiée — photo principale du hero et du bowl signature. */
  heroBowl: {
    id: "photo-1781332146307-8cde54158c2c",
    alt: "Bowl généreux nappé de sauce, ingrédients colorés en gros plan",
    statut: "verifie",
    recherche: `${S}loaded-bowl`,
  },

  /** ✅ Vérifiée — « The Crispy One », le best-seller. */
  crispyChicken: {
    id: "photo-1757715376249-b2a3e943cdf5",
    alt: "Bowl de poulet croustillant débordant de sauce et de toppings",
    statut: "verifie",
    recherche: `${S}crispy-chicken-bowl`,
  },

  heroSecondary: {
    id: "photo-1512152272829-e3139592d56f",
    alt: "Bowl coloré vu de dessus, sauce généreuse et graines torréfiées",
    statut: "a-verifier",
    recherche: `${S}saucy-bowl`,
  },
  spicy: {
    id: "photo-1600628421055-4d30de868b8f",
    alt: "Bowl relevé, glaçage pimenté brillant et oignons frits",
    statut: "a-verifier",
    recherche: `${S}spicy-chicken-bowl`,
  },
  veggie: {
    id: "photo-1543339308-43e59d6b73a6",
    alt: "Bowl végétal généreux, légumes vifs et sauce aux herbes",
    statut: "a-verifier",
    recherche: `${S}vegan-buddha-bowl`,
  },
  salmon: {
    id: "photo-1553621042-f6e147245754",
    alt: "Poké bowl au saumon, mangue et avocat, couleurs saturées",
    statut: "a-verifier",
    recherche: `${S}poke-bowl-salmon`,
  },
  toppings: {
    id: "photo-1626700051175-6818013e1d4f",
    alt: "Toppings croustillants et sauces en gros plan",
    statut: "a-verifier",
    recherche: `${S}crispy-toppings`,
  },
  ingredients: {
    id: "photo-1608039829572-78524f79c4c7",
    alt: "Sauces maison présentées en pots, couleurs vives",
    statut: "a-verifier",
    recherche: `${S}sauces-condiments`,
  },
  restaurant: {
    id: "photo-1517248135467-4c7edcad34c4",
    alt: "Salle d'un restaurant fast-casual à l'ambiance chaleureuse",
    statut: "a-verifier",
    recherche: `${S}fast-casual-restaurant`,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Les photos jamais testées — sert à la note du README et aux revues. */
export const photosAVerifier = Object.entries(photos)
  .filter(([, photo]) => photo.statut === "a-verifier")
  .map(([cle]) => cle);
