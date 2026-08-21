"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import bcrypt from "bcryptjs";

export type UserFormState = { status: "idle" | "error"; message?: string };

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "VANZARI");

  if (!name || !email || password.length < 8) {
    return { status: "error", message: "Completează numele, emailul și o parolă de minim 8 caractere." };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { status: "error", message: "Există deja un cont cu acest email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: role === "ADMIN" ? "ADMIN" : "VANZARI",
    active: true,
  });

  revalidatePath("/admin/useri");
  return { status: "idle" };
}

export async function updateUserRoleAction(userId: string, role: "ADMIN" | "VANZARI") {
  await requireAdmin();
  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/admin/useri");
}

export async function toggleUserActiveAction(userId: string, active: boolean) {
  await requireAdmin();
  await db.update(users).set({ active }).where(eq(users.id, userId));
  revalidatePath("/admin/useri");
}
