import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ascunde indicatorul „N" al Next.js din colțul paginii în modul de dezvoltare.
  devIndicators: false,
  images: {
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
