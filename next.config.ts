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
     * Sans effet tant que `unoptimized` est actif, mais conservé : la liste
     * redevient la source de vérité dès qu'un loader ou un hébergement avec
     * serveur est mis en place.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
