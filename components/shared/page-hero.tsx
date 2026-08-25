import * as React from "react";

import { SmartImage } from "@/components/shared/smart-image";
import type { Photo } from "@/lib/images";

/** En-tête de page intérieure : photo pleine largeur + titre en réserve. */
export function PageHero({
  eyebrow,
  title,
  description,
  photo,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  photo: Photo;
}) {
  return (
    <section className="relative flex min-h-[62svh] items-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          photo={photo}
          fallbackTone="dark"
          fill
          priority
          sizes="100vw"
          cdnWidth={1800}
          className="object-cover object-center"
        />
        <div aria-hidden="true" className="photo-scrim absolute inset-0" />
      </div>

      <div className="bowly-container pt-36 pb-16 lg:pb-20">
        <p className="eyebrow-invert mb-4">{eyebrow}</p>
        <h1 className="text-display max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
