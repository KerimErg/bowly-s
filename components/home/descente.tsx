"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * ACTE II — LA DESCENTE
 *
 * L'idée qui tient tout le site : pendant que le visiteur fait défiler, la
 * caméra 3D plonge dans le bowl et les couches s'écartent au-dessus d'elle.
 * Chaque couche traversée est une section de la page. On ne lit pas une liste
 * d'arguments, on descend dans le produit.
 *
 * La 3D et le texte ne sont pas synchronisés par un minuteur mais par la même
 * grandeur : la progression de scroll. Ils ne peuvent donc pas se désaligner,
 * même si le visiteur scrolle à toute vitesse ou remonte.
 *
 * ⚠️ Quatre strates = quatre écrans. La chorégraphie de la caméra
 * (`ACTES.descente` dans `lib/stage.ts`) est calée sur ce nombre. En ajouter
 * une cinquième sans y retoucher désynchronise la caméra du texte.
 */

type Strate = {
  index: string;
  nom: string;
  ligne: string;
  detail: string;
  accent: string;
};

const STRATES: Strate[] = [
  {
    index: "01",
    nom: "La base",
    ligne: "Riz vinaigré tiède.",
    detail: "Ou céréales complètes. Ou rien que du vert. C'est toi qui décides du sol.",
    accent: "#e8d5ab",
  },
  {
    index: "02",
    nom: "La protéine",
    ligne: "Panée à la commande.",
    detail: "Jamais réchauffée, jamais tenue au chaud. Elle sort de l'huile quand tu arrives.",
    accent: "#c9762e",
  },
  {
    index: "03",
    nom: "La sauce",
    ligne: "Cinq maisons.",
    detail: "Fumée, chili-miel, yuzu, herbes, tahini. Zéro industrielle. Zéro sachet.",
    accent: "#f0452a",
  },
  {
    index: "04",
    nom: "Le croustillant",
    ligne: "Ajouté en dernier.",
    detail: "Pour qu'il craque encore quand tu ouvres la boîte. C'est tout le sujet.",
    accent: "#ffc23d",
  },
];

/* -------------------------------------------------------------------------- */

function Couche({ strate, position }: { strate: Strate; position: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Le bloc traverse l'écran un peu plus lentement que le scroll : c'est la
  // parallaxe qui crée l'impression de couches empilées en profondeur.
  const y = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const opacite = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0, 1, 1, 0]);

  // Un côté sur deux : sans alternance, quatre écrans identiques donnent
  // l'impression que la page ne bouge pas.
  const aGauche = position % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative flex min-h-[100svh] items-center"
      aria-labelledby={`strate-${strate.index}`}
    >
      <div className="bowly-wide w-full">
        <motion.div
          style={reduit ? undefined : { y, opacity: opacite }}
          className={cn(
            "max-w-xl",
            aGauche ? "mr-auto" : "ml-auto text-right",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-4",
              !aGauche && "flex-row-reverse",
            )}
          >
            <span
              className="font-poster text-5xl leading-none"
              style={{ color: strate.accent }}
              aria-hidden="true"
            >
              {strate.index}
            </span>
            <span className="bg-line-strong h-px flex-1" aria-hidden="true" />
            <span className="kicker text-bone-faint">{strate.nom}</span>
          </div>

          <h2
            id={`strate-${strate.index}`}
            className="poster-title text-bone mt-7"
          >
            {strate.ligne}
          </h2>

          <p className="lead mt-5">{strate.detail}</p>
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Rail de progression : où en est-on dans la descente. */
function Rail() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const hauteur = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-6 hidden w-px lg:block xl:left-10"
    >
      <div className="bg-line sticky top-0 h-[100svh] w-px">
        <motion.div
          style={{ height: hauteur }}
          className="from-crisp to-brand w-px bg-gradient-to-b"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Descente() {
  return (
    <section id="descente" className="relative">
      <Rail />
      {STRATES.map((strate, i) => (
        <Couche key={strate.index} strate={strate} position={i} />
      ))}
    </section>
  );
}
