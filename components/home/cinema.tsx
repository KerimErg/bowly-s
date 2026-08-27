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
      {/* L'introduction est sur le fond clair de la page ; les plans qui
          suivent sont plein cadre et sombres par nature. */}
      <div className="bowly-wide py-20">
        <p className="kicker text-rouge-fonce">Sans commentaire</p>
        <h2 id="cinema-titre" className="poster-title text-encre mt-4">
          Regarde,
          <br />
          <span className="souligne-main">puis commande.</span>
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
        className="font-poster text-encre/50 border-encre border-y-2 py-6 text-4xl uppercase md:text-6xl"
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
    // ⚠️ Amplitude limitée à -18 %. À -45 %, la première ligne du mot passait
  // derrière l'en-tête fixe et se retrouvait coupée en deux.
  const motY = useTransform(scrollYProgress, [0, 1], ["6%", "-18%"]);

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
          className="bg-braise absolute inset-0"
          style={reduit ? { opacity: 0.25 } : { opacity: voile }}
        />

        {/* Assombrissement fixe. Deux couches, et les deux sont nécessaires :
            un voile uniforme qui abaisse toute l'image, et un dégradé qui
            appuie le bas où vivent les mentions. C'est ce qui garantit le
            contraste du mot QUELLE QUE SOIT l'image déposée plus tard —
            y compris une photo claire. */}
        <div aria-hidden="true" className="bg-braise/45 absolute inset-0" />
        <div
          aria-hidden="true"
          className="from-braise/90 via-braise/20 absolute inset-0 bg-gradient-to-t to-transparent"
        />

        <motion.div
          style={reduit ? undefined : { y: motY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* ⚠️ Le mot est en --bone, PAS dans la couleur du plan.
              Première version : `color: plan.accent`. Le rouge de « ÇA COULE »
              se posait sur une macro de sauce rouge — le mot disparaissait.
              Une couleur d'accent ne peut pas contraster avec une image dont
              elle est tirée. La couleur du plan sert donc au filet et au
              numéro, jamais au mot lui-même. */}
          <p
            className="poster text-creme text-center"
            style={{ textShadow: "0 10px 50px rgba(8,7,10,0.9), 0 2px 12px rgba(8,7,10,0.8)" }}
          >
            ÇA
            <br />
            {plan.mot}.
          </p>
        </motion.div>

        <div className="bowly-wide absolute inset-x-0 bottom-8 flex items-center gap-5">
          {/* Le filet prend la couleur du plan : l'accent survit, sans jamais
              porter de texte. */}
          <span
            aria-hidden="true"
            className="h-0.5 w-14 shrink-0 rounded-full"
            style={{ backgroundColor: plan.accent }}
          />
          <span className="kicker text-creme/70">{plan.cle}</span>
          <span className="kicker text-creme/50 tabular ml-auto">
            {String(rang + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
