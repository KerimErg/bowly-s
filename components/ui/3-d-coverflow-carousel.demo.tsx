"use client";

import {
  Coverflow3DCarousel,
  defaultDishes,
  type CoverflowDish,
} from "@/components/ui/3-d-coverflow-carousel";

/* ---------------------------------------------------------------------------
 * Fichier de RÉFÉRENCE D'USAGE (l'ancien `demo.tsx`).
 * Il n'est monté par aucune route : l'intégration réelle vit dans
 * `components/home/best-sellers.tsx`. Gardez-le comme aide-mémoire des props.
 * ------------------------------------------------------------------------- */

/** 1. Usage minimal — les 5 bowls signature Bowly's sont fournis par défaut. */
export function CoverflowDemoDefault() {
  return <Coverflow3DCarousel />;
}

/** 2. Usage piloté — on fournit ses propres plats et sa propre palette. */
const customDishes: CoverflowDish[] = [
  {
    tag: "Édition limitée",
    titleLine1: "Truffe",
    titleLine2: "& Crunch",
    desc: "Exemple de plat personnalisé : même structure de données que `defaultDishes`.",
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
    alt: "Toppings croustillants : graines torréfiées, oignons frits et herbes",
    ctaText: "Voir le menu",
    ctaUrl: "/menu",
  },
  ...defaultDishes.slice(0, 4),
];

export function CoverflowDemoCustom() {
  return (
    <Coverflow3DCarousel
      dishes={customDishes}
      accentColor="#ff5a1f"
      backgroundColor="#0c0a09"
      autoPlay
      autoPlayInterval={6000}
      ariaLabel="Sélection du moment"
    />
  );
}
