"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { LignesRevelees, Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { LIEN_COMMANDE } from "@/lib/site";

/**
 * ACTE I — LE PORTAIL
 *
 * Le premier écran ne vend rien : il pose un objet dans le noir et laisse
 * les ingrédients y tomber. Le texte arrive après le mouvement, pas avant —
 * c'est ce décalage qui fait qu'on regarde le bowl au lieu de lire un titre.
 *
 * MISE EN PAGE
 * Le bowl 3D est centré derrière la page. Le bloc typographique est calé en
 * bas et **mord volontairement sur le bowl** : c'est ce chevauchement qui
 * crée la profondeur. Un voile dégradé remonte du bas pour garantir le
 * contraste du texte quel que soit ce que la scène affiche à cet instant.
 */
export function Portail() {
  const reduit = useReducedMotion();

  return (
    <section
      id="portail"
      aria-labelledby="portail-titre"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-10"
    >
      {/* Voile de lisibilité. Il ne sert pas à décorer : sans lui, le titre
          passerait par-dessus la partie la plus claire du dôme 3D. */}
      <div
        aria-hidden="true"
        className="from-void via-void/70 pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t to-transparent"
      />

      {/* --- Haut : l'étiquette --- */}
      <Reveal au="montage" delay={0.1} className="bowly-wide relative">
        <p className="kicker text-bone-faint flex items-center gap-3">
          <span className="bg-brand inline-block size-1.5 rounded-full" aria-hidden="true" />
          Bowly&apos;s — Enter the bowl
        </p>
      </Reveal>

      {/* --- Bas : l'affiche --- */}
      <div className="bowly-wide relative">
        <LignesRevelees
          as="h1"
          delaiInitial={0.35}
          className="poster text-bone"
          lignes={[
            <React.Fragment key="1">PAS UN BOWL.</React.Fragment>,
            <span key="2" className="text-brand">
              UNE EXPÉRIENCE.
            </span>,
          ]}
        />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal au="montage" delay={0.75}>
            <p className="lead max-w-sm">
              Composé devant toi. Croustillant à la commande.
              <br />
              Servi en cinq minutes.
            </p>
          </Reveal>

          <Reveal au="montage" delay={0.9}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            Un site qui commence par un objet immobile a besoin de dire qu'il
            se passe quelque chose plus bas. Le trait descend en boucle. */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex items-center gap-4"
        >
          <span className="bg-line-strong relative block h-12 w-px overflow-hidden">
            {!reduit && (
              <motion.span
                className="bg-crisp absolute inset-x-0 top-0 block h-4"
                animate={{ y: ["-100%", "300%"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </span>
          <span className="kicker text-bone-faint">Descends dans le bowl</span>
        </motion.div>
      </div>
    </section>
  );
}
