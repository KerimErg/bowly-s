"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Etiquette } from "@/components/shared/decor";
import { LignesRevelees, Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { LIEN_COMMANDE } from "@/lib/site";

/**
 * ACTE I — LE PORTAIL
 *
 * Le premier écran ne vend rien : il pose un objet sur la table et laisse les
 * ingrédients y tomber. Le texte arrive après le mouvement — c'est ce décalage
 * qui fait qu'on regarde le bowl au lieu de lire un titre.
 *
 * POURQUOI CE PREMIER ÉCRAN EST CLAIR
 * Il a d'abord été presque noir, puis brun brûlé. Dans les deux cas le même
 * problème : la première impression était sombre, et un plat sur fond sombre
 * est un plat en vitrine — on l'admire, on n'a pas faim. Sur un fond crème
 * chaud, le même bowl est posé sur une table, avec son ombre, et l'appétit
 * revient. Le sombre existe encore sur ce site, mais il est devenu une
 * ponctuation : le teasing et le pied de page, rien d'autre.
 */
export function Portail() {
  const reduit = useReducedMotion();

  return (
    <section
      id="portail"
      aria-labelledby="portail-titre"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-10"
    >
      {/* Voile de lisibilité. Sans lui, le titre passerait par-dessus la partie
          la plus sombre du bol 3D. Il est crème et non noir : c'est le fond de
          la page qui remonte, pas une ombre ajoutée. */}
      <div
        aria-hidden="true"
        className="from-creme via-creme/75 pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t to-transparent"
      />

      {/* --- Haut : l'étiquette --- */}
      <Reveal au="montage" delay={0.1} className="bowly-wide relative">
        <div className="flex flex-wrap items-center gap-4">
          <p className="kicker text-encre-faible flex items-center gap-3">
            <span className="bg-rouge inline-block size-2" aria-hidden="true" />
            Bowly&apos;s — Enter the bowl
          </p>
          <Etiquette ton="jaune" inclinaison={2}>
            Ouverture [À COMPLÉTER]
          </Etiquette>
        </div>
      </Reveal>

      {/* --- Bas : l'affiche --- */}
      <div className="bowly-wide relative">
        <LignesRevelees
          as="h1"
          delaiInitial={0.35}
          className="poster text-encre"
          lignes={[
            <React.Fragment key="1">PAS UN BOWL.</React.Fragment>,
            <span key="2" className="text-rouge">
              UNE EXPÉRIENCE.
            </span>,
          ]}
        />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal au="montage" delay={0.75}>
            <p className="text-encre-douce max-w-sm text-lg leading-snug">
              Composé devant toi. Croustillant à la commande.
              <br />
              Servi en cinq minutes.
            </p>
          </Reveal>

          <Reveal au="montage" delay={0.9}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="xl" data-curseur="Commander">
                <Link href={LIEN_COMMANDE}>
                  Commander
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                {/* Ancre interne : la descente commence juste dessous. */}
                <a href="#descente">Découvrir Bowly&apos;s</a>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* --- Indice de défilement ---
            Un site qui commence par un objet immobile a besoin de dire qu'il se
            passe quelque chose plus bas. */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex items-center gap-4"
        >
          <span className="bg-encre/20 relative block h-12 w-0.5 overflow-hidden">
            {!reduit && (
              <motion.span
                className="bg-rouge absolute inset-x-0 top-0 block h-4"
                animate={{ y: ["-100%", "300%"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </span>
          <span className="kicker text-encre-faible">Descends dans le bowl</span>
        </motion.div>
      </div>
    </section>
  );
}
