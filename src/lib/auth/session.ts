import { auth } from "@/lib/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Neautorizat — sesiune inexistentă.");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Această acțiune este permisă doar administratorilor.");
  }
  return user;
}
