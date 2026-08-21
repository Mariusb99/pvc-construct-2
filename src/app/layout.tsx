import type { Metadata } from "next";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pvcconstruct.ro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PVC Construct — Utilaje de construcții de vânzare și închiriere",
    template: "%s | PVC Construct",
  },
  description:
    "PVC Construct SRL — vânzare și închiriere de utilaje de construcții: excavatoare, buldoexcavatoare, nacele, stivuitoare, compactoare și multe altele.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="antialiased">{children}</body>
    </html>
  );
}
