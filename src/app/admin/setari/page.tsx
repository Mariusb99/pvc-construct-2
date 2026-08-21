import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/admin");

  const settings = await getSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-[26px] font-medium text-carbon-black">Setări</h1>
      <p className="mb-8 text-[13px] text-slate">
        Datele firmei, contactul și conținutul afișate pe site.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
