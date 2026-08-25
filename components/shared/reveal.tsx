"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Décalage en secondes, pour cascader plusieurs éléments d'une même grille. */
  delay?: number;
  /** Direction d'entrée de l'élément. */
  from?: "bottom" | "left" | "right";
  as?: "div" | "section" | "li" | "article" | "span";
};

const OFFSET = 28;

/**
 * Apparition au scroll, déclenchée une seule fois par élément.
 * `useReducedMotion` neutralise complètement l'animation pour les
 * utilisateurs qui l'ont désactivée au niveau système.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: from === "bottom" ? OFFSET : 0,
          x: from === "left" ? -OFFSET : from === "right" ? OFFSET : 0,
        },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
