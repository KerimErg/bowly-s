"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { photos } from "@/lib/images";

/**
 * CTA final + inscription newsletter.
 *
 * ⚠️ INTERFACE UNIQUEMENT — aucune donnée n'est envoyée.
 * TODO(back-end) : brancher un vrai service (Brevo, Mailchimp, fonction
 * serverless...), gérer le double opt-in RGPD et le stockage du consentement
 * avant toute mise en production.
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
    <section
      aria-labelledby="newsletter-titre"
      className="relative overflow-hidden py-28 lg:py-36"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage
          photo={photos.ingredients}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="bg-ink/88 absolute inset-0" />
        <div
          aria-hidden="true"
          className="from-brand/25 absolute inset-0 bg-gradient-to-tr via-transparent to-transparent"
        />
      </div>

      <Reveal className="bowly-container max-w-3xl text-center">
        <p className="eyebrow mb-4">Restons en contact</p>
        <h2 id="newsletter-titre" className="text-display text-4xl text-white sm:text-6xl">
          Soyez là le
          <span className="text-brand"> jour&nbsp;1</span>.
        </h2>
        <p className="mt-5 leading-relaxed text-white/75">
          Ouverture, avant-premières, recettes en édition limitée : on vous
          prévient avant tout le monde. Pas plus d&apos;un e-mail par mois.
        </p>

        {submitted ? (
          <p
            role="status"
            className="border-brand/40 bg-brand/10 text-cream mx-auto mt-10 flex max-w-md items-center justify-center gap-2 rounded-full border px-6 py-4 text-sm"
          >
            <Check size={18} className="text-brand" aria-hidden="true" />
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
                placeholder="votre@email.fr"
                className="bg-ink/60 backdrop-blur-sm"
              />
            </div>
            <Button type="submit" aria-label="S'inscrire à la newsletter Bowly's">
              Je m&apos;inscris
              <Send size={16} aria-hidden="true" />
            </Button>
          </form>
        )}

        <p className="mt-5 text-xs text-white/50">
          Formulaire de démonstration — aucune donnée n&apos;est collectée ni
          transmise.
        </p>
      </Reveal>
    </section>
  );
}
