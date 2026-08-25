"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ---------------------------------------------------------------------------
 * ⚠️ FORMULAIRE DE DÉMONSTRATION — INTERFACE UNIQUEMENT
 *
 * Aucune donnée n'est envoyée : `handleSubmit` se contente d'afficher un état
 * de confirmation local.
 *
 * TODO(back-end) — à faire avant mise en production :
 *   1. créer une Route Handler `app/api/contact/route.ts` (ou une Server
 *      Action) qui valide les champs côté serveur ;
 *   2. brancher l'envoi réel (Resend, SendGrid, SMTP, CRM...) ;
 *   3. ajouter une protection anti-spam (honeypot + rate limiting, ou captcha) ;
 *   4. journaliser les erreurs et afficher un vrai message d'échec ;
 *   5. RGPD : mention d'information, base légale, durée de conservation.
 * ------------------------------------------------------------------------- */

type Statut = "idle" | "envoi" | "envoye";

export function ContactForm() {
  const [statut, setStatut] = React.useState<Statut>("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatut("envoi");
    // Simulation d'un aller-retour réseau, à remplacer par le vrai `fetch`.
    window.setTimeout(() => setStatut("envoye"), 600);
  };

  if (statut === "envoye") {
    return (
      <div
        role="status"
        className="border-brand/40 bg-brand/10 flex flex-col items-start gap-4 rounded-3xl border p-8"
      >
        <span className="bg-brand flex size-12 items-center justify-center rounded-full text-white">
          <Check size={22} aria-hidden="true" />
        </span>
        <h2 className="font-display text-cream text-xl font-extrabold tracking-tight">
          Message « envoyé »
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Ceci est une démonstration : le formulaire n&apos;est relié à aucun
          serveur, votre message n&apos;a donc pas été transmis ni conservé.
          Branchez une API (voir les commentaires du fichier{" "}
          <code className="text-brand">components/contact/contact-form.tsx</code>)
          pour le rendre fonctionnel.
        </p>
        <Button variant="outline" onClick={() => setStatut("idle")}>
          Écrire un autre message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={false}
      aria-describedby="contact-avertissement"
      className="border-cream/10 bg-ink-800 flex flex-col gap-6 rounded-3xl border p-8 sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-nom">Nom</Label>
          <Input
            id="contact-nom"
            name="nom"
            type="text"
            required
            autoComplete="name"
            placeholder="Votre nom"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">E-mail</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="votre@email.fr"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-sujet">Sujet</Label>
        <Input
          id="contact-sujet"
          name="sujet"
          type="text"
          placeholder="Presse, franchise, recrutement, autre…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Dites-nous tout."
        />
      </div>

      <p id="contact-avertissement" className="text-muted-foreground text-xs leading-relaxed">
        Formulaire de démonstration : aucune donnée n&apos;est envoyée, stockée ni
        traitée. La mention d&apos;information RGPD reste à rédiger.
      </p>

      <Button
        type="submit"
        size="lg"
        disabled={statut === "envoi"}
        aria-label="Envoyer le message (démonstration)"
        className="w-full sm:w-fit"
      >
        {statut === "envoi" ? "Envoi…" : "Envoyer le message"}
        <Send size={16} aria-hidden="true" />
      </Button>
    </form>
  );
}
