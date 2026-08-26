import type { Metadata } from "next";

import { MenuExplorer } from "@/components/menu/menu-explorer";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { photos } from "@/lib/images";
import { getMenu } from "@/lib/menu-data";
import { TODO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le menu",
  description:
    "Découvrez la carte Bowly's : bowls au poulet croustillant, végé, saumon et protéinés, composés avec des produits frais et des toppings qui craquent.",
};

export default function MenuPage() {
  /* TODO(back-office) : `getMenu()` lira un CMS / une API le moment venu. */
  const items = getMenu();

  return (
    <>
      <PageHero
        eyebrow="La carte"
        title={
          <>
            Composez votre <span className="text-brand">bowl</span>.
          </>
        }
        description="Sept recettes. Pas une de trop. Tout s'ajuste au comptoir."
        photo={photos.heroSecondary}
      />

      <section aria-labelledby="carte-titre" className="bowly-container py-16 lg:py-24">
        {/* Titre de niveau 2 masqué : garde une hiérarchie h1 > h2 > h3
            cohérente pour les lecteurs d'écran, les cartes étant des h3. */}
        <h2 id="carte-titre" className="sr-only">
          Tous nos bowls
        </h2>

        <MenuExplorer items={items} />

        <Reveal className="border-line bg-sand mt-16 rounded-3xl border p-8 sm:p-10">
          <h2 className="font-display text-ink text-xl font-extrabold tracking-tight">
            À propos des prix et des allergènes
          </h2>
          <p className="text-ink-soft mt-4 max-w-3xl text-sm leading-relaxed">
            Les tarifs affichés sous la forme <strong className="text-brand-ink">[X €]</strong>{" "}
            sont des emplacements réservés : la grille tarifaire définitive n&apos;est
            pas encore arrêtée. Liste complète des allergènes et informations
            nutritionnelles : {TODO}.
          </p>
        </Reveal>
      </section>
    </>
  );
}
