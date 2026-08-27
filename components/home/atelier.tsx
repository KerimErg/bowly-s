"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { Numero, Tampon } from "@/components/shared/decor";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LIEN_COMMANDE } from "@/lib/site";
import { ETAPES, lisibleSur, resumePrix, trouverIngredient, type Etape } from "@/lib/recette";
import { RECETTE_INITIALE, setRecette, type Recette } from "@/lib/stage";

/**
 * ACTE III — L'ATELIER : le carnet de commande.
 *
 * CE QUI A CHANGÉ, ET POURQUOI
 * Avant : cinq rangées de pilules arrondies sur fond noir. Fonctionnel, et
 * parfaitement anonyme — le composant « groupe de tags » qu'on voit partout.
 *
 * Maintenant : un CARNET À SOUCHES posé sur la table. Papier kraft, bord
 * supérieur déchiré, lignes numérotées à la main, cases à cocher carrées, et
 * le total tamponné en bas comme sur un vrai ticket. La métaphore n'est pas
 * décorative : elle correspond à ce qui se passe réellement au comptoir, où
 * quelqu'un coche votre bowl sur un papier pendant que vous parlez.
 *
 * CE QUI N'A PAS CHANGÉ — et ne doit pas changer
 * Chaque choix modifie l'objet 3D déjà à l'écran. L'état vit en React, il est
 * poussé dans le pilote partagé, la scène s'y abonne. Un seul sens de
 * circulation.
 *
 * ACCESSIBILITÉ : de vrais `fieldset`, `radio` et `checkbox`. Les flèches
 * parcourent un groupe, la tabulation passe au suivant. Le carnet est un
 * habillage, jamais une réimplémentation de contrôles natifs.
 */
