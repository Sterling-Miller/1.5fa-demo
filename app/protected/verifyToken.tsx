"use client";
import { getSession } from "next-auth/react";

export default async function verifyToken(inputToken: string) {
  try {
    const res = await fetch("/api/verifytoken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inputToken }),
    });
    const data = await res.json();

    if (data.success) {
      const session = await getSession();
      const useremail = session?.user?.email;
      console.log("useremail passed to activate token: ", useremail);
      const res = await fetch("/api/activatetoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inputToken, useremail: useremail }),
      });
      const data = await res.json();
      console.log("activate token response: ", data);
    }
    
  } catch (error) {
    console.error("Error verifying token:", error);
  }
}
