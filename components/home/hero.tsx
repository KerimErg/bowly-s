"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SmartImage } from "@/components/shared/smart-image";
import { TiltCard } from "@/components/shared/tilt-card";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";

/**
 * Hero.
 *
 * La photo occupe la moitié droite en desktop et domine l'écran en mobile :
 * le texte se limite au titre, à cinq mots d'accroche et à deux boutons.
 * Carte inclinée dans la perspective partagée, ombre profonde, flottement
 * lent au repos et tilt à la souris.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-titre"
      className="stage-3d relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      <div
        aria-hidden="true"
        className="bg-brand/25 pointer-events-none absolute top-1/2 -right-24 h-[560px] w-[660px] -translate-y-1/2 rounded-full blur-[130px]"
      />

      <div className="bowly-container relative grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <motion.h1
            id="hero-titre"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-display text-ink text-[3.5rem] sm:text-7xl lg:text-8xl"
          >
            Le bowl,
            <br />
            version <span className="text-brand-ink">croustillante</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-ink-soft mt-6 text-xl"
          >
            Composé devant toi. Servi en cinq minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <Link href="/menu">
                Voir le menu
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            {/* TODO(commande) : brancher sur la plateforme de commande en ligne. */}
            <Button asChild size="lg" variant="outline">
              <Link href="/restaurants">Je commande</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={reduceMotion ? undefined : { y: photoY }}
          className="relative mx-auto w-full max-w-[22rem] sm:max-w-lg lg:max-w-none"
        >
          <div className="float-idle">
            <TiltCard
              maxTilt={9}
              lift={14}
              restTilt={{ x: 2, y: -7 }}
              className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-float-xl)]"
            >
              <SmartImage
                photo={photos.heroBowl}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 55vw"
                cdnWidth={1600}
                fallbackTone="dark"
                className="object-cover"
              />
            </TiltCard>
          </div>

          {/* Pastille « 5 min » : le seul texte posé sur la photo. */}
          <div className="bg-brand text-ink font-display absolute -top-4 right-2 flex size-20 rotate-[-8deg] flex-col items-center justify-center rounded-full text-center leading-none font-extrabold shadow-[var(--shadow-float)] sm:-top-5 sm:-right-4 sm:size-28">
            <span className="text-xl sm:text-3xl">5</span>
            <span className="text-[0.6rem] tracking-[0.14em] uppercase">minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
