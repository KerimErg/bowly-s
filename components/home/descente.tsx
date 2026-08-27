"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Numero, TraitMain } from "@/components/shared/decor";
import { cn } from "@/lib/utils";

/**
 * ACTE II — LA DESCENTE
 *
 * L'idée qui tient tout le site : pendant que le visiteur fait défiler, la
 * caméra 3D plonge dans le bowl et les couches s'écartent au-dessus d'elle.
 * Chaque couche traversée est une section. On ne lit pas une liste
 * d'arguments, on descend dans le produit.
 *
 * ⚠️ UN PROBLÈME DE CONTRASTE PROPRE À CETTE SECTION
 * Le fond de page s'éclaircit progressivement pendant ces quatre écrans : il
 * part du brun brûlé et finit en crème (voir `couleurFond()` dans
 * `lib/stage.ts`). Un texte posé directement dessus serait donc illisible à
 * l'une des deux extrémités, quelle que soit sa couleur — et un basculement
 * de couleur en cours de route se verrait.
 *
 * D'où le parti pris : chaque strate est écrite sur un TICKET DE PAPIER opaque,
 * bordé d'encre et posé sur son ombre. Le ticket porte son propre fond, donc
 * son contraste ne dépend plus du tout de ce qui se passe derrière. Et
 * accessoirement, quatre bouts de papier penchés valent mieux que quatre blocs
 * de texte alignés.
 *
 * ⚠️ Quatre strates = quatre écrans. La chorégraphie de la caméra est calée
 * sur ce nombre : en ajouter une cinquième désynchronise la 3D du texte.
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
    accent: "var(--jaune)",
  },
  {
    index: "02",
    nom: "La protéine",
    ligne: "Panée à la commande.",
    detail: "Jamais réchauffée, jamais tenue au chaud. Elle sort de l'huile quand tu arrives.",
    accent: "var(--rouge)",
  },
  {
    index: "03",
    nom: "La sauce",
    ligne: "Cinq maisons.",
    detail: "Fumée, chili-miel, yuzu, herbes, tahini. Zéro industrielle. Zéro sachet.",
    accent: "var(--rouge-fonce)",
  },
  {
    index: "04",
    nom: "Le croustillant",
    ligne: "Ajouté en dernier.",
    detail: "Pour qu'il craque encore quand tu ouvres la boîte. C'est tout le sujet.",
    accent: "var(--vert-fonce)",
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

  // Le ticket traverse l'écran un peu plus lentement que le scroll : c'est la
  // parallaxe qui donne l'impression de couches empilées en profondeur.
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const opacite = useTransform(scrollYProgress, [0, 0.26, 0.74, 1], [0, 1, 1, 0]);

  // Un côté sur deux : sans alternance, quatre écrans se ressemblent.
  const aGauche = position % 2 === 0;
  const inclinaisons = ["colle-1", "colle-2", "colle-3", "colle-1"];

  return (
    <div
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-x-clip"
      aria-labelledby={`strate-${strate.index}`}
    >
      <div className="bowly-wide w-full">
        <motion.div
          style={reduit ? undefined : { y, opacity: opacite }}
          className={cn("max-w-lg", aGauche ? "mr-auto" : "ml-auto")}
        >
          <div
            className={cn(
              "bg-creme papier border-encre border-4 px-8 py-9 shadow-[10px_10px_0_var(--encre)]",
              inclinaisons[position],
            )}
          >
            <div className="flex items-center gap-4">
              <Numero className="text-4xl" ton="rouge">
                {strate.index}
              </Numero>
              <span className="kicker text-encre-faible">{strate.nom}</span>
            </div>

            <h2
              id={`strate-${strate.index}`}
              className="poster-title text-encre mt-5"
              style={{ color: strate.accent }}
            >
              {strate.ligne}
            </h2>

            <div className="mt-5 mb-4 max-w-[14rem]">
              <TraitMain ton="encre" />
            </div>

            <p className="text-encre-douce text-base leading-relaxed">
              {strate.detail}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Descente() {
  return (
    <section id="descente" className="relative">
      {STRATES.map((strate, i) => (
        <Couche key={strate.index} strate={strate} position={i} />
      ))}
    </section>
  );
}
