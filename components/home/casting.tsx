"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { accentDe, getVedettes, visuelDe, type Bowl } from "@/lib/menu-data";

/**
 * LE CASTING
 *
 * Un bowl n'est pas une ligne de carte, c'est un personnage. Ici il a donc un
 * nom en très gros, une réplique, et une couleur qui lui appartient — pas une
 * vignette + un prix + un bouton.
 *
 * POURQUOI UN DÉFILEMENT HORIZONTAL NATIF, ET PAS DÉTOURNÉ
 * La mode est de capturer le scroll vertical pour le transformer en
 * déplacement horizontal. C'est spectaculaire et c'est une plaie : la barre
 * de défilement ment, le clavier ne suit pas, le retour arrière du navigateur
 * atterrit n'importe où, et sur trackpad la moindre inertie part de travers.
 * Ici c'est un `overflow-x` natif avec accroche : le doigt fonctionne, les
 * flèches du clavier fonctionnent, et les deux boutons couvrent la souris.
 */
export function Casting() {
  const piste = React.useRef<HTMLUListElement>(null);
  const bowls = getVedettes();

  const glisser = (sens: 1 | -1) => {
    const el = piste.current;
    if (!el) return;
    // Un « écran de carte » : la largeur du premier enfant plus l'écart.
    const carte = el.firstElementChild as HTMLElement | null;
    const pas = carte ? carte.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: pas * sens, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="casting-titre" className="relative py-24 md:py-32">
      <div className="bowly-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="kicker text-crisp">Le casting</p>
            <h2 id="casting-titre" className="poster-title text-bone mt-5">
              Ils ont tous
              <br />
              <span className="text-brand">un caractère.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex items-center gap-2">
            {/* Boutons d'appoint : le contenu reste atteignable sans eux. */}
            <button
              type="button"
              onClick={() => glisser(-1)}
              aria-label="Faire défiler vers la gauche"
              className="border-line-strong text-bone hover:border-crisp hover:text-crisp flex size-12 items-center justify-center rounded-full border transition-colors duration-300"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => glisser(1)}
              aria-label="Faire défiler vers la droite"
              className="border-line-strong text-bone hover:border-crisp hover:text-crisp flex size-12 items-center justify-center rounded-full border transition-colors duration-300"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </Reveal>
        </div>
      </div>

      {/* La piste déborde volontairement du conteneur : les cartes touchent le
          bord de l'écran, ce qui indique qu'il y a une suite. */}
      <ul
        ref={piste}
        // `tabIndex` : une zone défilante doit être atteignable au clavier,
        // sinon son contenu est inaccessible sans souris.
        tabIndex={0}
        aria-label="Les bowls signature"
        className="focus-visible:outline-crisp mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:px-10 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {bowls.map((bowl, i) => (
          <Personnage key={bowl.id} bowl={bowl} rang={i} />
        ))}

        <li className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
          <div className="surface flex h-full flex-col items-start justify-center gap-6 rounded-3xl p-9">
            <p className="poster-section text-bone">
              Et les
              <br />
              autres.
            </p>
            <p className="text-bone-dim text-sm">
              Sept bowls, cinq sauces maison, et de quoi en composer bien plus.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu">Voir la carte</Link>
            </Button>
          </div>
        </li>
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Personnage({ bowl, rang }: { bowl: Bowl; rang: number }) {
  const accent = accentDe(bowl);
  const visuel = visuelDe(bowl);

  return (
    <li className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
      <Link
        href="/menu"
        data-curseur="Voir"
        className="sheen-on-hover group border-line bg-void-2/80 focus-visible:outline-crisp relative block h-full overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5"
        style={{ ["--accent" as string]: accent }}
      >
        {/* Halo de la couleur du plat, révélé au survol. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
          style={{ backgroundColor: accent }}
        />

        {/* Balayage lumineux au survol (classe `sheen-on-hover`). */}
        <span
          aria-hidden="true"
          className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="relative aspect-square overflow-hidden">
          <Image
            src={visuel.src}
            alt={visuel.alt}
            fill
            sizes="(max-width: 640px) 78vw, 22rem"
            // Seule la première carte est prioritaire : les suivantes sont
            // hors écran au chargement et n'ont aucune raison de concourir.
            loading={rang === 0 ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.07]"
          />

          {/* Intensité, en pastilles plutôt qu'en mots. */}
          {bowl.intensite > 0 && (
            <span
              role="img"
              className="bg-void/70 absolute top-4 right-4 flex items-center gap-1 rounded-full px-3 py-1.5 backdrop-blur-sm"
              aria-label={`Intensité : ${bowl.intensite} sur 3`}
            >
              {Array.from({ length: bowl.intensite }).map((_, i) => (
                <Flame key={i} size={12} className="text-brand" aria-hidden="true" />
              ))}
            </span>
          )}
        </div>

        <div className="relative p-7">
          <h3 className="poster-section text-bone transition-colors duration-300 group-hover:text-[var(--accent)]">
            {bowl.nom}
          </h3>
          <p className="text-bone-dim mt-3 text-sm">{bowl.temperament}</p>

          <div className="border-line mt-6 flex items-center justify-between border-t pt-5">
            <span className="text-bone-faint text-xs">{bowl.etiquettes.join(" · ") || "Toute l'année"}</span>
            <span className="font-poster text-crisp tabular text-xl">{bowl.prix}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
