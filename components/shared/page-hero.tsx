import { LignesRevelees, Reveal } from "@/components/shared/reveal";

/**
 * En-tête des pages intérieures.
 *
 * Volontairement SANS scène 3D : la 3D est le langage de la page d'accueil,
 * qui est un parcours. Les pages intérieures sont des pages de service — on y
 * vient chercher une information ou passer une commande. Y remettre un canvas
 * WebGL coûterait plusieurs centaines de kilo-octets pour un décor que
 * personne ne regarde, et retarderait ce que l'utilisateur est venu faire.
 *
 * La continuité visuelle est assurée autrement : mêmes halos chaud/froid,
 * même typographie d'affiche, même vide autour.
 */
export function PageHero({
  kicker,
  lignes,
  chapo,
  enfants,
}: {
  kicker: string;
  /** Le titre, découpé en lignes — c'est le rythme qui fait l'affiche. */
  lignes: React.ReactNode[];
  chapo?: string;
  enfants?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      <div
        aria-hidden="true"
        className="ember pointer-events-none absolute -top-32 -left-40 h-[70vmin] w-[70vmin] rounded-full opacity-70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="ember-cold pointer-events-none absolute -top-20 right-0 h-[46vmin] w-[46vmin] rounded-full opacity-60 blur-3xl"
      />

      <div className="bowly-wide relative">
        <Reveal au="montage">
          <p className="kicker text-crisp">{kicker}</p>
        </Reveal>

        <LignesRevelees
          as="h1"
          delaiInitial={0.12}
          className="poster-title text-bone mt-6"
          lignes={lignes}
        />

        {chapo && (
          <Reveal au="montage" delay={0.35}>
            <p className="lead mt-7 max-w-xl">{chapo}</p>
          </Reveal>
        )}

        {enfants && (
          <Reveal au="montage" delay={0.45}>
            <div className="mt-10">{enfants}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
