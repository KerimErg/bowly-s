/**
 * Générateur de visuels Bowly's.
 * ---------------------------------------------------------------------------
 * `node scripts/generate-assets.mjs`  →  écrit dans `public/assets/`.
 *
 * POURQUOI CE FICHIER EXISTE
 * Bowly's n'a pas encore de photos. Trois options se présentaient :
 *   1. des photos de banque d'images  → sujets génériques, aucune identité,
 *      et des URLs distantes qui cassent (ce que le brief interdit
 *      explicitement : « ne construis jamais le site autour d'images
 *      externes impossibles à remplacer »).
 *   2. des photos prises chez des marques concurrentes → ce sont leurs plats
 *      et leur travail ; les présenter comme ceux de Bowly's n'est pas une
 *      option, même en maquette.
 *   3. dessiner les bowls. C'est ce que fait ce script.
 *
 * Chaque bowl est composé par-dessus une grille polaire : base, protéine,
 * sauce, toppings — les mêmes couches que la vraie recette. Le résultat est
 * un style d'illustration propre à la marque, reconnaissable sans le logo,
 * et remplaçable plat par plat le jour où les photos existent.
 *
 * Tout est déterministe (générateur pseudo-aléatoire à graine) : deux
 * exécutions produisent des fichiers identiques, donc pas de diff parasite.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "assets");

/* -------------------------------------------------------------------------- */
/*  Aléatoire reproductible                                                    */
/* -------------------------------------------------------------------------- */

/** mulberry32 — petit, rapide, suffisant pour de la répartition visuelle. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------------------- */
/*  Recettes visuelles                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Une entrée = un bowl du menu.
 *
 * `base`     couleur des grains / de la verdure du fond
 * `protein`  couleur des morceaux principaux
 * `sauce`    couleur du filet de sauce
 * `pop`      couleur des toppings qui doivent claquer
 * `bowl`     couleur de la céramique
 * `grain`    "riz" (grains allongés) ou "verdure" (feuilles) ou "grains" (céréales)
 * `chunk`    "croustillant" (bords irréguliers) ou "cube" (net) ou "emiette"
 */
const RECETTES = {
  "the-og": {
    bowl: "#2a2029", base: "#f2e3c4", protein: "#c9762e", sauce: "#f0452a",
    pop: "#ffc23d", grain: "riz", chunk: "croustillant", seed: 1071,
  },
  "spicy-bowly": {
    bowl: "#2c1a1c", base: "#efd9b4", protein: "#d1421f", sauce: "#ff2d10",
    pop: "#ffc23d", grain: "riz", chunk: "croustillant", seed: 2244,
  },
  "crispy-korean": {
    bowl: "#241d2c", base: "#f0e0bd", protein: "#b23a1c", sauce: "#e8342e",
    pop: "#8fd11f", grain: "riz", chunk: "croustillant", seed: 3319,
  },
  "green-riot": {
    bowl: "#1b2620", base: "#7fb642", protein: "#c8a34a", sauce: "#a7d84b",
    pop: "#ffc23d", grain: "verdure", chunk: "cube", seed: 4406,
  },
  "blue-lagoon": {
    bowl: "#1a222c", base: "#f3e6c8", protein: "#e8735b", sauce: "#ff9d6b",
    pop: "#61c6d6", grain: "riz", chunk: "cube", seed: 5573,
  },
  "the-heavy": {
    bowl: "#2a2119", base: "#e6cfa0", protein: "#a8622a", sauce: "#c9421f",
    pop: "#ffc23d", grain: "grains", chunk: "emiette", seed: 6688,
  },
  "smoke-show": {
    bowl: "#26202a", base: "#e9d9b6", protein: "#8f4a24", sauce: "#7c3f1d",
    pop: "#ff6a3d", grain: "grains", chunk: "croustillant", seed: 7791,
  },
  "the-side": {
    bowl: "#2a2229", base: "#e2c88f", protein: "#d08c33", sauce: "#ffc23d",
    pop: "#f0452a", grain: "grains", chunk: "croustillant", seed: 8814,
  },
};

/* -------------------------------------------------------------------------- */
/*  Couches                                                                    */
/* -------------------------------------------------------------------------- */

