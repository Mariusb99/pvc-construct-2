"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/lib/auth/actions";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" className="w-full" disabled={pending}>
      {pending ? "Se conectează..." : "Conectează-te"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon-black px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <span className="text-[14px] font-semibold uppercase tracking-[0.025em] text-pure-white">
            PVC Construct
          </span>
          <h1 className="mt-3 text-[26px] font-medium text-pure-white">Autentificare admin</h1>
        </div>

        <form action={formAction} className="flex flex-col gap-4 rounded-cards bg-pure-white p-7">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoFocus />
          </div>
          <div>
            <Label htmlFor="password">Parolă</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          {state?.error && (
            <p className="text-[13px] text-peloton-red">{state.error}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
