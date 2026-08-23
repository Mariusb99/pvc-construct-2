import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ascunde indicatorul „N" al Next.js din colțul paginii în modul de dezvoltare.
  devIndicators: false,
  eslint: {
    // Regulile de stil (ghilimele, spațieri etc.) nu trebuie să blocheze un
    // deploy în producție. Verificarea de tipuri TypeScript rămâne activă și
    // oprește build-ul la erori reale.
    ignoreDuringBuilds: true,
  },
  images: {
    // AVIF înaintea WebP: aceeași calitate vizuală la ~20-30% mai puțini
    // octeți, important pe conexiuni mobile. Browserele vechi primesc WebP.
    formats: ["image/avif", "image/webp"],
    // Praguri adaptate site-ului: cardurile de utilaj nu depășesc ~640px pe
    // mobil, iar galeria ~1200px — nu are rost să generăm variante uriașe.
    imageSizes: [64, 96, 128, 192, 256, 384],
    deviceSizes: [360, 420, 640, 828, 1080, 1200, 1920],
    // Permite afișarea imaginilor urcate în Supabase Storage (orice proiect
    // *.supabase.co) prin componenta next/image, atât pentru domeniul de
    // storage cât și pentru orice subdomeniu custom configurat ulterior.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