/** Point aléatoire dans un disque, réparti uniformément (racine sur le rayon). */
function pointDansDisque(r, rayon) {
  const angle = r() * Math.PI * 2;
  const d = Math.sqrt(r()) * rayon;
  return [round(400 + Math.cos(angle) * d), round(400 + Math.sin(angle) * d)];
}

/**
 * Le fond du bowl est d'abord REMPLI, puis texturé.
 *
 * Première version : des grains éparpillés sur la céramique sombre. Résultat
 * illisible — on voyait le bowl, pas la nourriture. Un bowl généreux est
 * plein à ras bord : la base doit couvrir, la texture ne fait que casser
 * l'aplat.
 */
function couchemBase(r, c) {
  const parts = [
    `<circle cx="400" cy="400" r="294" fill="${c.base}"/>`,
    `<circle cx="400" cy="400" r="294" fill="url(#reliefBase)"/>`,
  ];

  const n = c.grain === "verdure" ? 210 : 340;
  for (let i = 0; i < n; i++) {
    const [x, y] = pointDansDisque(r, 288);
    const rot = round(r() * 180);
    // Alternance clair/sombre autour de la couleur de base : c'est le
    // contraste entre grains voisins qui crée la matière, pas leur couleur.
    const clair = r() > 0.5;
    const teinte = clair ? "#ffffff" : "#000000";
    const op = round(clair ? 0.1 + r() * 0.22 : 0.06 + r() * 0.16);

    if (c.grain === "verdure") {
      const w = round(18 + r() * 26);
      parts.push(
        `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${round(w * 0.5)}" ` +
        `fill="${teinte}" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`,
      );
    } else if (c.grain === "grains") {
      const s2 = round(6 + r() * 6);
      parts.push(`<circle cx="${x}" cy="${y}" r="${s2}" fill="${teinte}" opacity="${op}"/>`);
    } else {
      const w = round(13 + r() * 8);
      parts.push(
        `<rect x="${round(x - w / 2)}" y="${round(y - 3.2)}" width="${w}" height="6.4" rx="3.2" ` +
        `fill="${teinte}" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`,
      );
    }
  }
  return parts.join("");
}

/** Morceau de protéine : polygone irrégulier, plus ou moins déchiqueté. */
function morceau(r, cx, cy, rayon, style) {
  const cotes = style === "cube" ? 4 : style === "emiette" ? 8 : 13;
  const irregularite = style === "cube" ? 0.05 : style === "emiette" ? 0.34 : 0.26;
  const pts = [];
  for (let i = 0; i < cotes; i++) {
    const a = (i / cotes) * Math.PI * 2 + r() * 0.12;
    const d = rayon * (1 - irregularite / 2 + r() * irregularite);
    pts.push(`${round(cx + Math.cos(a) * d)},${round(cy + Math.sin(a) * d)}`);
  }
  return pts.join(" ");
}

/**
 * Les morceaux sont posés en amas, pas au hasard : on sert à la louche, donc
 * les protéines se touchent et se chevauchent. Trois foyers, une dizaine de
 * morceaux autour de chacun.
 */
function couchemProteine(r, c) {
  const parts = [];
  const foyers = [];
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + r() * 0.8;
    const d = 80 + r() * 90;
    foyers.push([400 + Math.cos(a) * d, 400 + Math.sin(a) * d]);
  }

  for (let i = 0; i < 22; i++) {
    const [fx, fy] = foyers[i % foyers.length];
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 110;
    let x = round(fx + Math.cos(a) * d);
    let y = round(fy + Math.sin(a) * d);
    // On garde tout le morceau à l'intérieur de la lèvre du bowl.
    const dc = Math.hypot(x - 400, y - 400);
    if (dc > 232) {
      x = round(400 + ((x - 400) / dc) * 232);
      y = round(400 + ((y - 400) / dc) * 232);
    }
    const rayon = round(42 + r() * 30);
    const pts = morceau(r, x, y, rayon, c.chunk);
    const rot = round(r() * 360);
    parts.push(
      `<g transform="rotate(${rot} ${x} ${y})">` +
      `<polygon points="${pts}" fill="#000000" opacity="0.35" transform="translate(3 5)"/>` +
      `<polygon points="${pts}" fill="${c.protein}"/>` +
      `<polygon points="${pts}" fill="url(#faceLumiere)"/>` +
      `</g>`,
    );
  }
  return parts.join("");
}

