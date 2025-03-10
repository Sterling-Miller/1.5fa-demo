"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function VerifyToken() {
  const [inputToken, setInputToken] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  const verifyToken = async () => {
    try {
      const res = await fetch("/api/verifytoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inputToken }),
      });
      const data = await res.json();
      setMessage(data.success ? "Token verified!" : "Invalid or used token");

      if (data.success) {
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
      setMessage("An error occurred while verifying the token.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter token"
        value={inputToken}
        onChange={(e) => setInputToken(e.target.value)}
      />
      <button onClick={verifyToken}>Verify Token</button>
      {message && <p>{message}</p>}
    </div>
  );
}
