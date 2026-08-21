import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Pagina de login nu are sesiune și nu trebuie învelită în shell-ul cu sidebar.
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <AdminShell userName={session.user.name ?? session.user.email ?? "Utilizator"} userRole={session.user.role}>
      {children}
    </AdminShell>
  );
}