/**
 * Filet de sauce.
 *
 * Première version : des boucles fermées qui tournaient autour du centre —
 * ça dessinait un pentagone, pas une sauce. Une sauce sort d'une pipette :
 * elle traverse le bowl en vagues ouvertes, à peu près parallèles, et
 * dépasse légèrement des bords.
 */
function couchemSauce(r, c) {
  const parts = [];
  const nb = 4;
  const angleGlobal = r() * Math.PI;

  for (let k = 0; k < nb; k++) {
    // Chaque passe est décalée perpendiculairement à la direction du geste.
    const decalage = (k - (nb - 1) / 2) * 74 + (r() - 0.5) * 30;
    const cos = Math.cos(angleGlobal);
    const sin = Math.sin(angleGlobal);
    const amplitude = 14 + r() * 18;
    const periode = 190 + r() * 120;
    // Le geste ne traverse pas toujours tout le bowl : on coupe la passe à
    // une longueur aléatoire, sinon les quatre filets sont jumeaux.
    const demi = 150 + r() * 115;
    const depart = (r() - 0.5) * 70;

    const pts = [];
    for (let t = -demi + depart; t <= demi + depart; t += 24) {
      const onde = Math.sin((t / periode) * Math.PI * 2 + k) * amplitude;
      const lx = t;
      const ly = decalage + onde;
      pts.push([
        round(400 + lx * cos - ly * sin),
        round(400 + lx * sin + ly * cos),
      ]);
    }

    // Courbe lissée : chaque segment passe par le milieu du suivant.
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [cx, cy] = pts[i];
      const mx = round((pts[i][0] + pts[i + 1][0]) / 2);
      const my = round((pts[i][1] + pts[i + 1][1]) / 2);
      d += ` Q ${cx} ${cy} ${mx} ${my}`;
    }

    const w = round(6 + r() * 5);
    parts.push(
      `<path d="${d}" fill="none" stroke="#000000" stroke-opacity="0.28" stroke-width="${round(w + 3)}" stroke-linecap="round" transform="translate(2 4)"/>`,
      `<path d="${d}" fill="none" stroke="${c.sauce}" stroke-width="${w}" stroke-linecap="round" opacity="0.94"/>`,
      `<path d="${d}" fill="none" stroke="#ffffff" stroke-opacity="0.34" stroke-width="${round(w * 0.26)}" stroke-linecap="round" transform="translate(-1 -2.4)"/>`,
    );
  }
  return parts.join("");
}

function couchemToppings(r, c) {
  const parts = [];
  for (let i = 0; i < 110; i++) {
    const [x, y] = pointDansDisque(r, 272);
    const t = r();
    if (t < 0.4) {
      // Oignons crispy : petits arcs ouverts.
      const rr = round(9 + r() * 9);
      parts.push(
        `<path d="M ${round(x - rr)} ${y} A ${rr} ${round(rr * 0.7)} 0 0 1 ${round(x + rr)} ${y}" ` +
        `fill="none" stroke="${c.pop}" stroke-width="5" stroke-linecap="round" ` +
        `transform="rotate(${round(r() * 360)} ${x} ${y})"/>`,
      );
    } else if (t < 0.72) {
      // Graines torréfiées.
      const rr = round(3.2 + r() * 3);
      parts.push(
        `<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${round(rr * 0.58)}" fill="${c.pop}" ` +
        `transform="rotate(${round(r() * 180)} ${x} ${y})"/>`,
      );
    } else if (t < 0.92) {
      // Herbes fraîches.
      const rr = round(7 + r() * 9);
      parts.push(
        `<path d="M ${x} ${round(y - rr)} L ${round(x + rr * 0.42)} ${y} L ${x} ${round(y + rr)} L ${round(x - rr * 0.42)} ${y} Z" ` +
        `fill="#8ec44a" opacity="0.9" transform="rotate(${round(r() * 360)} ${x} ${y})"/>`,
      );
    } else {
      // Éclats de sésame noir, pour piquer le regard.
      parts.push(`<circle cx="${x}" cy="${y}" r="${round(2.4 + r() * 2)}" fill="#1a1216" opacity="0.85"/>`);
    }
  }
  return parts.join("");
}

