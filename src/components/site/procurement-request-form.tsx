"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, ImageUp } from "lucide-react";
import {
  createProcurementRequest,
  type RequestActionState
} from "@/app/request/actions";
import { marketNodes } from "@/data/mock";

const initialState: RequestActionState = {
  ok: false,
  message: ""
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-market-green px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={pending}
      type="submit"
    >
      {pending ? "Submitting request..." : "Submit for sourcing"}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs font-bold text-rose-700">{errors[0]}</p>;
}

const inputClass =
  "rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15";

export function ProcurementRequestForm() {
  const [state, formAction] = useActionState(createProcurementRequest, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-5" encType="multipart/form-data">
      {state.message ? (
        <div
          className={`rounded-lg p-4 text-sm font-semibold ${
            state.ok ? "bg-emerald-50 text-market-green" : "bg-rose-50 text-rose-700"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Customer name</span>
          <input className={inputClass} name="customerName" placeholder="Aisha Mohammed" />
          <FieldError errors={state.fieldErrors?.customerName} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Email address</span>
          <input className={inputClass} name="customerEmail" placeholder="buyer@example.com" type="email" />
          <FieldError errors={state.fieldErrors?.customerEmail} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Phone number</span>
          <input className={inputClass} name="customerPhone" placeholder="+234 805 000 0000" />
          <FieldError errors={state.fieldErrors?.customerPhone} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Business name</span>
          <input className={inputClass} name="organizationName" placeholder="Aminu Retail Stores" />
          <FieldError errors={state.fieldErrors?.organizationName} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Product name</span>
          <input className={inputClass} name="title" placeholder="Eg. groundnut oil cartons" />
          <FieldError errors={state.fieldErrors?.title} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Quantity</span>
          <input className={inputClass} name="quantity" placeholder="Eg. 250 cartons" />
          <FieldError errors={state.fieldErrors?.quantity} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Target market</span>
          <select className={inputClass} name="targetMarket" defaultValue="Lafia Main Market">
            {marketNodes.map((market) => (
              <option key={market.name}>{market.name}</option>
            ))}
          </select>
          <FieldError errors={state.fieldErrors?.targetMarket} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Budget range</span>
          <input className={inputClass} name="budgetRange" placeholder="NGN 4m - 6m" />
          <FieldError errors={state.fieldErrors?.budgetRange} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Delivery state</span>
          <input className={inputClass} name="deliveryState" placeholder="Kano" />
          <FieldError errors={state.fieldErrors?.deliveryState} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Delivery LGA</span>
          <input className={inputClass} name="deliveryLga" placeholder="Kano Municipal" />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-zinc-700">Delivery address</span>
        <textarea
          className="min-h-24 rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
          name="deliveryAddress"
          placeholder="Full destination address, LGA, state, and delivery contact"
        />
        <FieldError errors={state.fieldErrors?.deliveryAddress} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-zinc-700">Procurement details</span>
        <textarea
          className="min-h-32 rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
          name="details"
          placeholder="Grade, quality expectations, packaging, acceptable substitutions, delivery timeline"
        />
        <FieldError errors={state.fieldErrors?.details} />
      </label>

      <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition hover:border-market-green hover:bg-emerald-50">
        <ImageUp className="h-8 w-8 text-market-green" aria-hidden="true" />
        <span className="mt-3 text-sm font-black text-ink">Upload product reference images</span>
        <span className="mt-1 text-xs font-semibold text-zinc-500">JPG, PNG, WebP up to 12MB each</span>
        <input className="sr-only" name="referenceImages" type="file" multiple accept="image/*" />
      </label>

      <SubmitButton />
    </form>
  );
}
