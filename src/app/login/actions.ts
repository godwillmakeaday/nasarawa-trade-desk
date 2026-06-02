"use server";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isDatabaseConfigured, logDatabaseError } from "@/lib/database-status";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";

export type LoginActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

// One week. The role cookie is what middleware.ts and resolveActorRole read to
// gate dashboard routes and authorize mutations.
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

async function setSessionCookies(userId: string, role: string) {
  const store = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  };
  store.set("ntd_role", role, options);
  store.set("ntd_user", userId, options);
}

export async function login(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      message:
        "Sign-in is not enabled yet. The operations desk must connect the production database before accounts can authenticate."
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  // Generic failure message regardless of which check fails, so we never reveal
  // whether an email exists.
  const invalid: LoginActionState = {
    ok: false,
    message: "Invalid email or password."
  };

  let role: string;
  let userId: string;
  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, role: true, status: true, passwordHash: true }
    });

    if (!user || user.status !== "ACTIVE") {
      return invalid;
    }

    const passwordOk = await compare(parsed.data.password, user.passwordHash);
    if (!passwordOk) {
      return invalid;
    }

    role = user.role;
    userId = user.id;
  } catch (error) {
    logDatabaseError("login", error);
    return {
      ok: false,
      message: "Unable to sign in right now. Please try again shortly."
    };
  }

  await setSessionCookies(userId, role);

  // Only redirect to internal paths to avoid an open-redirect via ?next=.
  const target =
    parsed.data.next && parsed.data.next.startsWith("/") ? parsed.data.next : "/dashboard";
  // target is a validated internal path; typed-routes can't infer the dynamic string.
  redirect(target as Parameters<typeof redirect>[0]);
}

export async function logout() {
  const store = await cookies();
  store.delete("ntd_role");
  store.delete("ntd_user");
  redirect("/login");
}
