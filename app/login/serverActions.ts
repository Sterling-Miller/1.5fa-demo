"use server";
import { signIn } from "app/auth";

export async function handleSignIn(formData: FormData) {
  await signIn("credentials", {
    redirectTo: "/protected",
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
}
