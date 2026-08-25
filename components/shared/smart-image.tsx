"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { unsplash, type Photo } from "@/lib/images";

type SmartImageProps = Omit<ImageProps, "src" | "alt"> & {
  photo: Photo;
  /** Largeur demandée au CDN Unsplash (par défaut 1200 px). */
  cdnWidth?: number;
  /**
   * Teinte du dégradé de secours si la photo est indisponible.
   * `dark` est indispensable partout où du texte clair est posé sur la photo
   * (hero, en-têtes de page) : un secours clair rendrait le titre illisible.
   */
  fallbackTone?: "light" | "dark";
};

/**
 * Wrapper `next/image` utilisé pour TOUTES les photos distantes du site.
 *
 * Il apporte deux garanties :
 *  1. l'`alt` vient du registre `lib/images.ts`, impossible de l'oublier ;
 *  2. si une URL Unsplash devient indisponible, on retombe sur un dégradé de
 *     marque plutôt que sur une icône d'image cassée.
 *
 * Le `lazy loading` natif reste actif : passez `priority` uniquement sur la
 * photo du hero (LCP).
 */
export function SmartImage({
  photo,
  cdnWidth = 1200,
  fallbackTone = "light",
  className,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={photo.alt}
        className={cn(
          "absolute inset-0 h-full w-full bg-gradient-to-br",
          fallbackTone === "dark"
            ? "from-brand/45 via-night-700 to-night"
            : "from-brand/35 via-sand to-sand-deep",
          className,
        )}
      />
    );
  }

  return (
    <Image
      src={unsplash(photo.id, cdnWidth)}
      alt={photo.alt}
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}
