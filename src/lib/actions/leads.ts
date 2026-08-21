"use server";

import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { leadSchema } from "@/lib/validations/lead";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitLeadAction(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Verifică datele completate.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await db.insert(leads).values({
      equipmentId: data.equipmentId || null,
      customerName: data.customerName,
      company: data.company || null,
      email: data.email,
      phone: data.phone,
      requestType: data.requestType,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      projectLocation: data.projectLocation || null,
      quantity: data.quantity ?? 1,
      message: data.message || null,
      gdprConsent: true,
      status: "NOU",
    });

    return {
      status: "success",
      message:
        "Mulțumim! Cererea ta a fost înregistrată — revenim în cel mai scurt timp cu un răspuns.",
    };
  } catch (error) {
    console.error("submitLeadAction failed", error);
    return {
      status: "error",
      message: "A apărut o eroare la trimiterea cererii. Încearcă din nou sau sună-ne direct.",
    };
  }
}
