import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getSettings } from "@/lib/queries/settings";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Cum colectează și prelucrează PVC Construct SRL datele cu caracter personal.",
};

export default async function PrivacyPage() {
  const settingsRow = await getSettings();
  const updated = new Date().toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-[720px]">
        <h1 className="text-[32px] font-medium tracking-[-0.192px] text-carbon-black">
          Politica de confidențialitate
        </h1>
        <p className="mt-2 text-[13px] text-slate">Ultima actualizare: {updated}</p>

        <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-carbon-black">
          <section>
            <h2 className="mb-2 text-[18px] font-medium">1. Operatorul de date</h2>
            <p>
              {settingsRow.companyName}, cu sediul în {settingsRow.address}, {settingsRow.city},
              județul {settingsRow.county}, înregistrată la Registrul Comerțului sub nr.{" "}
              {settingsRow.regCom}, CUI {settingsRow.cui} ({settingsRow.euid}), este operator de
              date cu caracter personal pentru datele colectate prin acest site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">2. Ce date colectăm</h2>
            <p>
              Atunci când completezi un formular de cerere ofertă, cerere de închiriere sau contact,
              colectăm: nume, denumire companie (opțional), telefon, email, locația proiectului,
              detalii despre utilajul solicitat și orice informații suplimentare menționate în
              mesaj.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">3. Scopul prelucrării</h2>
            <p>
              Datele sunt folosite exclusiv pentru a răspunde cererilor de ofertă și de închiriere,
              pentru a pregăti oferte comerciale și, dacă este cazul, pentru a derula relația
              contractuală ulterioară. Nu folosim datele în scopuri de marketing fără consimțământul
              explicit al persoanei vizate și nu le transmitem către terți în scopuri comerciale.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">4. Temeiul legal</h2>
            <p>
              Prelucrarea se bazează pe consimțământul oferit la trimiterea formularului și, ulterior,
              pe executarea unui eventual contract de vânzare sau închiriere, conform Regulamentului
              (UE) 2016/679 (GDPR).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">5. Perioada de păstrare</h2>
            <p>
              Datele din cererile de ofertă sunt păstrate pe durata necesară derulării solicitării și
              ulterior conform obligațiilor legale de arhivare a documentelor comerciale și fiscale.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">6. Drepturile tale</h2>
            <p>
              Ai dreptul de acces, rectificare, ștergere, restricționare a prelucrării, portabilitate
              a datelor și dreptul de a te opune prelucrării. Poți retrage oricând consimțământul
              pentru prelucrările bazate pe acesta.
              {settingsRow.email && (
                <>
                  {" "}
                  Pentru exercitarea acestor drepturi, ne poți contacta la{" "}
                  <a href={`mailto:${settingsRow.email}`} className="text-peloton-red hover:underline">
                    {settingsRow.email}
                  </a>
                  .
                </>
              )}
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">7. Cookie-uri</h2>
            <p>
              Site-ul folosește module cookie strict necesare pentru funcționarea corectă (ex.
              menținerea sesiunii de administrare). Nu folosim cookie-uri de urmărire publicitară
              fără acordul tău.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-medium">8. Autoritatea de supraveghere</h2>
            <p>
              Dacă consideri că drepturile tale privind protecția datelor au fost încălcate, te poți
              adresa Autorității Naționale de Supraveghere a Prelucrării Datelor cu Caracter Personal
              (ANSPDCP).
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
