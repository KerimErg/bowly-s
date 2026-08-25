"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";

/**
 * Hero plein écran.
 * Photo pleine page + léger parallaxe au scroll, voile sombre pour la
 * lisibilité, accroche très bold et deux CTA (primaire / secondaire).
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Parallaxe volontairement discret : la photo monte moins vite que le texte. */
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-titre"
      className="noise-overlay relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduceMotion ? undefined : { y: imageY }}
      >
        <SmartImage
          photo={photos.heroBowl}
          fill
          priority
          sizes="100vw"
          cdnWidth={2000}
          className="object-cover object-center"
        />
        {/* Double voile : vertical pour le texte, latéral pour la profondeur. */}
        <div aria-hidden="true" className="photo-scrim absolute inset-0" />
        <div
          aria-hidden="true"
          className="from-ink/85 absolute inset-0 bg-gradient-to-r via-transparent to-transparent"
        />
      </motion.div>

      <motion.div
        className="bowly-container pt-32 pb-24 sm:pb-28 lg:pb-32"
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
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
          className="text-display mt-5 max-w-4xl text-[3.25rem] text-white sm:text-7xl lg:text-8xl"
        >
          Le bowl,
          <br />
          version <span className="text-brand">croustillante</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-white/80"
        >
          Protéines marinées, légumes coupés du jour, féculents complets, sauces
          maison et toppings qui craquent. Composé devant vous, servi en quelques
          minutes.
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
            <Link href="/restaurants">Commander</Link>
          </Button>
        </motion.div>
      </motion.div>

      <a
        href="#pourquoi"
        aria-label="Faire défiler vers la section « Pourquoi Bowly's »"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-white/50 transition-colors duration-300 hover:text-white lg:block"
      >
        <ChevronDown size={26} aria-hidden="true" className="animate-bounce" />
      </a>
    </section>
  );
}
