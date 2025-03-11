"use server";
import { signIn } from "app/auth";
import { getTokenData } from "app/db";

export async function handleSignIn(formData: FormData) {
  await signIn("credentials", {
    redirect: false,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
}

export async function handleSignInWithToken(token: string) {
  const tokenDataArray = await getTokenData(token);
  const tokenData = tokenDataArray[0];

  if (!tokenData || tokenData.used || !tokenData.expiresat || tokenData.expiresat < new Date()) {
    throw new Error("Invalid or expired token");
  }

  await signIn("qr-token", {
    redirectTo: "/protected",
    ephemeralToken: token,
  });
}
