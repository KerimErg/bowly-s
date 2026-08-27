import type { NextConfig } from "next";

/**
 * `basePath` pour un déploiement en sous-répertoire (GitHub Pages « projet »).
 *
 * Piloté par variable d'environnement plutôt que codé en dur : `npm run dev`
 * et un éventuel déploiement à la racine d'un domaine (Vercel, domaine
 * personnalisé) continuent de fonctionner sans toucher à ce fichier.
 * Le workflow GitHub Pages l'alimente avec la sortie `base_path` de
 * `actions/configure-pages`.
 */
function resolveBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
  // `configure-pages` renvoie "/" pour un site utilisateur/organisation ;
  // or Next.js refuse `basePath: "/"` comme tout chemin terminé par "/".
  const normalized = raw.replace(/\/+$/, "");
  if (!normalized) return "";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  /**
   * Export statique : `next build` produit un dossier `out/` composé
   * uniquement de HTML/CSS/JS, hébergeable sur n'importe quel serveur de
   * fichiers — dont GitHub Pages.
   */
  output: "export",

  /**
   * GitHub Pages sert des fichiers, pas des routes : sans slash final,
   * `/menu` renverrait une 404. Avec cette option, Next.js émet
   * `out/menu/index.html`, que Pages sert correctement sur `/menu/`.
   */
  trailingSlash: true,

  basePath,
  assetPrefix: basePath || undefined,

  images: {
    /**
     * L'API d'optimisation d'images de Next.js exige un serveur Node.js :
     * elle n'existe pas dans un export statique. `next/image` retombe donc
     * sur une balise `<img>` classique, en conservant le lazy loading natif,
     * les `sizes` et les dimensions — donc aucun décalage de mise en page.
     *
     * Pour retrouver une vraie optimisation sur un hébergement statique,
     * branchez un loader personnalisé (Cloudinary, imgix…) :
     * `images: { loader: "custom", loaderFile: "./lib/image-loader.ts" }`.
     */
    unoptimized: true,

    /**
     * N'importe quel hôte HTTPS est accepté.
     *
     * C'est délibéré et sans risque ici : avec `unoptimized: true` et un export
     * statique, Next.js ne va JAMAIS chercher ces images côté serveur — il
     * écrit simplement l'adresse dans la balise, et c'est le navigateur du
     * visiteur qui la charge. Il n'y a donc pas de serveur à protéger d'une
     * requête sortante arbitraire.
     *
     * La raison d'être : `lib/photos.ts` invite à coller une adresse
     * d'Unsplash, de Pexels ou d'un CDN. Restreindre la liste ici obligerait à
     * revenir modifier ce fichier à chaque nouvelle source, pour une erreur
     * incompréhensible côté utilisateur.
     *
     * ⚠️ Le jour où l'on abandonne l'export statique pour un hébergement avec
     * serveur, cette permissivité redevient un vrai sujet — l'optimiseur
     * d'images irait alors chercher n'importe quelle URL. Il faudra restreindre
     * la liste aux hôtes réellement utilisés.
     */
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
