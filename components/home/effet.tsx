"use client";

import * as React from "react";
import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TODO } from "@/lib/site";

/**
 * L'EFFET BOWLY'S
 *
 * ⚠️ SECTION SENSIBLE — LA TENTATION EST D'Y MENTIR.
 * C'est l'endroit d'un site de marque où l'on met « 120 000 clients », « 40
 * restaurants », « noté 4,9 ». Bowly's n'a rien de tout ça : la marque
 * n'existe pas encore physiquement. Aucun chiffre n'est donc affiché, aucune
 * ville n'est nommée, et les emplacements sont marqués `[À COMPLÉTER]`.
 *
 * L'ambition se raconte autrement : une carte vide qui demande à être
 * remplie. « Quelle ville ? » est une question plus forte qu'un chiffre
 * inventé — et elle transforme le visiteur en participant.
 *
 * L'HEXAGONE
 * La France y est traitée comme ce qu'on l'appelle : un hexagone. Ce n'est
 * pas un contour géographique approximatif — un tracé imprécis aurait
 * l'air d'une erreur, là où la figure géométrique est un parti pris lisible.
 */

/** Points d'un maillage triangulaire, découpés par un hexagone régulier. */
function maillageHexagonal(pas: number, rayon: number) {
  const points: { x: number; y: number; index: number }[] = [];
  const hauteurRangee = (pas * Math.sqrt(3)) / 2;
  let index = 0;

  for (let y = -rayon; y <= rayon; y += hauteurRangee) {
    const decalage = Math.round(y / hauteurRangee) % 2 === 0 ? 0 : pas / 2;
    for (let x = -rayon; x <= rayon; x += pas) {
      const px = x + decalage;
      // Test d'appartenance à un hexagone régulier pointe en haut.
      const q = Math.abs(px) / rayon;
      const r = Math.abs(y) / rayon;
      if (q > 0.866 || r + q * 0.577 > 1) continue;
      points.push({ x: px, y, index: index++ });
    }
  }
  return points;
}

/**
 * Les emplacements pressentis.
 *
 * Positions choisies pour l'équilibre du dessin, PAS pour désigner des villes
 * réelles : rien n'est arrêté, et suggérer le contraire serait mentir. Le
 * jour où une adresse existe, elle remplace un `[À COMPLÉTER]` ici.
 */
const EMPLACEMENTS = [
  { x: 4, y: -46, rang: "01" },
  { x: -38, y: -14, rang: "02" },
  { x: 40, y: 2, rang: "03" },
  { x: -14, y: 30, rang: "04" },
  { x: 22, y: 48, rang: "05" },
];

