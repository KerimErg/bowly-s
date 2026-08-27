"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";

import { Numero } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LIEN_COMMANDE } from "@/lib/site";
import { visuelBowl } from "@/lib/assets";
import { accentDe, familles, getCarte, type Bowl, type Famille } from "@/lib/menu-data";

/**
 * LA CARTE — page complète.
 *
 * Pas une grille de vignettes. Chaque bowl occupe une bande pleine largeur,
 * en alternance gauche/droite, avec son nom en très gros et sa réplique. On
 * fait défiler un casting, pas un catalogue.
 *
 * FILTRAGE
 * Les familles sont de vrais boutons dans un groupe `role="tablist"` ; le
 * comptage est annoncé et la liste filtrée porte `aria-live` pour que le
 * changement soit perçu sans voir l'écran. Filtrer en client plutôt qu'en
 * naviguant : la carte tient en sept plats, un aller-retour réseau serait
 * plus lent que le rendu.
 */
export function Carte() {
  const [famille, setFamille] = React.useState<Famille | "tout">("tout");
  const tous = getCarte();

  const visibles = famille === "tout" ? tous : tous.filter((b) => b.famille === famille);

  const onglets: { id: Famille | "tout"; label: string; ligne: string }[] = [
    { id: "tout", label: "Tout", ligne: "Les sept, dans l'ordre." },
    ...familles,
  ];

  return (
    <>
      {/* --- Filtres ------------------------------------------------------- */}
      <div className="border-trait bg-creme/85 sticky top-[4.5rem] z-[90] border-y backdrop-blur-xl">
        <div className="bowly-wide flex items-center gap-3 overflow-x-auto py-4 [&::-webkit-scrollbar]:hidden">
          <div role="tablist" aria-label="Filtrer par famille" className="flex gap-2">
            {onglets.map((onglet) => {
              const actif = famille === onglet.id;
              const nb =
                onglet.id === "tout"
                  ? tous.length
                  : tous.filter((b) => b.famille === onglet.id).length;

              return (
                <button
                  key={onglet.id}
                  type="button"
                  role="tab"
                  aria-selected={actif}
                  onClick={() => setFamille(onglet.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-[var(--ease-out)]",
                    actif
                      ? "bg-rouge text-encre shadow-[4px_4px_0_var(--encre)]"
                      : "border-trait text-encre-douce hover:border-trait-fort hover:text-encre border",
                  )}
                >
                  {onglet.label}
                  <span className={cn("tabular text-xs", actif ? "text-encre/60" : "text-encre-faible")}>
                    {nb}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- La ligne d'intention de la famille choisie --------------------- */}
      <p className="bowly-wide text-encre-faible py-6 text-sm" aria-live="polite">
        {onglets.find((o) => o.id === famille)?.ligne} — {visibles.length} sur {tous.length}.
      </p>

      {/* --- Les bandes ---------------------------------------------------- */}
      <ul className="pb-24">
        {visibles.map((bowl, i) => (
          <Bande key={bowl.id} bowl={bowl} position={i} />
        ))}
      </ul>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Bande({ bowl, position }: { bowl: Bowl; position: number }) {
  const accent = accentDe(bowl);
  const visuel = visuelBowl(bowl.id);
  const aGauche = position % 2 === 0;

  return (
    /* `overflow-x-clip` et non `overflow-hidden` : on veut couper le
       débordement horizontal SANS créer de conteneur de défilement, ce qui
       casserait le `sticky` de la barre de filtres au-dessus.
       Ce qui déborde ici, c'est le décalage d'entrée de `Reveal from="droite"`
       (26 px de translation). Il n'affecte pas la mise en page mais il élargit
       la zone défilable du document : sur un écran de 360 px, Chrome dézoomait
       toute la page pour la faire tenir. */
    <li className="border-trait group overflow-x-clip border-b">
      <article
        className="bowly-wide grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20"
        style={{ ["--accent" as string]: accent }}
      >
        {/* --- Le visuel --- */}
        <div className={cn("relative", !aGauche && "lg:order-2")}>
          {/* Aplat teinté de la couleur du plat, dans un cadre franc — plutôt
              qu'un halo flou, qui était l'un des marqueurs « rendu généré ». */}
          <div
            className="border-encre relative mx-auto aspect-square w-full max-w-md overflow-hidden border-4 shadow-[8px_8px_0_var(--encre)]"
            style={{ backgroundColor: `${accent}26` }}
          >
            <Image
              src={visuel.src}
              alt={visuel.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 28rem"
              // Les deux premières bandes sont au-dessus de la ligne de
              // flottaison sur grand écran ; les autres se chargent en
              // arrivant.
              loading={position < 2 ? "eager" : "lazy"}
              className={cn(
                "transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]",
                visuel.estPhoto ? "object-cover" : "object-contain",
              )}
            />
          </div>
        </div>

        {/* --- Le texte --- */}
        <div className={cn(!aGauche && "lg:order-1")}>
          <Reveal from={aGauche ? "droite" : "gauche"}>
            <div className="flex items-center gap-4">
              {/* ⚠️ Le numéro N'EST PLUS de la couleur du plat.
                  Les accents sont choisis pour la nourriture (un vert
                  d'herbes, un orange de patate douce) : posés en texte sur du
                  crème, plusieurs tombaient sous 4,5:1 — le contrôle
                  d'accessibilité les a attrapés. La couleur du plat reste
                  partout ailleurs (halo, fond du visuel) ; le texte, lui,
                  utilise les encres de la charte. */}
              <Numero className="text-4xl" ton="rouge">
                {String(position + 1).padStart(2, "0")}
              </Numero>
              <span className="bg-trait-fort h-px flex-1" aria-hidden="true" />
              {bowl.intensite > 0 && (
                <span
                  role="img"
                  className="flex items-center gap-1"
                  aria-label={`Intensité : ${bowl.intensite} sur 3`}
                >
                  {Array.from({ length: bowl.intensite }).map((_, i) => (
                    <Flame key={i} size={13} className="text-rouge-fonce" aria-hidden="true" />
                  ))}
                </span>
              )}
            </div>

            <h2 className="poster-title text-encre group-hover:text-rouge-fonce mt-6 transition-colors duration-300">
              {bowl.nom}
            </h2>

            <p className="text-encre mt-4 text-xl font-bold">{bowl.temperament}</p>
            <p className="text-encre-douce mt-4 max-w-md text-sm leading-relaxed">
              {bowl.composition}
            </p>

            {bowl.etiquettes.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {bowl.etiquettes.map((e) => (
                  <li
                    key={e}
                    className="border-trait text-encre-douce rounded-full border px-3 py-1 text-xs"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <span className="font-poster text-rouge-fonce tabular text-4xl">{bowl.prix}</span>
              <Button asChild variant="outline" data-curseur="Commander">
                <Link href={LIEN_COMMANDE}>
                  Commander
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </article>
    </li>
  );
}
