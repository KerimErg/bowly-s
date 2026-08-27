/**
 * Garde-fou de contraste.
 * ---------------------------------------------------------------------------
 * `npm run verifier`
 *
 * POURQUOI CE SCRIPT EXISTE
 * Le site pose du texte sur des aplats de couleur choisis pour leur sens
 * (l'orange de la braise, le vert des herbes, le rouge de la sauce fumée), pas
 * pour leur luminance. Deux pièges reviennent sans arrêt :
 *
 *   1. figer une couleur de texte sur une pastille dont la couleur varie —
 *      l'encre passe sur le riz crème et échoue sur le gochujang ;
 *   2. choisir une couleur d'ingrédient de luminance MOYENNE, sur laquelle ni
 *      l'encre ni l'os ne tiennent le seuil. Aucun calcul ne rattrape ça : il
 *      faut éclaircir ou assombrir la couleur elle-même.
 *
 * Le premier est réglé par `lisibleSur()` dans `lib/recette.ts`. Le second ne
 * peut être attrapé que par ce contrôle. Il a effectivement pris la sauce
 * « Fumée » (#c9421f, 4,29:1 au mieux) — d'où son existence.
 *
 * Ce n'est pas un audit d'accessibilité complet : celui-là se fait avec
 * axe-core sur le site rendu. Ici on vérifie une invariante précise, dans les
 * fichiers sources, avant même d'ouvrir un navigateur.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* -------------------------------------------------------------------------- */

function luminance(hex) {
  const v = hex.replace("#", "");
  const canal = (n) => {
    const s = n / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * canal(parseInt(v.slice(0, 2), 16)) +
    0.7152 * canal(parseInt(v.slice(2, 4), 16)) +
    0.0722 * canal(parseInt(v.slice(4, 6), 16))
  );
}

function contraste(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Lit une variable CSS dans `app/globals.css`. */
function jeton(css, nom) {
  const m = css.match(new RegExp(`^\\s*--${nom}:\\s*(#[0-9a-fA-F]{6})`, "m"));
  if (!m) throw new Error(`Jeton --${nom} introuvable dans app/globals.css`);
  return m[1];
}

/* -------------------------------------------------------------------------- */

const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
const recette = readFileSync(join(ROOT, "lib/recette.ts"), "utf8");

const T = {
  void: jeton(css, "void"),
  void2: jeton(css, "void-2"),
  void3: jeton(css, "void-3"),
  bone: jeton(css, "bone"),
  boneDim: jeton(css, "bone-dim"),
  boneFaint: jeton(css, "bone-faint"),
  ink: jeton(css, "ink"),
  brand: jeton(css, "brand"),
  brandHot: jeton(css, "brand-hot"),
  crisp: jeton(css, "crisp"),
  plasma: jeton(css, "plasma"),
};

const AA = 4.5;
const AA_GRAND = 3;

let echecs = 0;

function verifier(libelle, valeur, seuil) {
  const ok = valeur >= seuil - 1e-9;
  if (!ok) echecs++;
  const marque = ok ? "  ok " : "ÉCHEC";
  console.log(`${marque}  ${libelle.padEnd(46)} ${valeur.toFixed(2)}  (seuil ${seuil})`);
}

console.log("\n── Jetons de la charte ───────────────────────────────────────────");
verifier("texte principal sur le vide", contraste(T.bone, T.void), AA);
verifier("texte secondaire sur le vide", contraste(T.boneDim, T.void), AA);
verifier("texte discret sur le vide", contraste(T.boneFaint, T.void), AA);
verifier("texte discret sur surface relevée", contraste(T.boneFaint, T.void3), AA);
verifier("orange de marque sur le vide", contraste(T.brand, T.void), AA);
verifier("orange clair sur le vide", contraste(T.brandHot, T.void), AA);
verifier("or du croustillant sur le vide", contraste(T.crisp, T.void), AA);
verifier("plasma sur le vide", contraste(T.plasma, T.void), AA);
verifier("encre sur aplat orange", contraste(T.ink, T.brand), AA);
verifier("encre sur aplat or", contraste(T.ink, T.crisp), AA);

console.log("\n── Règle des aplats chauds ───────────────────────────────────────");
// Ce n'est pas un échec mais une VÉRIFICATION D'INTENTION : si un jour l'os
// passait sur l'orange, la règle « texte encre sur aplat chaud » deviendrait
// inutile et il faudrait la retirer plutôt que de la traîner.
const osSurOrange = contraste(T.bone, T.brand);
console.log(
  `  info  os sur aplat orange                         ${osSurOrange.toFixed(2)}  ` +
    (osSurOrange < AA
      ? "→ sous AA : la règle « texte encre sur aplat chaud » reste nécessaire."
      : "→ au-dessus de AA : la règle peut être réexaminée."),
);

console.log("\n── Couleurs d'ingrédients (pastilles du configurateur) ───────────");
// `lisibleSur()` choisit l'encre ou l'os selon la luminance. Il ne peut rien
// pour une couleur où AUCUN des deux ne tient : c'est ce cas qu'on traque.
/* Le `nom:` intercalé est indispensable : sans lui le motif appariait
   l'identifiant d'une ÉTAPE (« base », « sauce »…) avec la couleur de sa
   première option, et cette première option n'était plus testée sous son
   propre nom. */
const couleurs = [
  ...recette.matchAll(/id: "([\w-]+)",\s*nom:[^}]*?couleur: "(#[0-9a-f]{6})"/g),
];
if (couleurs.length === 0) {
  console.log("ÉCHEC  aucune couleur d'ingrédient trouvée — le motif a-t-il changé ?");
  echecs++;
}
for (const [, id, couleur] of couleurs) {
  const encre = contraste(T.ink, couleur);
  const os = contraste(T.bone, couleur);
  const meilleur = Math.max(encre, os);
  verifier(`${id} (${couleur}, ${encre >= os ? "encre" : "os"})`, meilleur, AA);
}

console.log("\n── Textes décoratifs de grande taille (seuil texte large) ────────");
// Les rubans défilants sont posés en `text-bone/40` sur le vide. Ils sont
// décoratifs, mais un utilisateur voyant les lit quand même.
const surVide = (alpha) => {
  const f = [1, 3, 5].map((i) => parseInt(T.bone.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(T.void.slice(i, i + 2), 16));
  const m = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return "#" + m.map((c) => c.toString(16).padStart(2, "0")).join("");
};
verifier("ruban à 40 % d'opacité sur le vide", contraste(surVide(0.4), T.void), AA_GRAND);

console.log("");
if (echecs > 0) {
  console.error(`${echecs} contrôle(s) en échec.\n`);
  process.exit(1);
}
console.log("Tous les contrôles de contraste passent.\n");
