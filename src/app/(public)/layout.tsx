import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // padding-ul de jos lasă loc barei fixe de acțiune de pe mobil
    <div className="flex min-h-screen flex-col bg-mist-gray pb-[76px] lg:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileCtaBar />
    </div>
  );
}
