"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { visuelsBowls } from "@/lib/assets";
import { TODO } from "@/lib/site";

/**
 * COMING NEXT
 *
 * Le dernier acte, et le seul qui ne montre rien. Un bowl à moitié sorti du
 * noir, un mot énorme, et pas de date.
 *
 * POURQUOI CE BLOC EXISTE
 * Ce n'est pas du remplissage : c'est le gabarit des éditions limitées. Une
 * marque de street-food vit de ses sorties. Le jour où la première existe,
 * elle se glisse ici — le visuel, le nom et la date remplacent trois valeurs,
 * le reste ne bouge pas.
 *
 * ⚠️ Aucune date n'est annoncée : `[À COMPLÉTER]` tant que rien n'est arrêté.
 */
export function NextBowl() {
  const ref = React.useRef<HTMLElement>(null);
  const reduit = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Le bowl sort du bord bas pendant qu'on approche : on ne le voit jamais
  // en entier. C'est tout l'objet du teasing.
  const y = useTransform(scrollYProgress, [0, 1], ["38%", "-6%"]);
  const rotation = useTransform(scrollYProgress, [0, 1], [-14, 6]);

  return (
    <section
      ref={ref}
      aria-labelledby="next-titre"
      className="grain relative overflow-hidden py-28 md:py-40"
    >
      {/* Fond plus noir que le reste de la page : on change d'ambiance. */}
      <div aria-hidden="true" className="bg-void absolute inset-0" />
      <div className="ember pointer-events-none absolute -bottom-1/4 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 rounded-full opacity-45 blur-3xl" />

      <div className="bowly-wide relative">
        <Reveal>
          <p className="kicker text-brand flex items-center gap-3">
            <span className="bg-brand size-1.5 animate-pulse rounded-full" aria-hidden="true" />
            Édition limitée
          </p>
        </Reveal>

        <div className="relative mt-8">
          {/* Le mot en contour, posé derrière : deux fois le même mot, l'un
              plein l'autre détouré, décalés — c'est ce qui donne l'épaisseur
              sans ajouter d'image. */}
          <p
            aria-hidden="true"
            className="poster poster-outline absolute -top-3 left-2 hidden select-none md:block"
          >
            NEXT BOWL
          </p>
          <h2 id="next-titre" className="poster text-bone relative">
            NEXT BOWL
          </h2>
        </div>

        <div className="mt-12 grid items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-md">
            <p className="lead">
              On ne dira pas ce que c&apos;est. On dira juste qu&apos;il
              craque plus fort que les autres.
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
              {[
                ["Nom", TODO],
                ["Sortie", TODO],
                ["Quantité", "Limitée"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="kicker text-bone-faint">{k}</dt>
                  <dd className="text-bone mt-2 text-base font-bold">{v}</dd>
                </div>
              ))}
            </dl>

            <Button asChild size="lg" className="mt-10" data-curseur="Être prévenu">
              <Link href="/contact">Être prévenu</Link>
            </Button>
          </div>

          {/* --- Le bowl, à moitié caché --- */}
          <motion.div
            style={reduit ? undefined : { y, rotate: rotation }}
            className="relative mx-auto w-[min(78vw,26rem)]"
          >
            <div className="relative aspect-square">
              <Image
                src={visuelsBowls["smoke-show"].src}
                alt=""
                fill
                sizes="(max-width: 1024px) 78vw, 26rem"
                loading="lazy"
                className="object-contain"
              />
              {/* Masque qui ronge la moitié basse : le plat n'est jamais
                  entièrement révélé. */}
              <div
                aria-hidden="true"
                className="from-void via-void/85 absolute inset-0 bg-gradient-to-t to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
