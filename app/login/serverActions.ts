"use server";
import { signIn } from "app/auth";
import { getEmailFromToken } from "../db";

export async function handleSignIn(formData: FormData) {
  await signIn("credentials", {
    redirectTo: "/protected",
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
}

// TODO: Add handleSignIn for qr token
export async function handleSignInWithToken(token: string) {
  await signIn("qr-token", {
    redirectTo: "/protected",
    email: await getEmailFromToken(token),
    ephemeralToken: token,
  });
}