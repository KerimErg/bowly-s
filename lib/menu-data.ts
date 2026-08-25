import { photos, type Photo } from "@/lib/images";
import { TODO } from "@/lib/site";

/**
 * Carte Bowly's.
 *
 * ⚠️ Les prix sont volontairement en `[X €]` : aucun tarif n'a été arrêté.
 * Le jour où la grille tarifaire existe, remplacez `price` par la vraie
 * valeur (ex. `"12,90 €"`). Cette structure est prête à être remplacée par un
 * appel API / CMS : `getMenu()` renvoie déjà la même forme de données.
 */

export type MenuCategory =
  | "signature"
  | "vege"
  | "poisson"
  | "proteine"
  | "sides";

export const menuCategories: { id: MenuCategory; label: string; blurb: string }[] =
  [
    {
      id: "signature",
      label: "Poulet croustillant",
      blurb: "Notre signature : le croustillant qui reste croustillant.",
    },
    {
      id: "vege",
      label: "Végé",
      blurb: "100 % végétal, 0 % compromis sur le goût.",
    },
    {
      id: "poisson",
      label: "Saumon & poisson",
      blurb: "Poisson travaillé cru ou juste saisi, sauces vives.",
    },
    {
      id: "proteine",
      label: "Protéiné",
      blurb: "Pour les grosses journées et les gros appétits.",
    },
    {
      id: "sides",
      label: "À côté",
      blurb: "Sides croustillants, sauces maison et boissons.",
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
    category: "signature",
    description:
      "Poulet pané extra-croustillant, riz vinaigré, chou rouge mariné, cheddar fondu, sauce Bowly's fumée et oignons frits.",
    price: PRICE_PLACEHOLDER,
    photo: photos.crispyChicken,
    tags: ["Best-seller", "Gourmand"],
    featured: true,
  },
  {
    id: "crispy-yuzu",
    name: "Crispy Yuzu",
    category: "signature",
    description:
      "Poulet croustillant, semi-complet, edamame, concombre, sauce yuzu-miso et sésame torréfié.",
    price: PRICE_PLACEHOLDER,
    photo: photos.spicy,
    tags: ["Nouveau", "Acidulé"],
  },
  {
    id: "crispy-hot",
    name: "Hot Honey Crunch",
    category: "signature",
    description:
      "Poulet croustillant glacé au miel pimenté, patate douce rôtie, jeunes pousses, pickles d'oignon rouge.",
    price: PRICE_PLACEHOLDER,
    photo: photos.heroBowl,
    tags: ["Épicé"],
  },
  {
    id: "green-garden",
    name: "Green Garden",
    category: "vege",
    description:
      "Pois chiches rôtis au cumin, boulgour, avocat, épinards, courgette grillée, sauce herbes fraîches.",
    price: PRICE_PLACEHOLDER,
    photo: photos.veggie,
    tags: ["Végan", "Riche en fibres"],
    featured: true,
  },
  {
    id: "falafel-crunch",
    name: "Falafel Crunch",
    category: "vege",
    description:
      "Falafels croustillants, houmous citronné, quinoa, tomates confites, chou kale massé, tahini.",
    price: PRICE_PLACEHOLDER,
    photo: photos.toppings,
    tags: ["Végé", "Croustillant"],
  },
  {
    id: "saumon-poke",
    name: "Saumon Poké",
    category: "poisson",
    description:
      "Saumon cru mariné sauce soja-gingembre, riz vinaigré, mangue, avocat, radis, sésame noir.",
    price: PRICE_PLACEHOLDER,
    photo: photos.salmon,
    tags: ["Cru", "Best-seller"],
    featured: true,
  },
  {
    id: "saumon-teriyaki",
    name: "Saumon Teriyaki",
    category: "poisson",
    description:
      "Saumon juste saisi, glaçage teriyaki, riz complet, brocoli grillé, edamame, oignons nouveaux.",
    price: PRICE_PLACEHOLDER,
    photo: photos.kitchen,
    tags: ["Chaud"],
  },
  {
    id: "power-protein",
    name: "Power Protein",
    category: "proteine",
    description:
      "Double poulet grillé, quinoa, œuf mollet, haricots verts, betterave, sauce yaourt-citron.",
    price: PRICE_PLACEHOLDER,
    photo: photos.protein,
    tags: ["Haute protéine"],
    featured: true,
  },
  {
    id: "beef-bowl",
    name: "Smoky Beef",
    category: "proteine",
    description:
      "Bœuf effiloché fumé, riz basmati, maïs grillé, haricots noirs, cheddar, sauce chipotle.",
    price: PRICE_PLACEHOLDER,
    photo: photos.heroSecondary,
    tags: ["Fumé", "Généreux"],
  },
  {
    id: "side-crispy",
    name: "Crispy Sides",
    category: "sides",
    description:
      "Assortiment de toppings croustillants à partager : oignons frits, pois chiches soufflés, graines torréfiées.",
    price: PRICE_PLACEHOLDER,
    photo: photos.toppings,
    tags: ["À partager"],
  },
  {
    id: "side-sauces",
    name: "Les sauces maison",
    category: "sides",
    description:
      "Bowly's fumée, yuzu-miso, herbes fraîches, chipotle, tahini citron. Recettes maison, sans arôme artificiel.",
    price: PRICE_PLACEHOLDER,
    photo: photos.ingredients,
    tags: ["Maison"],
  },
  {
    id: "side-drinks",
    name: "Boissons fraîches",
    category: "sides",
    description: `Limonades pressées, kombuchas et infusions glacées. Sélection définitive ${TODO}.`,
    price: PRICE_PLACEHOLDER,
    photo: photos.storyTeaser,
    tags: ["Sans alcool"],
  },
];

/**
 * Point d'entrée unique pour récupérer la carte.
 * TODO(back-office) : remplacer par un `fetch` vers l'API ou le CMS.
 */
export function getMenu(): MenuItem[] {
  return menuItems;
}
