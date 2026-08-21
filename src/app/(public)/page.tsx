import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { QuickSearch } from "@/components/home/QuickSearch";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { SaleRentSplit } from "@/components/home/SaleRentSplit";
import { WhyUs } from "@/components/home/WhyUs";
import { FinalCta } from "@/components/home/FinalCta";
import { getSettings } from "@/lib/queries/settings";

// ISR: pagina se regenerează cel mult o dată pe minut — suficient de proaspăt
// pentru modificări din admin, fără să interogăm baza la fiecare vizită.
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pvcconstruct.ro";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Utilaje de construcții de vânzare și închiriere",
    description:
      settings.heroSubheadline ||
      `${settings.companyName} — vânzare și închiriere de utilaje de construcții: excavatoare, buldoexcavatoare, nacele, stivuitoare, compactoare și multe altele.`,
    alternates: { canonical: siteUrl },
  };
}

export default async function Home() {
  const settings = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyName,
    url: siteUrl,
    ...(settings.logoUrl ? { logo: settings.logoUrl } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || undefined,
      addressLocality: settings.city || undefined,
      addressRegion: settings.county || undefined,
      postalCode: settings.postalCode || undefined,
      addressCountry: "RO",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <QuickSearch />
      <FeaturedEquipment />
      <SaleRentSplit />
      <WhyUs />
      <FinalCta />
    </>
  );
}
