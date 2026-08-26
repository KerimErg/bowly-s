import { photos, type Photo } from "@/lib/images";

/**
 * Carte Bowly's.
 *
 * ⚠️ Les prix sont volontairement en `[X €]` : aucun tarif n'a été arrêté.
 * Le jour où la grille tarifaire existe, remplacez `price` par la vraie
 * valeur (ex. `"12,90 €"`). Cette structure est prête à être remplacée par un
 * appel API / CMS : `getMenu()` renvoie déjà la même forme de données.
 */

export type MenuCategory = "croustillant" | "frais" | "cote";

export const menuCategories: { id: MenuCategory; label: string; blurb: string }[] =
  [
    {
      id: "croustillant",
      label: "Croustillant",
      blurb: "Le poulet pané. Notre raison d'être.",
    },
    {
      id: "frais",
      label: "Frais",
      blurb: "Vert, cru, vif. Sans rien perdre en générosité.",
    },
    {
      id: "cote",
      label: "À côté",
      blurb: "Ce qui va avec, et les sauces.",
    },
  ];

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  /** Placeholder tarifaire — voir avertissement en tête de fichier. */
  price: string;
  photo: Photo;
  /** Repères diététiques affichés sous forme de pastilles. */
  tags: string[];
  /** Mis en avant sur la page menu. */
  featured?: boolean;
};

/** Prix non défini : format demandé par la charte de contenu. */
const PRICE_PLACEHOLDER = "[X €]";

export const menuItems: MenuItem[] = [
  {
    id: "crispy-signature",
    name: "The Crispy One",
    category: "croustillant",
    description:
      "Poulet pané extra-croustillant, riz vinaigré, chou rouge mariné, cheddar fondu, sauce Bowly's fumée et oignons frits.",
    price: PRICE_PLACEHOLDER,
    photo: photos.crispyChicken,
    tags: ["Best-seller", "Gourmand"],
    featured: true,
  },
  {
    id: "crispy-hot",
    name: "Hot Honey Crunch",
    category: "croustillant",
    description:
      "Poulet croustillant glacé au miel pimenté, patate douce rôtie, jeunes pousses, pickles d'oignon rouge.",
    price: PRICE_PLACEHOLDER,
    photo: photos.spicy,
    tags: ["Épicé"],
    featured: true,
  },
  {
    id: "crispy-yuzu",
    name: "Crispy Yuzu",
    category: "croustillant",
    description:
      "Poulet croustillant, semi-complet, edamame, concombre, sauce yuzu-miso et sésame torréfié.",
    price: PRICE_PLACEHOLDER,
    photo: photos.heroBowl,
    tags: ["Nouveau", "Acidulé"],
  },
  {
    id: "green-garden",
    name: "Green Garden",
    category: "frais",
    description:
      "Pois chiches rôtis au cumin, boulgour, avocat, épinards, courgette grillée, sauce herbes fraîches.",
    price: PRICE_PLACEHOLDER,
    photo: photos.veggie,
    tags: ["Végan", "Riche en fibres"],
    featured: true,
  },
  {
    id: "saumon-poke",
    name: "Saumon Poké",
    category: "frais",
    description:
      "Saumon cru mariné sauce soja-gingembre, riz vinaigré, mangue, avocat, radis, sésame noir.",
    price: PRICE_PLACEHOLDER,
    photo: photos.salmon,
    tags: ["Cru", "Best-seller"],
    featured: true,
  },
  {
    id: "side-crispy",
    name: "Crispy Sides",
    category: "cote",
    description:
      "Assortiment de toppings croustillants à partager : oignons frits, pois chiches soufflés, graines torréfiées.",
    price: PRICE_PLACEHOLDER,
    photo: photos.toppings,
    tags: ["À partager"],
  },
  {
    id: "side-sauces",
    name: "Les sauces maison",
    category: "cote",
    description:
      "Bowly's fumée, yuzu-miso, herbes fraîches, chipotle, tahini citron. Recettes maison, sans arôme artificiel.",
    price: PRICE_PLACEHOLDER,
    photo: photos.ingredients,
    tags: ["Maison"],
  },
];

/**
 * Point d'entrée unique pour récupérer la carte.
 * TODO(back-office) : remplacer par un `fetch` vers l'API ou le CMS.
 */
export function getMenu(): MenuItem[] {
  return menuItems;
}
