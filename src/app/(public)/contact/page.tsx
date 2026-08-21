import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { getSettings } from "@/lib/queries/settings";
import { getDict } from "@/lib/i18n";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează PVC Construct pentru vânzare sau închiriere de utilaje de construcții.",
};

export default async function ContactPage() {
  const [settingsRow, { locale, dict }] = await Promise.all([getSettings(), getDict()]);
  const t = dict.contact;
  const addressLine = [settingsRow.address, settingsRow.postalCode].filter(Boolean).join(", ");
  const localityLine = [settingsRow.city, settingsRow.county].filter(Boolean).join(", ");

  return (
    <Container className="py-16">
      <div className="mb-12 max-w-[640px]">
        <h1 className="text-[36px] font-medium tracking-[-0.288px] text-carbon-black">{t.title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-slate">{t.intro}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 rounded-cards border border-silver-lining bg-pure-white p-5">
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-carbon-black" strokeWidth={1.5} />
            <div>
              <p className="text-[14px] font-medium text-carbon-black">{settingsRow.companyName}</p>
              <p className="text-[14px] text-slate">
                {addressLine}
                {addressLine && <br />}
                {localityLine}
              </p>
            </div>
          </div>

          {settingsRow.phone && (
            <div className="flex items-center gap-4 rounded-cards border border-silver-lining bg-pure-white p-5">
              <Phone className="h-5 w-5 flex-shrink-0 text-carbon-black" strokeWidth={1.5} />
              <a href={`tel:${settingsRow.phone.replace(/\s+/g, "")}`} className="text-[14px] font-medium text-carbon-black hover:text-peloton-red">
                {settingsRow.phone}
              </a>
            </div>
          )}

          {settingsRow.email && (
            <div className="flex items-center gap-4 rounded-cards border border-silver-lining bg-pure-white p-5">
              <Mail className="h-5 w-5 flex-shrink-0 text-carbon-black" strokeWidth={1.5} />
              <a href={`mailto:${settingsRow.email}`} className="text-[14px] font-medium text-carbon-black hover:text-peloton-red">
                {settingsRow.email}
              </a>
            </div>
          )}

          <div className="flex items-start gap-4 rounded-cards border border-silver-lining bg-pure-white p-5">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-carbon-black" strokeWidth={1.5} />
            <div>
              <p className="text-[14px] font-medium text-carbon-black">{t.schedule}</p>
              <p className="text-[14px] text-slate">{t.scheduleValue}</p>
            </div>
          </div>

          <div className="rounded-cards border border-silver-lining bg-mist-gray p-5 text-[13px] text-slate">
            <p>CUI {settingsRow.cui}</p>
            <p>Reg. Com. {settingsRow.regCom}</p>
            {settingsRow.euid && <p>EUID {settingsRow.euid}</p>}
          </div>
        </div>

        <div
          id="cerere-oferta"
          className="h-fit rounded-cards border border-silver-lining bg-pure-white p-6"
        >
          <h2 className="mb-4 text-[18px] font-medium text-carbon-black">{t.sendMessage}</h2>
          <QuoteRequestForm locale={locale} />
        </div>
      </div>
    </Container>
  );
}
