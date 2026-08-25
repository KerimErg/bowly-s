import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";
import { TODO } from "@/lib/site";

/** Teaser « Notre histoire » — le texte long vit sur /histoire. */
export function StoryTeaser() {
  return (
    <section
      aria-labelledby="histoire-titre"
      className="bowly-container py-24 lg:py-32"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal from="left" className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/4] lg:aspect-[4/5]">
            <SmartImage
              photo={photos.storyTeaser}
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
            />
            <div aria-hidden="true" className="from-night/55 absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>

          {/* Encart chiffré : valeurs de marque, à confirmer avant publication. */}
          <div className="border-line absolute -right-2 -bottom-6 rounded-2xl border bg-white p-6 shadow-[0_24px_50px_-30px_rgba(28,19,16,0.5)] sm:right-6 lg:-right-8">
            <p className="text-display text-brand-ink text-4xl">+40</p>
            <p className="text-ink-soft mt-1 max-w-[9rem] text-xs leading-relaxed">
              ingrédients préparés chaque matin en cuisine
            </p>
          </div>
        </Reveal>

        <Reveal from="right">
          <p className="eyebrow mb-4">Notre histoire</p>
          <h2 id="histoire-titre" className="text-display text-ink text-4xl sm:text-5xl lg:text-6xl">
            Née d&apos;une pause déjeuner
            <br className="hidden sm:block" /> un peu trop{" "}
            <span className="text-brand-ink">décevante</span>.
          </h2>
          <p className="text-ink-soft mt-6 leading-relaxed">
            {TODO} — texte de marque à valider. L&apos;idée : un bowl aussi
            désirable qu&apos;un burger. Et qui craque.
          </p>
          <p className="text-ink-soft mt-4 leading-relaxed">
            {TODO} — création, fondateurs, premier restaurant.
          </p>

          <Button asChild variant="outline" className="mt-9">
            <Link href="/histoire">
              Lire notre histoire
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
