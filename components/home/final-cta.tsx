import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

/**
 * CTA final : un bandeau orange, une phrase, deux boutons.
 * Remplace l'ancien bloc newsletter, qui ajoutait un formulaire et trois
 * paragraphes juste avant le pied de page.
 */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-titre" className="bowly-container pb-24 lg:pb-28">
      <Reveal className="bg-brand noise-overlay relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center sm:px-12">
        <h2 id="cta-titre" className="text-display text-ink text-4xl sm:text-5xl">
          Un bowl, mille combos.
        </h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link href="/menu">
              Voir le menu
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-ink/25">
            <Link href="/contact">Nous écrire</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
