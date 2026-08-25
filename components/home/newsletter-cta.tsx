"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * CTA final + inscription newsletter.
 *
 * Bandeau orange plein plutôt qu'une photo assombrie : c'est le point
 * d'accent le plus fort de la page, et il ferme le parcours avant le footer.
 *
 * ⚠️ INTERFACE UNIQUEMENT — aucune donnée n'est envoyée.
 * TODO(back-end) : brancher un vrai service (Brevo, Mailchimp, fonction
 * serverless...), gérer le double opt-in RGPD et le stockage du consentement.
 *
 * ⚠️ Export statique : pas de route API interne possible, l'appel doit viser
 * un service externe depuis le navigateur (voir README, section Déploiement).
 */
export function NewsletterCta() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulation locale : remplacer par l'appel réseau réel.
    setSubmitted(true);
  };

  return (
    <section aria-labelledby="newsletter-titre" className="bowly-container py-24 lg:py-28">
      <Reveal className="bg-brand noise-overlay relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 lg:py-20">
        <div className="relative mx-auto max-w-2xl">
          <p className="font-display text-ink/70 mb-4 text-xs font-bold tracking-[0.22em] uppercase">
            Rejoins l&apos;aventure
          </p>
          <h2 id="newsletter-titre" className="text-display text-ink text-5xl sm:text-6xl">
            Sois là le jour&nbsp;1.
          </h2>
          <p className="text-ink/80 mt-5 text-lg leading-relaxed">
            Ouverture, avant-premières, recettes en édition limitée. Un mail par
            mois, pas plus.
          </p>

          {submitted ? (
            <p
              role="status"
              className="text-ink mx-auto mt-10 flex max-w-md items-center justify-center gap-2 rounded-full bg-cream px-6 py-4 text-sm font-semibold"
            >
              <Check size={18} aria-hidden="true" />
              Démonstration : aucun e-mail n&apos;a réellement été enregistré.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1 text-left">
                <Label htmlFor="newsletter-email" className="sr-only">
                  Adresse e-mail
                </Label>
                <Input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ton@email.fr"
                  className="border-transparent"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                aria-label="S'inscrire à la newsletter Bowly's"
              >
                Je m&apos;inscris
                <Send size={16} aria-hidden="true" />
              </Button>
            </form>
          )}

          <p className="text-ink/70 mt-5 text-xs">
            Formulaire de démonstration — aucune donnée n&apos;est collectée ni
            transmise.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
