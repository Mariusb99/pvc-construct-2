import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getSettings } from "@/lib/queries/settings";
import { getDict } from "@/lib/i18n";

export async function Hero() {
  const [settingsRow, { locale, dict }] = await Promise.all([getSettings(), getDict()]);

  // Titlul/subtitlul din admin sunt scrise în română; pentru engleză folosim
  // traducerile din dicționar.
  const headline =
    locale === "ro"
      ? settingsRow.heroHeadline ?? dict.hero.headline
      : dict.hero.headline;
  const subheadline =
    locale === "ro" ? settingsRow.heroSubheadline : dict.hero.subheadline;

  return (
    <section className="relative flex min-h-[560px] items-end overflow-hidden bg-carbon-black">
      {settingsRow.heroImageUrl && (
        <Image
          src={settingsRow.heroImageUrl}
          alt="Utilaje de construcții PVC Construct"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
      )}
      {/* Scrim: poza e luminoasă la golden hour — degradeul păstrează textul
          alb lizibil fără să acopere fotografia (decizia de design #1). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(24,26,29,0.30) 0%, rgba(24,26,29,0.55) 45%, rgba(24,26,29,0.95) 94%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 pb-16 pt-32">
        <span className="text-[14px] font-medium text-pure-white/85">
          {dict.hero.eyebrow}
        </span>
        <h1 className="max-w-[720px] text-[36px] font-light leading-[1.15] tracking-[-0.288px] text-pure-white sm:text-[48px] sm:tracking-[-0.384px]">
          {headline}
        </h1>
        {subheadline && (
          <p className="max-w-[560px] text-[18px] leading-relaxed text-pure-white/80">
            {subheadline}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-3">
          <Button href="/utilaje" variant="primary">
            {dict.hero.ctaPrimary}
          </Button>
          <Button href="/contact#cerere-oferta" variant="ghost-dark">
            {dict.hero.ctaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
