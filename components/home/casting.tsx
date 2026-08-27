"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";

import { CadrePhoto, Etiquette, Numero } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { visuelBowl } from "@/lib/assets";
import { accentDe, getVedettes, type Bowl } from "@/lib/menu-data";

/**
 * LE CASTING — le mur de tirages.
 *
 * CE QUI A CHANGÉ, ET POURQUOI
 * Avant : quatre cartes identiques à coins arrondis, alignées, ombres floues,
 * halo dégradé au survol. C'est la vignette e-commerce par défaut, et c'est
 * exactement ce que le client a désigné en disant « les rectangles ».
 *
 * Maintenant : des TIRAGES PAPIER punaisés au mur. Bordure épaisse, ombre
 * portée dure et décalée, chaque tirage penché différemment, étiquette collée
 * de travers, et le nom du bowl qui déborde par-dessus l'image. Rien n'est
 * aligné sur rien : c'est ce désalignement qui fait la différence entre un
 * assemblage d'atelier et une grille générée.
 *
 * Le défilement reste natif (`overflow-x`), donc utilisable au doigt et au
 * clavier. On ne détourne pas le scroll vertical.
 */
export function Casting() {
  const piste = React.useRef<HTMLUListElement>(null);
  const bowls = getVedettes();

  const glisser = (sens: 1 | -1) => {
    const el = piste.current;
    if (!el) return;
    const carte = el.firstElementChild as HTMLElement | null;
    const pas = carte ? carte.offsetWidth + 28 : el.clientWidth * 0.8;
    el.scrollBy({ left: pas * sens, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="casting-titre"
      className="bg-beurre papier bord-dechire-haut relative py-24 md:py-32"
      style={{ ["--bord" as string]: "var(--beurre)" }}
    >
      <div className="bowly-wide relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="kicker text-rouge-fonce">Le casting</p>
            <h2 id="casting-titre" className="poster-title text-encre mt-4">
              Ils ont tous
              <br />
              <span className="souligne-main">un caractère.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex items-center gap-3">
            {/* Boutons d'appoint : le contenu reste atteignable sans eux. */}
            <button
              type="button"
              onClick={() => glisser(-1)}
              aria-label="Faire défiler vers la gauche"
              className="border-encre text-encre hover:bg-encre hover:text-creme flex size-12 items-center justify-center rounded-[var(--radius)] border-2 shadow-[3px_3px_0_var(--encre)] transition-colors duration-200"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => glisser(1)}
              aria-label="Faire défiler vers la droite"
              className="border-encre text-encre hover:bg-encre hover:text-creme flex size-12 items-center justify-center rounded-[var(--radius)] border-2 shadow-[3px_3px_0_var(--encre)] transition-colors duration-200"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </Reveal>
        </div>
      </div>

      {/* Les tirages débordent du conteneur : ils touchent le bord de l'écran,
          ce qui dit qu'il y a une suite sans avoir à l'écrire. */}
      <ul
        ref={piste}
        tabIndex={0}
        aria-label="Les bowls signature"
        className="focus-visible:outline-rouge-fonce mt-16 flex snap-x snap-mandatory gap-7 overflow-x-auto px-5 pt-6 pb-12 md:px-10 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {bowls.map((bowl, i) => (
          <Tirage key={bowl.id} bowl={bowl} rang={i} />
        ))}

        <li className="w-[76vw] shrink-0 snap-start sm:w-[21rem]">
          <div className="border-encre bg-carton flex h-full flex-col items-start justify-center gap-5 border-4 p-9 shadow-[6px_6px_0_var(--encre)]">
            <Numero className="text-6xl" ton="rouge">
              +3
            </Numero>
            <p className="poster-section text-encre">
              Et les
              <br />
              autres.
            </p>
            <p className="text-encre-douce text-sm">
              Sept bowls, cinq sauces maison, et de quoi en composer bien plus.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu">Voir la carte</Link>
            </Button>
          </div>
        </li>
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Trois inclinaisons qui tournent, pour qu'aucun voisin ne penche pareil. */
const INCLINAISONS = [1, 3, 2] as const;

function Tirage({ bowl, rang }: { bowl: Bowl; rang: number }) {
  const accent = accentDe(bowl);
  const visuel = visuelBowl(bowl.id);
  const inclinaison = INCLINAISONS[rang % INCLINAISONS.length];

  return (
    <li className="w-[76vw] shrink-0 snap-start sm:w-[21rem]">
      <Link
        href="/menu"
        data-curseur="Voir"
        className="focus-visible:outline-rouge-fonce group block"
      >
        <CadrePhoto
          inclinaison={inclinaison}
          className="p-3 transition-transform duration-300 ease-[var(--ease-snap)] group-hover:rotate-0 group-hover:-translate-y-1"
        >
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ backgroundColor: `${accent}22` }}
          >
            <Image
              src={visuel.src}
              alt={visuel.alt}
              fill
              sizes="(max-width: 640px) 76vw, 21rem"
              loading={rang === 0 ? "eager" : "lazy"}
              // Une photo se recadre, une illustration se pose entière : les
              // deux ne se traitent pas pareil, et `estPhoto` le dit.
              className={cn(
                "transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]",
                visuel.estPhoto ? "object-cover" : "object-contain p-2",
              )}
            />

            {/* Intensité : des flammes tamponnées dans un coin, pas une
                pastille centrée. */}
            {bowl.intensite > 0 && (
              <span
                role="img"
                aria-label={`Intensité : ${bowl.intensite} sur 3`}
                className="bg-encre absolute top-3 right-3 flex items-center gap-0.5 px-2 py-1.5"
              >
                {Array.from({ length: bowl.intensite }).map((_, i) => (
                  <Flame key={i} size={12} className="text-jaune" aria-hidden="true" />
                ))}
              </span>
            )}

            {bowl.etiquettes[0] && (
              <Etiquette
                inclinaison={inclinaison === 1 ? 3 : 1}
                ton={rang % 2 === 0 ? "jaune" : "vert"}
                className="absolute bottom-3 left-3"
              >
                {bowl.etiquettes[0]}
              </Etiquette>
            )}
          </div>

          {/* Le pied du tirage : nom, réplique, prix. Le nom déborde
              volontairement de la largeur de l'image. */}
          <div className="px-1 pt-4 pb-1">
            <h3 className="poster-section text-encre -mx-1">{bowl.nom}</h3>
            <p className="text-encre-douce mt-2 text-sm leading-snug">
              {bowl.temperament}
            </p>
            <div className="border-trait mt-4 flex items-baseline justify-between border-t pt-3">
              <span className="text-encre-faible text-xs">
                {bowl.etiquettes.slice(1).join(" · ") || "Toute l'année"}
              </span>
              <span className="font-poster text-rouge-fonce tabular text-2xl">
                {bowl.prix}
              </span>
            </div>
          </div>
        </CadrePhoto>
      </Link>
    </li>
  );
}
