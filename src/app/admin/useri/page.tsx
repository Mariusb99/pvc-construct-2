import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/queries/users";
import { toggleUserActiveAction, updateUserRoleAction } from "@/lib/actions/users";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { NewUserForm } from "@/components/admin/NewUserForm";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ROLE_LABELS = { ADMIN: "Administrator", VANZARI: "Vânzări" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/admin");

  const usersList = await getAllUsers();
  const currentUserId = session.user.id;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-[26px] font-medium text-carbon-black">Useri</h1>
      <p className="mb-8 text-[13px] text-slate">
        Conturile care au acces la panoul de administrare.
      </p>

      <div className="mb-8 overflow-hidden rounded-cards border border-silver-lining bg-pure-white">
        <div className="border-b border-silver-lining px-5 py-4">
          <h2 className="text-[15px] font-medium text-carbon-black">Adaugă cont nou</h2>
        </div>
        <div className="p-5">
          <NewUserForm />
        </div>
      </div>

      <div className="overflow-hidden rounded-cards border border-silver-lining bg-pure-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-[13px]">
            <thead className="border-b border-silver-lining bg-mist-gray text-[11px] uppercase tracking-[0.3px] text-steel">
              <tr>
                <th className="px-4 py-3">Nume</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} className="border-b border-silver-lining last:border-0">
                  <td className="px-4 py-3 font-medium text-carbon-black">
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="ml-2 text-[11px] text-fog">(tu)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate">{u.email}</td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      value={u.role}
                      options={Object.entries(ROLE_LABELS).map(([value, label]) => ({
                        value: value as "ADMIN" | "VANZARI",
                        label,
                      }))}
                      onChange={async (role) => {
                        "use server";
                        await updateUserRoleAction(u.id, role);
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await toggleUserActiveAction(u.id, !u.active);
                      }}
                    >
                      <button
                        type="submit"
                        className={cn(
                          "rounded-tags px-3 py-1.5 text-[12px] font-medium",
                          u.active
                            ? "bg-carbon-black text-pure-white"
                            : "border border-silver-lining text-slate"
                        )}
                      >
                        {u.active ? "Activ" : "Dezactivat"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
