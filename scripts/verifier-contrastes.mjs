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
 *   1. figer une couleur de texte sur une case dont la couleur varie —
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
  creme: jeton(css, "creme"),
  beurre: jeton(css, "beurre"),
  carton: jeton(css, "carton"),
  braise: jeton(css, "braise"),
  braise2: jeton(css, "braise-2"),
  encre: jeton(css, "encre"),
  encreDouce: jeton(css, "encre-douce"),
  encreFaible: jeton(css, "encre-faible"),
  rouge: jeton(css, "rouge"),
  rougeFonce: jeton(css, "rouge-fonce"),
  rougeClair: jeton(css, "rouge-clair"),
  jaune: jeton(css, "jaune"),
  vert: jeton(css, "vert"),
  vertFonce: jeton(css, "vert-fonce"),
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

console.log("\n── Textes sur les trois papiers ──────────────────────────────────");
// ⚠️ Les trois surfaces claires ne se valent pas : ce qui passe sur le crème
// peut échouer sur le carton, plus foncé. Les trois sont donc testées.
for (const [nomFond, fond] of [["crème", T.creme], ["beurre", T.beurre], ["carton", T.carton]]) {
  verifier(`encre / ${nomFond}`, contraste(T.encre, fond), AA);
  verifier(`encre douce / ${nomFond}`, contraste(T.encreDouce, fond), AA);
  verifier(`encre faible / ${nomFond}`, contraste(T.encreFaible, fond), AA);
  verifier(`rouge foncé / ${nomFond}`, contraste(T.rougeFonce, fond), AA);
  verifier(`vert foncé / ${nomFond}`, contraste(T.vertFonce, fond), AA);
}

console.log("\n── Textes sur les zones sombres (teasing, pied de page) ──────────");
verifier("crème / braise", contraste(T.creme, T.braise), AA);
verifier("crème / braise-2", contraste(T.creme, T.braise2), AA);
verifier("rouge / braise", contraste(T.rouge, T.braise), AA);
verifier("jaune / braise", contraste(T.jaune, T.braise), AA);
verifier("vert / braise", contraste(T.vert, T.braise), AA);

console.log("\n── Textes sur aplats chauds ──────────────────────────────────────");
verifier("encre sur aplat rouge", contraste(T.encre, T.rouge), AA);
verifier("encre sur aplat jaune", contraste(T.encre, T.jaune), AA);
verifier("encre sur aplat vert", contraste(T.encre, T.vert), AA);

console.log("\n── Règles à deux tons ────────────────────────────────────────────");
// Vérifications d'INTENTION, pas d'échec : elles confirment que les paires
// « aplat / texte » distinctes restent nécessaires. Le jour où l'une passe,
// il faut retirer la règle plutôt que de la traîner.
for (const [libelle, valeur, regle] of [
  ["crème sur aplat rouge", contraste(T.creme, T.rouge), "texte encre sur aplat chaud"],
  ["rouge vif en texte sur crème", contraste(T.rouge, T.creme), "--rouge-fonce pour le texte"],
  ["vert vif en texte sur crème", contraste(T.vert, T.creme), "--vert-fonce pour le texte"],
]) {
  console.log(
    `  info  ${libelle.padEnd(40)} ${valeur.toFixed(2)}  ` +
      (valeur < AA
        ? `→ sous AA : la règle « ${regle} » reste nécessaire.`
        : `→ au-dessus de AA : la règle « ${regle} » peut être réexaminée.`),
  );
}

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
  const encre = contraste(T.encre, couleur);
  const clair = contraste(T.creme, couleur);
  const meilleur = Math.max(encre, clair);
  verifier(`${id} (${couleur}, ${encre >= clair ? "encre" : "crème"})`, meilleur, AA);
}

console.log("\n── Textes décoratifs de grande taille (seuil texte large) ────────");
// Les rubans défilants sont posés en `text-encre/50` sur le crème. Ils sont
// décoratifs, mais un utilisateur voyant les lit quand même — d'où le seuil
// « texte large », qu'ils atteignent tout juste à 50 % et pas à 30 %.
const melange = (avant, arriere, alpha) => {
  const f = [1, 3, 5].map((i) => parseInt(avant.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(arriere.slice(i, i + 2), 16));
  const m = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return "#" + m.map((c) => c.toString(16).padStart(2, "0")).join("");
};
verifier(
  "ruban à 50 % d'encre sur crème",
  contraste(melange(T.encre, T.creme, 0.5), T.creme),
  AA_GRAND,
);
verifier(
  "ruban à 40 % de crème sur braise",
  contraste(melange(T.creme, T.braise, 0.4), T.braise),
  AA_GRAND,
);

console.log("");
if (echecs > 0) {
  console.error(`${echecs} contrôle(s) en échec.\n`);
  process.exit(1);
}
console.log("Tous les contrôles de contraste passent.\n");
