import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";
import { TODO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Comment est née Bowly's : l'envie d'un fast-food de bowls généreux, frais et croustillants. Récit de marque en cours de rédaction.",
};

/**
 * ⚠️ CONTENU DE MARQUE À VALIDER
 * Chaque bloc de texte long ci-dessous est un placeholder explicite.
 * Remplacez-les par le récit définitif — sans inventer de dates, de noms de
 * dirigeants ni de chiffres tant qu'ils n'ont pas été confirmés.
 */
const chapters = [
  {
    year: TODO,
    title: "Le déclic",
    body: `${TODO} — texte de marque à valider. Racontez ici la pause déjeuner fondatrice : le constat, la frustration, l'idée qui en découle.`,
  },
  {
    year: TODO,
    title: "La recette",
    body: `${TODO} — texte de marque à valider. Décrivez le travail sur le croustillant, les essais de panure, la mise au point des sauces maison.`,
  },
  {
    year: TODO,
    title: "Le premier comptoir",
    body: `${TODO} — texte de marque à valider. Ouverture du premier restaurant : lieu, date, équipe, premiers clients.`,
  },
  {
    year: TODO,
    title: "La suite",
    body: `${TODO} — texte de marque à valider. Ambitions, ouvertures à venir, engagements sur les filières et les emballages.`,
  },
];

const values = [
  {
    title: "Le croustillant comme signature",
    body: `${TODO} — expliquez le parti pris culinaire : cuisson, panure, toppings, ce qui différencie Bowly's.`,
  },
  {
    title: "Des produits qu'on assume",
    body: `${TODO} — détaillez les filières, l'origine des produits et les engagements réellement tenus. N'annoncez aucun label non obtenu.`,
  },
  {
    title: "Une équipe, un comptoir",
    body: `${TODO} — présentez l'équipe et la promesse de service. Les noms des dirigeants restent à confirmer.`,
  },
];

export default function HistoirePage() {
  return (
    <>
      <PageHero
        eyebrow="Notre histoire"
        title={
          <>
            Un bowl ne devrait jamais être
            <span className="text-brand"> un pis-aller</span>.
          </>
        }
        description="Le récit est en cours d'écriture. Les blocs montrent la mise en page."
        photo={photos.kitchen}
      />

      <section aria-labelledby="manifeste-titre" className="bowly-container py-24 lg:py-32">
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-4">Le manifeste</p>
          <h2 id="manifeste-titre" className="text-display text-ink text-4xl sm:text-5xl">
            Manger vite, manger bien,
            <br /> manger <span className="text-brand-ink">avec plaisir</span>.
          </h2>
          <p className="text-ink-soft mt-6 text-lg leading-relaxed">
            {TODO} — texte de marque à valider. Ce paragraphe porte la promesse
            principale.
          </p>
        </Reveal>

        {/* Frise chronologique */}
        <ol className="border-line bg-line mt-20 grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((chapter, index) => (
            <Reveal
              as="li"
              key={chapter.title}
              delay={index * 0.08}
              className="flex flex-col gap-3 bg-white p-8 lg:p-10"
            >
              <span className="text-brand-ink font-display text-xs font-bold tracking-[0.2em] uppercase">
                {chapter.year}
              </span>
              <h3 className="font-display text-ink text-lg font-extrabold tracking-tight">
                {chapter.title}
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed">
                {chapter.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="valeurs-titre" className="bg-sand py-24 lg:py-32">
        <div className="bowly-container grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <SmartImage
                photo={photos.ingredients}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="from-night/40 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>
          </Reveal>

          <div>
            <p className="eyebrow mb-4">Ce à quoi on tient</p>
            <h2 id="valeurs-titre" className="text-display text-ink text-4xl sm:text-5xl">
              Trois convictions,
              <br /> zéro <span className="text-brand-ink">concession</span>.
            </h2>

            <ul className="mt-10 flex flex-col gap-8">
              {values.map((value, index) => (
                <Reveal as="li" key={value.title} delay={index * 0.08}>
                  <h3 className="font-display text-ink text-lg font-extrabold tracking-tight">
                    <span className="text-brand-ink mr-3">0{index + 1}</span>
                    {value.title}
                  </h3>
                  <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                    {value.body}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bowly-container py-24 text-center lg:py-32">
        <Reveal>
          <h2 className="text-display text-ink text-4xl sm:text-5xl">
            La suite se passe <span className="text-brand-ink">au comptoir</span>.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/menu">
                Voir le menu
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Nous écrire</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
