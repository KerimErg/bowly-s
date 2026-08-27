"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Ruban } from "@/components/shared/reveal";
import { plansCinema, type PlanCinema } from "@/lib/assets";

/**
 * LE CINÉMA
 *
 * Très grandes images, un seul mot par plan, aucune phrase. L'objectif de
 * cette section n'est pas d'informer : c'est de donner faim et de faire durer
 * le scroll une seconde de plus.
 *
 * COMMENT LES PLANS S'ENCHAÎNENT
 * Chaque plan est `sticky` et occupe l'écran entier. Le suivant remonte
 * par-dessus le précédent, qui reste visible dessous et s'assombrit : on
 * obtient un fondu enchaîné plein cadre, sans capturer le scroll et sans une
 * seule ligne de JavaScript de synchronisation.
 *
 * VIDÉOS
 * `plansCinema[].video` vaut `null` tant que les rushes n'existent pas : on
 * affiche alors le visuel fixe. Le jour où un fichier est déposé dans
 * `public/assets/videos/`, il suffit de renseigner le chemin dans
 * `lib/assets.ts` — rien à changer ici.
 */
export function Cinema() {
  return (
    <section aria-labelledby="cinema-titre" className="relative">
      <div className="bowly-wide py-20">
        <p className="kicker text-crisp">Sans commentaire</p>
        <h2 id="cinema-titre" className="poster-title text-bone mt-5">
          Regarde,
          <br />
          <span className="text-brand">puis commande.</span>
        </h2>
      </div>

      <div className="relative">
        {plansCinema.map((plan, i) => (
          <Plan key={plan.cle} plan={plan} rang={i} total={plansCinema.length} />
        ))}
      </div>

      <Ruban
        mots={["ça craque", "ça coule", "ça fume", "ça croque", "ça déborde"]}
        duree={38}
        className="font-poster text-bone/25 border-line border-y py-6 text-4xl uppercase md:text-6xl"
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Plan({ plan, rang, total }: { plan: PlanCinema; rang: number; total: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Le plan s'enfonce et s'assombrit pendant que le suivant le recouvre.
  const echelle = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const voile = useTransform(scrollYProgress, [0, 1], [0, 0.85]);
  const motY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);

  return (
    <div ref={ref} className="h-[100svh]">
      <motion.div
        style={reduit ? undefined : { scale: echelle }}
        className="sticky top-0 h-[100svh] origin-center overflow-hidden"
      >
        {plan.video ? (
          // Muet et sans commande automatique de son : le site ne fait jamais
          // de bruit sans qu'on le lui demande.
          <video
            className="absolute inset-0 size-full object-cover"
            poster={plan.poster}
            autoPlay={!reduit}
            muted
            loop
            playsInline
            preload="none"
            aria-label={plan.alt}
          >
            <source src={plan.video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={plan.poster}
            alt={plan.alt}
            fill
            sizes="100vw"
            loading={rang === 0 ? "eager" : "lazy"}
            className="object-cover"
          />
        )}

        {/* Voile progressif — c'est lui qui crée le fondu entre deux plans. */}
        <motion.div
          aria-hidden="true"
          className="bg-void absolute inset-0"
          style={reduit ? { opacity: 0.25 } : { opacity: voile }}
        />

        {/* Assombrissement fixe : garantit le contraste du mot quelle que
            soit l'image déposée plus tard. */}
        <div
          aria-hidden="true"
          className="from-void/85 via-void/25 absolute inset-0 bg-gradient-to-t to-transparent"
        />

        <motion.div
          style={reduit ? undefined : { y: motY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p
            className="poster text-center"
            style={{ color: plan.accent, textShadow: "0 12px 60px rgba(0,0,0,0.75)" }}
          >
            ÇA
            <br />
            {plan.mot}.
          </p>
        </motion.div>

        <div className="bowly-wide absolute inset-x-0 bottom-8 flex items-center justify-between">
          <span className="kicker text-bone-dim">{plan.cle}</span>
          <span className="kicker text-bone-faint tabular">
            {String(rang + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
