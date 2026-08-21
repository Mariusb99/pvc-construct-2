"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Input, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createUserAction, type UserFormState } from "@/lib/actions/users";

const initialState: UserFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Se creează..." : "Creează cont"}
    </Button>
  );
}

export function NewUserForm() {
  const [state, formAction] = useActionState(createUserAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "idle" && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && (
        <div className="rounded-tags border border-peloton-red/30 bg-peloton-red/5 px-4 py-3 text-[13px] text-peloton-red">
          {state.message}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nume</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Parolă (min. 8 caractere)</Label>
          <Input id="password" name="password" type="password" minLength={8} required />
        </div>
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select id="role" name="role" defaultValue="VANZARI">
            <option value="VANZARI">Vânzări</option>
            <option value="ADMIN">Administrator</option>
          </Select>
        </div>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