export function Atelier() {
  const [recette, setEtat] = React.useState<Recette>(RECETTE_INITIALE);

  /* Le pilote est notifié après le rendu : écrire dans un objet partagé
     pendant le rendu rendrait le composant non réentrant. */
  React.useEffect(() => {
    setRecette(recette);
  }, [recette]);

  const choisirUnique = React.useCallback((etape: Etape, id: string) => {
    setEtat((r) => ({ ...r, [etape]: id }));
  }, []);

  const basculerMultiple = React.useCallback(
    (etape: "toppings" | "extras", id: string, maximum: number) => {
      setEtat((r) => {
        const actuel = r[etape];
        if (actuel.includes(id)) {
          return { ...r, [etape]: actuel.filter((x) => x !== id) };
        }
        // Au-delà du maximum, le plus ancien choix cède la place. Refuser
        // silencieusement le clic laisserait l'utilisateur sans explication.
        return { ...r, [etape]: [...actuel, id].slice(-maximum) };
      });
    },
    [],
  );

  const prix = resumePrix(recette.toppings.length, recette.extras.length);

  const recapitulatif = [
    recette.base,
    recette.proteine,
    recette.sauce,
    ...recette.toppings,
    ...recette.extras,
  ]
    .map((id) => trouverIngredient(id)?.nom)
    .filter(Boolean) as string[];

  return (
    <section
      id="composer"
      aria-labelledby="atelier-titre"
      className="relative py-24 md:py-32"
    >
      <div className="bowly-wide">
        {/* La colonne reste à gauche : la moitié droite est laissée libre pour
            que le bowl 3D, décalé par la caméra pendant cet acte, reste
            visible pendant qu'on compose. */}
        <div className="lg:max-w-[38rem]">
          <Reveal>
            <p className="kicker text-rouge-fonce">Acte III — L&apos;atelier</p>
            <h2 id="atelier-titre" className="poster-title text-encre mt-4">
              Ton bowl.
              <br />
              <span className="souligne-main">Tes règles.</span>
            </h2>
            <p className="lead mt-5">
              Chaque choix modifie le bowl à l&apos;écran. En vrai, c&apos;est
              pareil : on compose devant toi.
            </p>
          </Reveal>

          {/* ---------- LE CARNET ---------- */}
          <Reveal delay={0.06}>
            <div className="bg-creme papier border-encre relative mt-12 border-4 shadow-[8px_8px_0_var(--encre)]">
              {/* Perforation du haut : la souche qu'on arrache. */}
              <div
                aria-hidden="true"
                className="border-encre flex items-center justify-between border-b-4 border-dashed px-6 py-4"
              >
                <span className="kicker text-encre-faible">Bowly&apos;s — bon de commande</span>
                <span className="kicker text-encre-faible tabular">N° [X]</span>
              </div>

              <div className="divide-encre/15 divide-y">
                {ETAPES.map((etape, index) => (
                  <fieldset key={etape.id} className="border-none px-6 py-6">
                    <legend className="mb-4 flex w-full items-baseline gap-3">
                      <Numero className="text-2xl" ton="rouge">
                        {String(index + 1).padStart(2, "0")}
                      </Numero>
                      <span className="text-encre text-base font-extrabold">
                        {etape.titre}
                      </span>
                      <span className="text-encre-faible text-xs">{etape.consigne}</span>
                    </legend>

                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                      {etape.options.map((option) => {
                        const multiple = etape.mode === "multiple";
                        const liste = multiple
                          ? recette[etape.id as "toppings" | "extras"]
                          : null;
                        const actif = multiple
                          ? liste!.includes(option.id)
                          : recette[etape.id as "base" | "proteine" | "sauce"] === option.id;

                        return (
                          <label
                            key={option.id}
                            className="group flex cursor-pointer items-center gap-2.5"
                          >
                            <input
                              type={multiple ? "checkbox" : "radio"}
                              name={etape.id}
                              checked={actif}
                              onChange={() =>
                                multiple
                                  ? basculerMultiple(
                                      etape.id as "toppings" | "extras",
                                      option.id,
                                      etape.maximum ?? 3,
                                    )
                                  : choisirUnique(etape.id, option.id)
                              }
                              className="sr-only"
                            />

                            {/* La case cochée. Carrée, à bord épais, remplie de
                                la couleur de l'ingrédient — c'est ce lien de
                                couleur qui relie la case au bowl 3D. */}
                            <span
                              aria-hidden="true"
                              className={cn(
                                "border-encre flex size-6 shrink-0 items-center justify-center border-2 transition-all duration-150",
                                actif
                                  ? "shadow-[2px_2px_0_var(--encre)]"
                                  : "bg-transparent group-hover:bg-carton",
                              )}
                              style={
                                actif
                                  ? {
                                      backgroundColor: option.couleur,
                                      color: lisibleSur(option.couleur),
                                    }
                                  : undefined
                              }
                            >
                              {actif && <Check size={15} strokeWidth={3.5} />}
                            </span>

                            <span className="flex flex-col leading-tight">
                              <span
                                className={cn(
                                  "text-sm font-bold transition-colors duration-150",
                                  actif
                                    ? "text-encre"
                                    : "text-encre-douce group-hover:text-encre",
                                )}
                              >
                                {option.nom}
                              </span>
                              <span className="text-encre-faible text-[0.68rem]">
                                {option.note}
                                {option.marqueur && ` · ${option.marqueur}`}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

              {/* ---------- LE PIED DU TICKET ---------- */}
              <div className="bg-carton border-encre border-t-4 border-dashed px-6 py-6">
                <p className="kicker text-encre-faible">Ton bowl est prêt</p>

                {/* `aria-live` : le récapitulatif change sans navigation, un
                    lecteur d'écran doit l'entendre évoluer. */}
                <p
                  aria-live="polite"
                  className="text-encre mt-3 text-base leading-snug font-bold"
                >
                  {recapitulatif.join(" · ")}
                </p>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <Tampon ton="rouge">Total</Tampon>
                    <span className="font-poster text-encre tabular text-4xl">
                      {prix.total}
                    </span>
                  </div>

                  <Button asChild size="lg" data-curseur="Commander">
                    <Link href={LIEN_COMMANDE}>
                      Commander mon bowl
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </Button>
                </div>

                <p className="text-encre-faible mt-4 text-xs">
                  {prix.inclus}
                  {prix.supplements > 0 &&
                    ` + ${prix.supplements} supplément${prix.supplements > 1 ? "s" : ""}`}
                  . Le calcul fonctionne, la grille tarifaire n&apos;est pas
                  encore arrêtée : chaque montant reste affiché{" "}
                  <span className="text-encre-douce font-bold">[X €]</span>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
