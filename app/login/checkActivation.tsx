// This component has a button that when pressed, checkes the server to see if a token (passed in props from parent) is activated yet

import { useState, useEffect } from "react";
import { isTokenActivated, getEmailFromToken } from "../db";

export default function CheckActivation({
  token,
  onTokenActivated,
}: {
  token: string;
  onTokenActivated: () => void;
}) {
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let intervalId: number;
    let timeoutId: number;

    async function checkToken() {
      try {
        const result = await isTokenActivated(token);
        setActivated(result ?? false);
        if (result) {
          onTokenActivated(); // Notify parent component
        }
      } catch (error) {
        console.error("Error checking token activation:", error);
      } finally {
        setLoading(false);
      }
    }

    // Jank but way easier than websockets
    // TODO: Improve error checking + handling (ie. stop checking after valid)
    // TODO: Make this start login process if token is activated
    function startChecking() {
      intervalId = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 5);
        checkToken();
      }, 5000);

      timeoutId = window.setTimeout(() => {
        clearInterval(intervalId);
      }, 120000);
    }

    startChecking();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [token, onTokenActivated]);

  return null;
}
