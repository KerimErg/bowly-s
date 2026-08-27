"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/* ========================================================================== */
/*  Apparition simple                                                         */
/* ========================================================================== */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Décalage en secondes, pour cascader plusieurs éléments d'une grille. */
  delay?: number;
  from?: "bas" | "gauche" | "droite";
  /** `vue` = au moment où l'élément entre à l'écran ; `montage` = tout de suite. */
  au?: "vue" | "montage";
  as?: "div" | "section" | "li" | "article" | "span" | "p";
};

/**
 * Amplitude du décalage d'entrée, en pixels.
 *
 * ⚠️ Les directions `gauche` et `droite` translatent horizontalement. Une
 * translation ne change pas la mise en page, mais elle ÉLARGIT LA ZONE
 * DÉFILABLE du document tant que l'élément n'est pas encore apparu. Sur un
 * bloc qui touche déjà le bord de l'écran, cela suffit à faire dézoomer toute
 * la page sur mobile. Tout conteneur d'un `Reveal` horizontal doit donc porter
 * `overflow-x-clip` — c'est le cas des bandes de la carte.
 */
const DECALAGE = 26;

export function Reveal({
  children,
  className,
  delay = 0,
  from = "bas",
  au = "vue",
  as = "div",
}: RevealProps) {
  const reduit = useReducedMotion();
  const Tag = motion[as];

  const variants: Variants = {
    cache: reduit
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: from === "bas" ? DECALAGE : 0,
          x: from === "gauche" ? -DECALAGE : from === "droite" ? DECALAGE : 0,
        },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: reduit ? 0.01 : 0.75,
        delay: reduit ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const declencheur =
    au === "montage"
      ? { animate: "visible" as const }
      : {
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.2, margin: "0px 0px -90px 0px" },
        };

  return (
    <Tag className={className} initial="cache" variants={variants} {...declencheur}>
      {children}
    </Tag>
  );
}

/* ========================================================================== */
/*  Révélation par ligne                                                      */
/* ========================================================================== */

/**
 * Le geste typographique du site : chaque ligne monte depuis sous une bande
 * qui la masque, comme un rideau qui se lève.
 *
 * Deux détails qui font la différence entre « correct » et « premium » :
 *  - le conteneur a un rembourrage HAUT ET BAS : sans le bas, les jambages
 *    (p, g, y) sont rognés par le `overflow: hidden` ; sans le haut, ce sont
 *    les accents des capitales — le É de « EXPÉRIENCE » disparaissait. La
 *    translation de départ vaut 135 % pour dégager ce rembourrage ;
 *  - les lignes ne partent pas ensemble. Le décalage de 90 ms donne la
 *    sensation de lecture ; à 0 ms l'effet ressemble à un simple fondu.
 */
export function LignesRevelees({
  lignes,
  className,
  ligneClassName,
  delaiInitial = 0,
  au = "montage",
  as: Tag = "h1",
}: {
  lignes: React.ReactNode[];
  className?: string;
  ligneClassName?: string;
  delaiInitial?: number;
  au?: "vue" | "montage";
  as?: "h1" | "h2" | "p" | "div";
}) {
  const reduit = useReducedMotion();

  const declencheur =
    au === "montage"
      ? { animate: "visible" as const }
      : {
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.4 },
        };

  return (
    <Tag className={className}>
      {lignes.map((ligne, i) => (
        <span key={i} className="block overflow-hidden pt-[0.1em] pb-[0.16em]">
          <motion.span
            className={cn("block", ligneClassName)}
            initial="cache"
            variants={{
              cache: reduit ? { opacity: 0 } : { y: "135%", opacity: 1 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: reduit ? 0.01 : 0.95,
                  delay: reduit ? 0 : delaiInitial + i * 0.09,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            {...declencheur}
          >
            {ligne}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ========================================================================== */
/*  Ruban défilant                                                            */
/* ========================================================================== */

/**
 * Bandeau de texte en défilement continu.
 *
 * Le contenu est dupliqué exactement deux fois et la piste se translate de
 * -50 % : la boucle est alors mathématiquement invisible, sans calcul de
 * largeur ni JavaScript. L'animation est coupée par `prefers-reduced-motion`
 * via la règle globale de `globals.css`.
 */
export function Ruban({
  mots,
  className,
  duree = 42,
  separateur = "✦",
}: {
  mots: string[];
  className?: string;
  duree?: number;
  separateur?: string;
}) {
  const serie = (
    <div className="flex shrink-0 items-center">
      {mots.map((mot, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6">{mot}</span>
          <span className="text-rouge-fonce" aria-hidden="true">
            {separateur}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("fade-edges-x overflow-hidden", className)} aria-hidden="true">
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${duree}s` } as React.CSSProperties}
      >
        {serie}
        {serie}
      </div>
    </div>
  );
}
