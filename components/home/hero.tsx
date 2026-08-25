"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

import { SmartImage } from "@/components/shared/smart-image";
import { TiltCard } from "@/components/shared/tilt-card";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";

/**
 * Hero.
 *
 * La photo n'est plus un fond plein cadre à plat : c'est un visuel qui
 * « flotte » — carte inclinée dans la perspective partagée du site, ombre
 * portée profonde, flottement lent au repos et tilt à la souris. Une seconde
 * carte, plus petite et inclinée à l'inverse, donne le relief.
 *
 * Le fond reste crème : le sombre est réservé aux voiles qui portent du texte.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Parallaxe discret : le visuel monte moins vite que le texte. */
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-titre"
      className="stage-3d relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 lg:pt-24"
    >
      {/* Halo orange diffus : ancre la scène et réchauffe le crème. */}
      <div
        aria-hidden="true"
        className="bg-brand/25 pointer-events-none absolute top-1/2 -right-24 h-[520px] w-[620px] -translate-y-1/2 rounded-full blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="bg-sand pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full blur-[120px]"
      />

      <div className="bowly-container relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div style={reduceMotion ? undefined : { y: contentY }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow"
          >
            Fast-food premium · Bowls composés
          </motion.p>

          <motion.h1
            id="hero-titre"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-display text-ink mt-5 text-[3.5rem] sm:text-7xl lg:text-8xl"
          >
            Le bowl,
            <br />
            version <span className="text-brand-ink">croustillante</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-ink-soft mt-7 max-w-md text-xl"
          >
            Composé devant toi. Servi en cinq minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
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
        </motion.div>

        {/* Pile de photos flottantes */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={reduceMotion ? undefined : { y: photoY }}
          /* La rotation 3D élargit la boîte visuelle au-delà de la boîte de
              mise en page : on réserve donc une marge sur petit écran, sinon la
              carte inclinée et la pastille sortent du cadre. */
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-md lg:max-w-none"
        >
          <div className="float-idle">
            <TiltCard
              maxTilt={9}
              lift={14}
              restTilt={{ x: 3, y: -8 }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-float-xl)] sm:aspect-square lg:aspect-[4/5]"
            >
              <SmartImage
                photo={photos.heroBowl}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 46vw"
                cdnWidth={1400}
                fallbackTone="dark"
                className="object-cover"
              />
            </TiltCard>
          </div>

          {/* Carte secondaire : c'est le décalage entre les deux plans qui
              crée la sensation de profondeur. */}
          <div className="float-idle-slow absolute -bottom-6 left-2 w-32 sm:-bottom-8 sm:-left-10 sm:w-52">
            <TiltCard
              maxTilt={12}
              lift={10}
              restTilt={{ x: -4, y: 10 }}
              className="relative aspect-square overflow-hidden rounded-[1.75rem] border-4 border-cream shadow-[var(--shadow-float-lg)]"
            >
              <SmartImage
                photo={photos.toppings}
                fill
                sizes="200px"
                cdnWidth={500}
                fallbackTone="dark"
                className="object-cover"
              />
            </TiltCard>
          </div>

          {/* Pastille « 5 min » : petit repère qui flotte au-dessus de la pile. */}
          <div className="bg-brand text-ink font-display absolute -top-4 right-2 flex size-20 rotate-[-8deg] flex-col items-center justify-center rounded-full text-center leading-none font-extrabold shadow-[var(--shadow-float)] sm:-top-3 sm:-right-4 sm:size-28">
            <span className="text-xl sm:text-3xl">5</span>
            <span className="text-[0.6rem] tracking-[0.14em] uppercase">minutes</span>
          </div>
        </motion.div>
      </div>

      <a
        href="#pourquoi"
        aria-label="Faire défiler vers la section « Pourquoi Bowly's »"
        className="text-ink-soft hover:text-ink absolute bottom-8 left-1/2 hidden -translate-x-1/2 transition-colors duration-300 lg:block"
      >
        <ChevronDown size={26} aria-hidden="true" className="animate-bounce" />
      </a>
    </section>
  );
}
