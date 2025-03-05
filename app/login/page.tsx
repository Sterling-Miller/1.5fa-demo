"use client";
import Link from "next/link";
import { Form } from "app/form";
import { SubmitButton } from "app/submit-button";
import QRGenerator from "@/app/login/qrGenerator";
import { useEffect, useState } from "react";
import { handleSignIn } from "./serverActions";

export default function Login() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/generatetoken", {
          method: "POST",
        });
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    fetchToken();
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-xl flex">
        <div className="flex flex-col items-center justify-center space-y-3 border-r border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16 w-2/3">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
          <Form action={handleSignIn}>
            <SubmitButton>Sign in</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="font-semibold text-gray-800">
                Sign up
              </Link>
              {" for free."}
            </p>
          </Form>
        </div>
        <div className="flex items-center justify-center w-1/3 bg-gray-100">
          {token ? <QRGenerator token={token} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}
