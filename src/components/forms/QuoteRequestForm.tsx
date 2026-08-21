"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitLeadAction, type LeadFormState } from "@/lib/actions/leads";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

type EquipmentContext = {
  id: string;
  model: string;
  status: string;
  rentalPriceDay: string | null;
  rentalPriceWeek: string | null;
  rentalPriceMonth: string | null;
};

const initialState: LeadFormState = { status: "idle" };

function canSell(status: string) {
  return status === "DE_VANZARE" || status === "DE_VANZARE_SI_INCHIRIAT";
}
function canRent(status: string) {
  return status === "DE_INCHIRIAT" || status === "DE_VANZARE_SI_INCHIRIAT";
}

function estimateRentalCost(
  days: number,
  eq: Pick<EquipmentContext, "rentalPriceDay" | "rentalPriceWeek" | "rentalPriceMonth">
) {
  if (days <= 0) return null;
  const day = eq.rentalPriceDay ? Number(eq.rentalPriceDay) : null;
  const week = eq.rentalPriceWeek ? Number(eq.rentalPriceWeek) : null;
  const month = eq.rentalPriceMonth ? Number(eq.rentalPriceMonth) : null;

  if (days >= 28 && month) return (days / 28) * month;
  if (days >= 7 && week) return (days / 7) * week;
  if (day) return days * day;
  return null;
}

function SubmitButton({ sending, submit }: { sending: string; submit: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" className="w-full" disabled={pending}>
      {pending ? sending : submit}
    </Button>
  );
}

export function QuoteRequestForm({
  equipment,
  locale = "ro",
}: {
  equipment?: EquipmentContext;
  locale?: Locale;
}) {
  const t = dictionaries[locale].form;
  const [state, formAction] = useActionState(submitLeadAction, initialState);

  const allowedTypes = useMemo<Array<"VANZARE" | "INCHIRIERE" | "GENERAL">>(() => {
    if (!equipment) return ["GENERAL", "VANZARE", "INCHIRIERE"];
    const types: Array<"VANZARE" | "INCHIRIERE"> = [];
    if (canSell(equipment.status)) types.push("VANZARE");
    if (canRent(equipment.status)) types.push("INCHIRIERE");
    return types.length ? types : ["GENERAL"];
  }, [equipment]);

  const [requestType, setRequestType] = useState(allowedTypes[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diff) + 1);
  }, [startDate, endDate]);

  const estimate =
    equipment && requestType === "INCHIRIERE" ? estimateRentalCost(days, equipment) : null;

  if (state.status === "success") {
    return (
      <div className="rounded-cards border border-silver-lining bg-pure-white p-6 text-center">
        <p className="text-[16px] font-medium text-carbon-black">{t.successTitle}</p>
        <p className="mt-2 text-[14px] text-slate">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {equipment && <input type="hidden" name="equipmentId" value={equipment.id} />}

      {equipment ? (
        <div>
          <Label>{t.equipment}</Label>
          <p className="rounded-inputs border border-silver-lining bg-mist-gray px-4 py-3 text-[15px] text-carbon-black">
            {equipment.model}
          </p>
        </div>
      ) : null}

      {allowedTypes.length > 1 && (
        <div>
          <Label htmlFor="requestType">{t.requestType}</Label>
          <Select
            id="requestType"
            name="requestType"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as typeof requestType)}
          >
            {allowedTypes.includes("VANZARE") && <option value="VANZARE">{t.buy}</option>}
            {allowedTypes.includes("INCHIRIERE") && <option value="INCHIRIERE">{t.rentType}</option>}
            {allowedTypes.includes("GENERAL") && <option value="GENERAL">{t.general}</option>}
          </Select>
        </div>
      )}
      {allowedTypes.length === 1 && (
        <input type="hidden" name="requestType" value={allowedTypes[0]} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="customerName">{t.name}</Label>
          <Input id="customerName" name="customerName" required />
          <FieldError>{state.fieldErrors?.customerName}</FieldError>
        </div>
        <div>
          <Label htmlFor="company">{t.company}</Label>
          <Input id="company" name="company" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">{t.phone}</Label>
          <Input id="phone" name="phone" type="tel" required />
          <FieldError>{state.fieldErrors?.phone}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">{t.email}</Label>
          <Input id="email" name="email" type="email" required />
          <FieldError>{state.fieldErrors?.email}</FieldError>
        </div>
      </div>

      {requestType === "INCHIRIERE" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">{t.periodStart}</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FieldError>{state.fieldErrors?.startDate}</FieldError>
          </div>
          <div>
            <Label htmlFor="endDate">{t.periodEnd}</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {estimate !== null && days > 0 && (
        <p className="rounded-inputs bg-mist-gray px-4 py-3 text-[13px] text-slate">
          {t.estimatePrefix}{" "}
          <span className="font-medium text-carbon-black">{days} {t.days}</span> ≈{" "}
          <span className="font-medium text-carbon-black">{formatPrice(estimate)}</span>{" "}
          {t.estimateSuffix}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="quantity">{t.quantity}</Label>
          <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} />
        </div>
        <div>
          <Label htmlFor="projectLocation">{t.projectLocation}</Label>
          <Input id="projectLocation" name="projectLocation" placeholder={t.locationPlaceholder} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t.message}</Label>
        <Textarea id="message" name="message" placeholder={t.messagePlaceholder} />
      </div>

      <label className="flex items-start gap-2.5 text-[13px] text-slate">
        <input type="checkbox" name="gdprConsent" required className="mt-0.5 h-4 w-4 accent-peloton-red" />
        <span>
          {t.gdprPrefix}{" "}
          <a href="/politica-de-confidentialitate" className="text-peloton-red hover:underline">
            {t.gdprLink}
          </a>
          .
        </span>
      </label>
      <FieldError>{state.fieldErrors?.gdprConsent}</FieldError>

      {state.status === "error" && state.message && (
        <p className="text-[13px] text-peloton-red">{state.message}</p>
      )}

      <SubmitButton sending={t.sending} submit={t.submit} />
    </form>
  );
}
