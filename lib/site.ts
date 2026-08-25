/**
 * Bowly's — informations de marque.
 *
 * ⚠️ POLITIQUE DE CONTENU
 * Bowly's n'existe pas encore physiquement. Toute donnée réelle indisponible
 * (adresse, téléphone, e-mail, horaires, réseaux sociaux, dirigeants, prix)
 * est volontairement laissée en `[À COMPLÉTER]` et JAMAIS inventée.
 * Remplacez les valeurs ci-dessous avant toute mise en ligne.
 */

/** Marqueur unique, cherchable dans tout le projet : `grep -r "À COMPLÉTER"`. */
export const TODO = "[À COMPLÉTER]" as const;

export const siteConfig = {
  name: "Bowly's",
  tagline: "Le bowl, version croustillante.",
  /**
   * Accroche courte, pour l'interface (pied de page notamment).
   * Distincte de `description`, qui sert de meta description SEO et a
   * intérêt à rester détaillée.
   */
  shortPitch: "Un bowl, mille combos. Trouve le tien.",
  description:
    "Bowly's compose des bowls généreux : protéines marinées, légumes de saison, féculents complets, sauces maison et toppings croustillants. Fast-food premium, healthy et gourmand.",
  /**
   * URL de production — sert de base aux métadonnées SEO / Open Graph.
   * Alimentée par le workflow de déploiement (`NEXT_PUBLIC_SITE_URL`) ; la
   * valeur de repli n'est qu'un placeholder, à remplacer par le vrai domaine.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.bowlys.example",
  locale: "fr_FR",
} as const;

/** Coordonnées — 100 % placeholders tant que la marque n'a pas ouvert. */
export const contactInfo = {
  address: TODO,
  postalCode: TODO,
  city: TODO,
  phone: TODO,
  email: TODO,
  pressEmail: TODO,
  franchiseEmail: TODO,
} as const;

/** Horaires d'ouverture — à remplacer par les vrais créneaux. */
export const openingHours = [
  { day: "Lundi", hours: TODO },
  { day: "Mardi", hours: TODO },
  { day: "Mercredi", hours: TODO },
  { day: "Jeudi", hours: TODO },
  { day: "Vendredi", hours: TODO },
  { day: "Samedi", hours: TODO },
  { day: "Dimanche", hours: TODO },
] as const;

/**
 * Réseaux sociaux : les URLs restent en `#` tant que les comptes n'existent
 * pas. Ne pas pointer vers des profils tiers pour "faire vrai".
 */
export const socialLinks = [
  { label: "Instagram", href: "#", handle: TODO, icon: "instagram" },
  { label: "TikTok", href: "#", handle: TODO, icon: "tiktok" },
  { label: "Facebook", href: "#", handle: TODO, icon: "facebook" },
  { label: "LinkedIn", href: "#", handle: TODO, icon: "linkedin" },
] as const;

export type SocialIcon = (typeof socialLinks)[number]["icon"];

/** Navigation principale, partagée entre le header et le footer. */
export const mainNav = [
  { label: "Menu", href: "/menu" },
  { label: "Notre histoire", href: "/histoire" },
  { label: "Nos restaurants", href: "/restaurants" },
  { label: "Contact", href: "/contact" },
] as const;

/** Liens légaux : pages non rédigées, à créer avant mise en ligne. */
export const legalNav = [
  { label: "Mentions légales", href: "#", note: TODO },
  { label: "Politique de confidentialité", href: "#", note: TODO },
  { label: "Conditions générales de vente", href: "#", note: TODO },
  { label: "Gestion des cookies", href: "#", note: TODO },
  { label: "Allergènes", href: "#", note: TODO },
] as const;
