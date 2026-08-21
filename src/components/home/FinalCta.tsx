import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getDict } from "@/lib/i18n";

export async function FinalCta() {
  const { dict } = await getDict();

  return (
    <section className="bg-carbon-black py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-[560px] text-[32px] font-light leading-tight tracking-[-0.192px] text-pure-white">
          {dict.home.ctaTitle}
        </h2>
        <p className="max-w-[460px] text-[16px] text-pure-white/70">{dict.home.ctaDesc}</p>
        <Button href="/contact#cerere-oferta" variant="primary">
          {dict.common.requestQuote}
        </Button>
      </Container>
    </section>
  );
}
