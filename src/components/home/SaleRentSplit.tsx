import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getDict } from "@/lib/i18n";

export async function SaleRentSplit() {
  const { dict } = await getDict();

  const items = [
    {
      href: "/utilaje?listingType=vanzare",
      title: dict.home.buyTitle,
      description: dict.home.buyDesc,
      cta: dict.home.buyCta,
    },
    {
      href: "/utilaje?listingType=inchiriere",
      title: dict.home.rentTitle,
      description: dict.home.rentDesc,
      cta: dict.home.rentCta,
    },
  ];

  return (
    <section className="py-16">
      <Container>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between gap-8 rounded-cards bg-carbon-black p-10 transition-colors hover:bg-[#101113]"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-[26px] font-medium tracking-[-0.104px] text-pure-white">
                  {item.title}
                </h3>
                <p className="max-w-[380px] text-[14px] leading-relaxed text-pure-white/70">
                  {item.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[14px] font-medium text-pure-white">
                {item.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
