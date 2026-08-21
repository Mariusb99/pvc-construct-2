import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhyUs } from "@/components/home/WhyUs";
import { getSettings } from "@/lib/queries/settings";
import { getDict } from "@/lib/i18n";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Despre noi",
  description:
    "PVC Construct SRL — companie din județul Mureș specializată în vânzarea și închirierea de utilaje de construcții.",
};

function yearsSince(dateStr: string | null) {
  if (!dateStr) return null;
  const founded = new Date(dateStr).getFullYear();
  const now = new Date().getFullYear();
  return now - founded;
}

/** Înlocuiește {placeholder}-urile din textele dicționarului cu valori reale. */
function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export default async function DespreNoiPage() {
  const [settingsRow, { locale, dict }] = await Promise.all([getSettings(), getDict()]);
  const t = dict.about;
  const years = yearsSince(settingsRow.foundedAt);

  // În română, numeralele sub 20 nu primesc „de": „18 ani", dar „20 de ani".
  const title = years
    ? locale === "ro"
      ? `${years} ${years < 20 ? "ani" : "de ani"} ${t.titleSuffix}`
      : `${years} ${t.titleSuffix}`
    : t.titleFallback;

  const values = {
    company: settingsRow.companyName,
    year: settingsRow.foundedAt?.slice(0, 4) ?? "—",
    county: settingsRow.county ?? "",
    city: settingsRow.city ?? "",
  };

  return (
    <>
      <section className="bg-carbon-black py-20">
        <Container>
          <span className="text-[13px] font-medium uppercase tracking-[0.3px] text-pure-white/70">
            {t.eyebrow} {settingsRow.companyName}
          </span>
          <h1 className="mt-3 max-w-[640px] text-[40px] font-light leading-tight tracking-[-0.288px] text-pure-white">
            {title}
          </h1>
          <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-pure-white/70">
            {fill(t.intro, values)}
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-[26px] font-medium tracking-[-0.104px] text-carbon-black">
              {t.whoTitle}
            </h2>
            <p className="text-[15px] leading-relaxed text-slate">{fill(t.whoP1, values)}</p>
            <p className="text-[15px] leading-relaxed text-slate">{fill(t.whoP2, values)}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-cards border border-silver-lining bg-pure-white p-6">
            <div className="flex justify-between border-b border-silver-lining pb-3 text-[14px]">
              <span className="text-slate">{t.name}</span>
              <span className="font-medium text-carbon-black">{settingsRow.companyName}</span>
            </div>
            <div className="flex justify-between border-b border-silver-lining pb-3 text-[14px]">
              <span className="text-slate">{t.cui}</span>
              <span className="font-medium text-carbon-black">{settingsRow.cui}</span>
            </div>
            <div className="flex justify-between border-b border-silver-lining pb-3 text-[14px]">
              <span className="text-slate">{t.regCom}</span>
              <span className="font-medium text-carbon-black">{settingsRow.regCom}</span>
            </div>
            <div className="flex justify-between border-b border-silver-lining pb-3 text-[14px]">
              <span className="text-slate">{t.founded}</span>
              <span className="font-medium text-carbon-black">
                {settingsRow.foundedAt
                  ? new Date(settingsRow.foundedAt).toLocaleDateString(
                      locale === "ro" ? "ro-RO" : "en-GB"
                    )
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-slate">{t.hq}</span>
              <span className="max-w-[220px] text-right font-medium text-carbon-black">
                {settingsRow.address}, {settingsRow.city}, {settingsRow.county}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <WhyUs />

      <section className="bg-carbon-black py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-[26px] font-medium tracking-[-0.104px] text-pure-white">
            {t.ctaTitle}
          </h2>
          <Button href="/contact#cerere-oferta" variant="primary">
            {t.ctaButton}
          </Button>
        </Container>
      </section>
    </>
  );
}