/* -------------------------------------------------------------------------- */
/*  Assemblage d'un bowl                                                       */
/* -------------------------------------------------------------------------- */

function bowlSvg(cle) {
  const c = RECETTES[cle];
  const r = rng(c.seed);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="Illustration du bowl ${cle}">
<defs>
<radialGradient id="ceramique" cx="42%" cy="34%" r="72%">
<stop offset="0%" stop-color="${c.bowl}" stop-opacity="1"/>
<stop offset="70%" stop-color="${c.bowl}" stop-opacity="1"/>
<stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
</radialGradient>
<radialGradient id="creux" cx="46%" cy="38%" r="70%">
<stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
<stop offset="62%" stop-color="#000000" stop-opacity="0"/>
<stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
</radialGradient>
<radialGradient id="reliefBase" cx="44%" cy="36%" r="70%">
<stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
<stop offset="58%" stop-color="#000000" stop-opacity="0.05"/>
<stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
</radialGradient>
<linearGradient id="faceLumiere" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
<stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
<stop offset="100%" stop-color="#000000" stop-opacity="0.28"/>
</linearGradient>
<linearGradient id="rimChaud" x1="0" y1="1" x2="1" y2="0">
<stop offset="0%" stop-color="#f0452a" stop-opacity="0.75"/>
<stop offset="100%" stop-color="#ffc23d" stop-opacity="0.2"/>
</linearGradient>
<linearGradient id="rimFroid" x1="1" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#8b6bff" stop-opacity="0.8"/>
<stop offset="100%" stop-color="#8b6bff" stop-opacity="0"/>
</linearGradient>
<clipPath id="dansLeBowl"><circle cx="400" cy="400" r="296"/></clipPath>
</defs>

<!-- Céramique -->
<circle cx="400" cy="400" r="370" fill="url(#ceramique)"/>
<!-- Rim-light : chaud en bas à gauche, froid en haut à droite. C'est la
     signature lumineuse de la marque, reprise en 3D et en CSS. -->
<circle cx="400" cy="400" r="368" fill="none" stroke="url(#rimChaud)" stroke-width="5"/>
<circle cx="400" cy="400" r="368" fill="none" stroke="url(#rimFroid)" stroke-width="3.5"/>
<circle cx="400" cy="400" r="312" fill="#000000" opacity="0.45"/>

<g clip-path="url(#dansLeBowl)">
${couchemBase(r, c)}
${couchemProteine(r, c)}
${couchemSauce(r, c)}
${couchemToppings(r, c)}
<circle cx="400" cy="400" r="296" fill="url(#creux)"/>
</g>

<!-- Reflet spéculaire sur la lèvre du bowl -->
<path d="M 172 268 A 300 300 0 0 1 400 100" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="9" stroke-linecap="round"/>
</svg>
`;
}

/* -------------------------------------------------------------------------- */
/*  Marque                                                                     */
/* -------------------------------------------------------------------------- */

/** Marque « B » : un bowl vu de face dont la contre-forme dessine un B. */
function marqueSvg({ fond = "#f0452a", trait = "#120c0a" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Bowly's">
<rect width="120" height="120" rx="30" fill="${fond}"/>
<path d="M40 30h22c11.6 0 19 6 19 15.4 0 5.9-3 10.3-8.3 12.4v.5c6.6 1.7 10.6 6.6 10.6 13.5C83.3 82 74.7 89 61.4 89H40V30Zm20.2 24.3c5.4 0 8.6-2.6 8.6-6.9s-3.1-6.8-8.4-6.8h-7.8v13.7h7.6Zm1 24.4c6 0 9.4-2.8 9.4-7.6 0-4.7-3.5-7.4-9.7-7.4h-8.3v15h8.6Z" fill="${trait}"/>
<circle cx="60" cy="60" r="44" fill="none" stroke="${trait}" stroke-opacity="0.18" stroke-width="2"/>
</svg>
`;
}

