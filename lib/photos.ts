/**
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  VOS PHOTOS ET VOS VIDÉOS — LE SEUL FICHIER À REMPLIR                 ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 *
 * Collez une adresse entre les guillemets, enregistrez, c'est à l'écran.
 * Laissez vide (`""`), et le site retombe automatiquement sur l'illustration
 * dessinée. Aucun autre fichier n'est à toucher. Rien ne peut casser : une
 * ligne vide est un cas prévu, pas un oubli.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ CE QU'ON PEUT COLLER                                                  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 *  1. UN FICHIER À VOUS — le meilleur choix.
 *     Déposez-le dans `public/assets/products/` puis écrivez :
 *         photo: "/assets/products/the-og.jpg"
 *
 *  2. UNE ADRESSE INTERNET — pour aller vite, en maquette.
 *         photo: "https://images.unsplash.com/photo-xxxxxxxx?w=1200"
 *     Sur Unsplash : clic droit sur la photo → « Copier l'adresse de
 *     l'image ». Sur Pexels : bouton « Free download » → clic droit sur
 *     l'image ouverte → « Copier l'adresse de l'image ».
 *
 *  ⚠️ TROIS AVERTISSEMENTS, DANS L'ORDRE D'IMPORTANCE
 *
 *  1. NE PAS PRENDRE LES PHOTOS D'UNE AUTRE ENSEIGNE.
 *     Ce sont leurs plats, leur shooting, leur budget. Les afficher comme
 *     ceux de Bowly's, même « juste pour la maquette », est une contrefaçon
 *     dès que le site est en ligne — et il l'est. Le jour où quelqu'un
 *     reconnaît le plat d'un concurrent sur votre site, c'est la marque qui
 *     paie. Unsplash et Pexels sont gratuits, libres pour un usage
 *     commercial, et personne ne viendra les réclamer.
 *
 *  2. Une adresse externe peut disparaître du jour au lendemain. Pour la
 *     mise en ligne définitive, déposez les fichiers dans `public/`.
 *
 *  3. Les textes `alt` décrivent ce qu'on doit VOIR. Si vous changez la
 *     photo, changez la description : c'est ce que lisent les moteurs de
 *     recherche et les lecteurs d'écran.
 */

/** Une photo fournie par vous. `src` vide = pas encore de photo. */
export type PhotoFournie = {
  src: string;
  alt: string;
};

const RIEN: PhotoFournie = { src: "", alt: "" };

/* ═══════════════════════════════════════════════════════════════════════════
   LES BOWLS DE LA CARTE
   Une entrée par plat. L'identifiant à gauche ne doit pas changer.
   ═══════════════════════════════════════════════════════════════════════════ */

export const photosBowls: Record<string, PhotoFournie> = {
  "the-og": {
    src: "",
    alt: "Bowl The OG : poulet pané doré sur riz, sauce fumée et oignons frits",
  },
  "spicy-bowly": {
    src: "",
    alt: "Bowl Spicy Bowly : poulet glacé au piment, sauce rouge brillante, graines torréfiées",
  },
  "crispy-korean": {
    src: "",
    alt: "Bowl Crispy Korean : poulet laqué gochujang, kimchi, oignons verts et sésame",
  },
  "green-riot": {
    src: "",
    alt: "Bowl Green Riot : jeunes pousses, pois chiches rôtis, avocat et sauce verte",
  },
  "blue-lagoon": {
    src: "",
    alt: "Bowl Blue Lagoon : saumon mariné, mangue, avocat et sésame noir sur riz vinaigré",
  },
  "the-heavy": {
    src: "",
    alt: "Bowl The Heavy : double protéine, cheddar fondu et sauce brune sur céréales",
  },
  "smoke-show": {
    src: "",
    alt: "Bowl Smoke Show : effiloché fumé, maïs grillé, sauce barbecue noire et pickles",
  },
  "the-side": {
    src: "",
    alt: "Assortiment de sides : oignons frits, pois chiches soufflés et sauces maison",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   LA SECTION CINÉMA — les quatre plans plein écran
   C'est ici que les VIDÉOS comptent le plus. Un plan de sauce qui coule en
   vidéo vaut dix photos.
   ═══════════════════════════════════════════════════════════════════════════ */

export type PlanFourni = {
  /** Image fixe. Sert aussi d'affiche pendant le chargement de la vidéo. */
  photo: string;
  /**
   * Vidéo. Format `.mp4` (H.264), muette, en boucle, 3 à 6 secondes.
   * Cadrage vertical de préférence : c'est ce qui sert aussi en story.
   * Laissez vide pour n'afficher que la photo.
   */
  video: string;
  alt: string;
};

export const photosCinema: Record<string, PlanFourni> = {
  croustillant: {
    photo: "",
    video: "",
    alt: "Gros plan sur une panure dorée qui craque sous les doigts",
  },
  sauce: {
    photo: "",
    video: "",
    alt: "Gros plan sur une sauce épaisse qui coule sur un bowl",
  },
  braise: {
    photo: "",
    video: "",
    alt: "Gros plan sur des morceaux caramélisés qui fument encore",
  },
  verdure: {
    photo: "",
    video: "",
    alt: "Gros plan sur des herbes fraîches et des graines torréfiées",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   LE MUR SOCIAL — vidéos verticales 9:16
   ═══════════════════════════════════════════════════════════════════════════ */

export const photosSociales: PhotoFournie[] = [
  { ...RIEN },
  { ...RIEN },
  { ...RIEN },
  { ...RIEN },
  { ...RIEN },
  { ...RIEN },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Utilitaires — rien à modifier en dessous de cette ligne.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Une adresse vide, ou faite d'espaces, compte comme absente. */
export function estFournie(src: string | undefined | null): boolean {
  return typeof src === "string" && src.trim().length > 0;
}

/**
 * Combien de visuels sont réellement fournis.
 * Affiché sur la page « La marque » : le site dit lui-même où il en est,
 * plutôt que de laisser croire que tout est prêt.
 */
export function etatDesVisuels() {
  const bowls = Object.values(photosBowls);
  const cinemaPhotos = Object.values(photosCinema);
  return {
    bowlsFournis: bowls.filter((p) => estFournie(p.src)).length,
    bowlsTotal: bowls.length,
    plansFournis: cinemaPhotos.filter((p) => estFournie(p.photo)).length,
    plansTotal: cinemaPhotos.length,
    videosFournies: cinemaPhotos.filter((p) => estFournie(p.video)).length,
    socialesFournies: photosSociales.filter((p) => estFournie(p.src)).length,
    socialesTotal: photosSociales.length,
  };
}
