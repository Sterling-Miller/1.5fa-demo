"use client";
import { useState } from "react";

export default function VerifyToken() {
  const [inputToken, setInputToken] = useState("");
  const [message, setMessage] = useState("");

  const verifyToken = async () => {
    const res = await fetch("/api/verifytoken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inputToken }),
    });
    const data = await res.json();
    setMessage(data.success ? "Token verified!" : "Invalid or used token");
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