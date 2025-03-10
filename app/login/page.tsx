"use client";
// External Dependecies
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import QRGenerator from "@/app/login/qrGenerator";

// Internal Files
import { handleSignIn, handleSignInWithToken } from "./serverActions";
import CheckActivation from "./checkActivation";
import getBrowserInfo from "./getBrowserInfo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    console.log("Login attempt for:", email);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      console.log("Login successful! Opening 2FA popup...");
      setIsPopupOpen(true); // Show 2FA popup

      await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } else {
      console.log("Login failed");
      setMessage("Invalid email or password.");
    }
  }

  async function verifyCode() {
    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
  
    const data = await res.json();
    if (res.ok) {
      // Once the code is verified, manually sign in the user
      const loginRes = await signIn("credentials", {
        redirect: false, // Don't auto-redirect, handle it manually
        email: email,
        password: password, // You might want to handle this more securely, depending on how you're storing the password
      });
  
      // After successful sign in, redirect to /protected
      if (loginRes?.ok) {
        router.push("/protected"); // Redirect to protected page
      } else {
        setMessage("Failed to log in after verification.");
      }
    } else {
      setMessage(data.error || "Invalid verification code.");
      setCode("");
    }
  }

  useEffect(() => {
    async function fetchToken() {
      try {
        const { browser, os } = await getBrowserInfo();
        const response = await fetch("/api/generatetoken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ browser, os }),
        });
        const data = await response.json();
        setToken(data.token);
        console.log("Token:", data.token); // TODO: Cleanup
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    fetchToken();
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 relative">
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-xl flex relative">
      {/* Standalone Floating Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg w-96 text-center z-50">
              <h2 className="text-lg font-semibold mb-2">Enter Verification Code</h2>
              <p className="text-sm text-gray-600 mb-4">A verification code was sent to your email.</p>
              <input
                type="text"
                placeholder="Enter code"
                className="border p-2 rounded w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              {/* Display the error message inside the popup */}
              {message && <p className="text-red-500 mt-2">{message}</p>} 
              <div className="mt-4 flex justify-between">
                <button onClick={verifyCode} className="border p-2 rounded w-1/2 mr-2">Verify</button>
                <button onClick={() => setIsPopupOpen(false)} className="border p-2 rounded w-1/2">Cancel</button>
              </div>
            </div>
          </div>
        )}


        <div className="flex flex-col items-center justify-center space-y-3 border-r border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16 w-2/3">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">Use your email and password to sign in</p>

          <form onSubmit={handleLogin} className="w-full flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="border p-2 rounded w-full">Sign In</button>
          </form>

          {message && <p className="text-red-500 mt-2">{message}</p>}

          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">Sign up</Link>
            {" for free."}
          </p>
        </div>

       
        <div className="flex items-center justify-center w-1/3 bg-gray-100">
          {token ? <QRGenerator token={token} /> : <p>Loading...</p>}
          {token && ( <CheckActivation token={token} onTokenActivated={async () => { await handleSignInWithToken(token); }} /> )}
        </div>
      </div>
    </div>
  );
}
