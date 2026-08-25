import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Seul Unsplash est autorisé : toutes les photos du site passent par
     * `lib/images.ts`. Ajoutez ici l'hôte de votre futur CMS / CDN le jour où
     * la marque disposera de sa propre production photo.
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
