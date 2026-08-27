"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LIEN_COMMANDE } from "@/lib/site";
import { ETAPES, lisibleSur, resumePrix, trouverIngredient, type Etape } from "@/lib/recette";
import { RECETTE_INITIALE, setRecette, type Recette } from "@/lib/stage";

/**
 * ACTE III — L'ATELIER
 *
 * « Ton bowl. Tes règles. »
 *
 * Ce qui distingue cette section d'un formulaire de commande : chaque choix
 * modifie **l'objet 3D déjà à l'écran**. Il n'y a pas d'aperçu séparé, pas de
 * seconde image à charger — c'est le même bowl que le visiteur regarde depuis
 * le premier écran qui change de riz, de sauce et de toppings sous ses yeux.
 *
 * COMMENT LE LIEN EST FAIT
 * L'état vit ici, en React, parce que c'est l'interface qui le manipule. Il
 * est poussé dans le pilote partagé (`setRecette`) à chaque changement ; la
 * scène s'y abonne et se redessine. Un seul sens de circulation, donc pas de
 * boucle de synchronisation possible.
 *
 * ACCESSIBILITÉ
 * Les choix uniques sont de vrais groupes de boutons radio et les choix
 * multiples de vraies cases à cocher, avec `fieldset`/`legend`. Au clavier,
 * les flèches parcourent un groupe et la tabulation passe au suivant — le
 * comportement natif, gratuit, qu'une grille de `<div>` aurait fait perdre.
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
        const suivant = [...actuel, id];
        return { ...r, [etape]: suivant.slice(-maximum) };
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
        {/* La colonne reste à gauche : la moitié droite est laissée libre
            pour que le bowl 3D, décalé par la caméra pendant cet acte, reste
            visible pendant qu'on compose. */}
        <div className="lg:max-w-[36rem]">
          <Reveal>
            <p className="kicker text-crisp">Acte III — L&apos;atelier</p>
            <h2 id="atelier-titre" className="poster-title text-bone mt-5">
              Ton bowl.
              <br />
              <span className="text-brand">Tes règles.</span>
            </h2>
            <p className="lead mt-5">
              Chaque choix modifie le bowl à l&apos;écran. En vrai, c&apos;est
              pareil : on compose devant toi.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col gap-9">
            {ETAPES.map((etape, index) => (
              <Reveal key={etape.id} delay={index * 0.04}>
                <fieldset className="border-none p-0">
                  <legend className="mb-4 flex w-full items-baseline gap-3">
                    <span
                      className="font-poster text-brand text-xl leading-none"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                    <span className="text-bone text-base font-bold">{etape.titre}</span>
                    <span className="text-bone-faint text-xs">{etape.consigne}</span>
                  </legend>

                  <div className="flex flex-wrap gap-2">
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
                          className={cn(
                            "group relative flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 transition-all duration-300 ease-[var(--ease-out)]",
                            actif
                              ? "border-transparent"
                              : "border-line hover:border-line-strong bg-void-2/70",
                          )}
                          style={
                            actif
                              ? {
                                  // La pastille prend la couleur de son
                                  // ingrédient : le lien avec la 3D est
                                  // visible avant même de regarder le bowl.
                                  backgroundColor: option.couleur,
                                  // Encre ou os selon la luminance de la
                                  // pastille — jamais une couleur figée.
                                  color: lisibleSur(option.couleur),
                                  boxShadow: `0 0 0 1px ${option.couleur}, 0 14px 40px -16px ${option.couleur}`,
                                }
                              : undefined
                          }
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

                          {actif ? (
                            <Check size={14} aria-hidden="true" />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="size-3 shrink-0 rounded-full"
                              style={{ backgroundColor: option.couleur, opacity: 0.75 }}
                            />
                          )}

                          <span
                            className={cn(
                              "text-sm font-semibold whitespace-nowrap",
                              // Quand la pastille est active, la couleur est
                              // posée en ligne par `lisibleSur` sur le parent.
                              !actif && "text-bone-dim group-hover:text-bone",
                            )}
                          >
                            {option.nom}
                          </span>

                          {option.marqueur && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[0.6rem] font-bold tracking-wide uppercase",
                                actif ? "bg-black/15" : "bg-void-3 text-bone-dim",
                              )}
                            >
                              {option.marqueur}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </Reveal>
            ))}
          </div>

          {/* --- Le récapitulatif ------------------------------------------ */}
          <Reveal delay={0.1}>
            <div className="surface mt-12 rounded-3xl p-7">
              <p className="kicker text-crisp">Ton bowl est prêt</p>

              {/* `aria-live` : le récapitulatif change sans navigation, un
                  lecteur d'écran doit l'entendre évoluer. */}
              <p
                aria-live="polite"
                className="text-bone mt-4 text-lg leading-snug font-bold"
              >
                {recapitulatif.join(" · ")}
              </p>

              <div className="border-line mt-6 flex flex-wrap items-end justify-between gap-6 border-t pt-6">
                <div>
                  <p className="text-bone-faint text-xs">
                    {prix.inclus}
                    {prix.supplements > 0 && ` + ${prix.supplements} supplément${prix.supplements > 1 ? "s" : ""}`}
                  </p>
                  <p className="font-poster text-crisp tabular mt-1 text-4xl">
                    {prix.total}
                  </p>
                </div>

                <Button asChild size="lg" data-curseur="Commander">
                  <Link href={LIEN_COMMANDE}>
                    Commander mon bowl
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {/* Le prix est un placeholder assumé : le dire ici plutôt que
                  de laisser croire à un bug d'affichage. */}
              <p className="text-bone-faint mt-4 text-xs">
                Le calcul fonctionne, la grille tarifaire n&apos;est pas encore
                arrêtée : chaque montant reste affiché{" "}
                <span className="text-bone-dim">[X €]</span> tant qu&apos;il
                n&apos;a pas été fourni.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
