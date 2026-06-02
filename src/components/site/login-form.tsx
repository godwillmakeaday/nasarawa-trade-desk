"use client";

import { useActionState } from "react";
import { login, type LoginActionState } from "@/app/login/actions";

const initialState: LoginActionState = { ok: false, message: "" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form className="mt-6 grid gap-4" action={formAction}>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.message && !state.ok ? (
        <p
          role="alert"
          className="rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"
        >
          {state.message}
        </p>
      ) : null}

      <label className="grid gap-2">
        <span className="text-sm font-bold text-zinc-700">Email address</span>
        <input
          className="rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
          placeholder="name@example.com"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
        {state.fieldErrors?.email ? (
          <span className="text-xs font-bold text-rose-600">{state.fieldErrors.email[0]}</span>
        ) : null}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-zinc-700">Password</span>
        <input
          className="rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
          placeholder="Enter password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        {state.fieldErrors?.password ? (
          <span className="text-xs font-bold text-rose-600">{state.fieldErrors.password[0]}</span>
        ) : null}
      </label>

      <button
        className="focus-ring rounded-md bg-market-green px-4 py-3 text-sm font-black text-white disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Continue"}
      </button>
    </form>
  );
}
