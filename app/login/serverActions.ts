"use server";
import { signIn } from "next-auth/react";

export async function handleSignIn(formData: FormData) {
  await signIn("credentials", {
    redirect: false,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
}