export function Effet() {
  const points = React.useMemo(() => maillageHexagonal(7.2, 78), []);
  const [actif, setActif] = React.useState<string | null>(null);

  return (
    // `overflow-hidden` : les halos décoratifs sont volontairement plus larges
    // que la section, et la carte SVG est mise à l'échelle. Sans clip, ils
    // élargissent la zone défilable — ce qui, sur mobile, pousse Chrome à
    // dézoomer toute la page pour la faire tenir (le bouton de menu se
    // retrouvait alors à moitié hors écran).
    <section aria-labelledby="effet-titre" className="relative overflow-hidden py-24 md:py-32">
      <div className="bowly-wide grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="kicker text-vert-fonce">L&apos;effet Bowly&apos;s</p>
            <h2 id="effet-titre" className="poster-title text-encre mt-5">
              La prochaine
              <br />
              <span className="text-rouge-fonce">obsession.</span>
            </h2>
            <p className="lead mt-6 max-w-md">
              Aucun restaurant n&apos;a encore ouvert. Cinq emplacements sont à
              l&apos;étude. Le premier qui ouvre décidera de la suite.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
              {/* Trois indicateurs, trois placeholders assumés. Le gabarit
                  est prêt ; les valeurs viendront quand elles existeront. */}
              {[
                ["Restaurants ouverts", "0", "À ce jour"],
                ["Emplacements à l'étude", "5", "Villes non arrêtées"],
                ["Ouverture", TODO, "Calendrier non fixé"],
              ].map(([label, valeur, note]) => (
                <div key={label}>
                  <dt className="kicker text-encre-faible">{label}</dt>
                  {/* Un `<div>` fils de `<dl>` ne peut contenir QUE des `<dt>`
                      et des `<dd>`. La note était dans un `<p>` : structure
                      invalide, signalée par axe. Elle vit maintenant dans le
                      `<dd>`, ce qui est aussi plus juste sémantiquement —
                      c'est une précision sur la valeur.
                      `overflow-wrap: anywhere` : « [À COMPLÉTER] » est un mot
                      long et insécable ; en Anton, à 30 px, il dépassait une
                      colonne de 163 px sur un écran de 390. */}
                  <dd className="mt-2">
                    <span className="font-poster text-rouge-fonce tabular block text-2xl [overflow-wrap:anywhere] sm:text-3xl">
                      {valeur}
                    </span>
                    <span className="text-encre-faible mt-1 block text-xs">{note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" data-curseur="Proposer">
                <Link href="/contact">Propose ta ville</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/restaurants">Suivre les ouvertures</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* --- La carte ---------------------------------------------------- */}
        <Reveal from="droite" delay={0.1}>
          <div className="relative">
            

            {/* `role="group"` et non `role="img"` : un élément de rôle `img`
                ne peut pas contenir de descendants interactifs, et cette
                carte compte cinq points focusables. */}
            <svg
              viewBox="-100 -100 200 200"
              role="group"
              aria-label="Carte des emplacements à l'étude : hexagone pointillé figurant la France, cinq points, aucune ville arrêtée."
              className="relative w-full"
            >
              {points.map((p) => (
                <circle
                  key={p.index}
                  cx={p.x}
                  cy={p.y}
                  r={0.9}
                  fill="var(--bone)"
                  opacity={0.16}
                />
              ))}

              {EMPLACEMENTS.map((e) => {
                const ouvert = actif === e.rang;
                return (
                  <g key={e.rang}>
                    {/* Halo pulsé, purement décoratif. */}
                    <circle
                      cx={e.x}
                      cy={e.y}
                      r={ouvert ? 11 : 8}
                      fill="var(--brand)"
                      opacity={ouvert ? 0.35 : 0.18}
                      className="pulse-slow"
                      style={{ transformOrigin: `${e.x}px ${e.y}px` }}
                    />
                    {/* Cible réellement focusable : `tabindex` sur un élément
                        SVG interactif, sinon la carte est inutilisable sans
                        souris. */}
                    <circle
                      cx={e.x}
                      cy={e.y}
                      r={3.4}
                      fill="var(--brand)"
                      tabIndex={0}
                      role="button"
                      aria-label={`Emplacement ${e.rang} — ville ${TODO}`}
                      onFocus={() => setActif(e.rang)}
                      onBlur={() => setActif(null)}
                      onMouseEnter={() => setActif(e.rang)}
                      onMouseLeave={() => setActif(null)}
                      className="focus-visible:outline-rouge-fonce cursor-pointer transition-all duration-300"
                    />
                    <text
                      x={e.x + 7}
                      y={e.y + 1.5}
                      fontSize="5"
                      fontWeight="700"
                      fill="var(--bone-dim)"
                      className={cn(
                        "transition-opacity duration-300",
                        ouvert ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {TODO}
                    </text>
                  </g>
                );
              })}
            </svg>

            <p className="text-encre-faible mt-6 text-center text-xs">
              Les cinq points figurent des emplacements à l&apos;étude. Aucune
              ville n&apos;est arrêtée : les libellés resteront{" "}
              <span className="text-encre-douce">[À COMPLÉTER]</span> jusqu&apos;à
              la signature d&apos;un bail.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