/** Image Open Graph — 1200×630, générée pour ne dépendre d'aucune photo. */
function ogSvg() {
  const r = rng(9001);
  const etoiles = [];
  for (let i = 0; i < 90; i++) {
    etoiles.push(
      `<circle cx="${round(r() * 1200)}" cy="${round(r() * 630)}" r="${round(r() * 1.6 + 0.4)}" fill="#f4efe9" opacity="${round(r() * 0.4 + 0.06)}"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs>
<radialGradient id="halo" cx="76%" cy="52%" r="52%">
<stop offset="0%" stop-color="#f0452a" stop-opacity="0.62"/>
<stop offset="55%" stop-color="#f0452a" stop-opacity="0.12"/>
<stop offset="100%" stop-color="#08070a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="froid" cx="16%" cy="18%" r="42%">
<stop offset="0%" stop-color="#8b6bff" stop-opacity="0.35"/>
<stop offset="100%" stop-color="#08070a" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="1200" height="630" fill="#08070a"/>
${etoiles.join("")}
<rect width="1200" height="630" fill="url(#froid)"/>
<rect width="1200" height="630" fill="url(#halo)"/>
<circle cx="900" cy="330" r="215" fill="#2a2029"/>
<circle cx="900" cy="330" r="215" fill="none" stroke="#f0452a" stroke-opacity="0.75" stroke-width="4"/>
<circle cx="900" cy="330" r="176" fill="#120c0a" opacity="0.7"/>
<text x="80" y="250" font-family="Haettenschweiler, 'Arial Narrow', sans-serif" font-size="96" fill="#f4efe9" letter-spacing="-2">PAS UN BOWL.</text>
<text x="80" y="352" font-family="Haettenschweiler, 'Arial Narrow', sans-serif" font-size="96" fill="#f0452a" letter-spacing="-2">UNE EXPÉRIENCE.</text>
<text x="82" y="430" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="#a49a94" letter-spacing="6">BOWLY'S</text>
</svg>
`;
}

/** Affiche verticale pour la section cinématique — un gros plan abstrait. */
function grosPlanSvg(cle, seed, teinte) {
  const r = rng(seed);
  const formes = [];
  for (let i = 0; i < 70; i++) {
    const x = round(r() * 900);
    const y = round(r() * 1200);
    const s = round(30 + r() * 180);
    formes.push(
      `<circle cx="${x}" cy="${y}" r="${s}" fill="${teinte}" opacity="${round(0.05 + r() * 0.22)}"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200" role="img" aria-label="Gros plan ${cle}">
<defs><filter id="flou"><feGaussianBlur stdDeviation="26"/></filter></defs>
<rect width="900" height="1200" fill="#0f0d12"/>
<g filter="url(#flou)">${formes.join("")}</g>
<rect width="900" height="1200" fill="url(#vign)"/>
<defs><radialGradient id="vign" cx="50%" cy="45%" r="65%">
<stop offset="55%" stop-color="#000000" stop-opacity="0"/>
<stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
</radialGradient></defs>
</svg>
`;
}

/* -------------------------------------------------------------------------- */
/*  Écriture                                                                   */
/* -------------------------------------------------------------------------- */

function ecrire(chemin, contenu) {
  const complet = join(OUT, chemin);
  mkdirSync(dirname(complet), { recursive: true });
  writeFileSync(complet, contenu, "utf8");
  return chemin;
}

const ecrits = [];

for (const cle of Object.keys(RECETTES)) {
  ecrits.push(ecrire(`products/${cle}.svg`, bowlSvg(cle)));
}

ecrits.push(ecrire("branding/mark.svg", marqueSvg()));
ecrits.push(ecrire("branding/mark-mono.svg", marqueSvg({ fond: "#f4efe9", trait: "#08070a" })));
ecrits.push(ecrire("branding/og.svg", ogSvg()));

const GROS_PLANS = [
  ["croustillant", 4101, "#f0452a"],
  ["sauce", 4202, "#c9421f"],
  ["verdure", 4303, "#7fb642"],
  ["braise", 4404, "#ffc23d"],
];
for (const [cle, seed, teinte] of GROS_PLANS) {
  ecrits.push(ecrire(`food/${cle}.svg`, grosPlanSvg(cle, seed, teinte)));
}

console.log(`${ecrits.length} fichiers écrits dans public/assets/`);
for (const f of ecrits) console.log("  ", f);
