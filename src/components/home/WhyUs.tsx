import { ShieldCheck, Zap, Headset, Truck, Wrench, LifeBuoy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { getDict } from "@/lib/i18n";

const ICONS = [ShieldCheck, Zap, Headset, Truck, Wrench, LifeBuoy];

export async function WhyUs() {
  const { dict } = await getDict();

  return (
    <section className="bg-pure-white py-16">
      <Container>
        <SectionHeader eyebrow={dict.home.whyEyebrow} title={dict.home.whyTitle} align="center" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.home.why.map(({ title, desc }, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div key={title} className="flex flex-col gap-3 rounded-cards border border-silver-lining p-6">
                <Icon className="h-6 w-6 text-carbon-black" strokeWidth={1.5} />
                <h3 className="text-[16px] font-medium text-carbon-black">{title}</h3>
                <p className="text-[14px] leading-relaxed text-slate">{desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
