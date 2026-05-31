"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

// Segment error boundary for the dashboard workspaces. Server Actions here
// (status transitions, dispute escalation) throw on a rejected guard —
// disallowed role, missing evidence, invalid input. Without a boundary that
// throw replaces the whole app with the global error page; this keeps the
// failure inline and offers a retry. In production Next redacts the thrown
// message to a digest, so we show a generic line plus the digest for support.
export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid place-items-center px-4 py-16">
      <div className="max-w-md rounded-lg border border-rose-100 bg-white p-6 text-center shadow-line">
        <AlertTriangle className="mx-auto h-8 w-8 text-market-clay" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-black text-ink">That action could not be completed</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {error.message || "Something went wrong while processing your request."}
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs font-bold text-zinc-400">Reference: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-xs font-black text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
