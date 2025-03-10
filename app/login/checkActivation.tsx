// This component has a button that when pressed, checkes the server to see if a token (passed in props from parent) is activated yet

import { useState, useEffect } from "react";
import { getTokenData } from "../db";

export default function CheckActivation({ token, onTokenActivated }: { token: string; onTokenActivated: () => void; }) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let timeoutId: number;
    let intervalId: number;

    async function checkToken() {
      try {
        const tokenDataArray = await getTokenData(token);
        const tokenData = tokenDataArray[0];

        if (!tokenData || tokenData.used) {
            return console.error("Token not found in database or already used");
        }

        if (tokenData.activated) {
          onTokenActivated(); // Notify parent component
          clearTimeout(intervalId);
          clearTimeout(timeoutId);
          return;
          
        }

      } catch (error) {
        console.error("Error checking token activation:", error);
      }
    }

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
      clearTimeout(intervalId);
      clearTimeout(timeoutId);
    };
  }, [token, onTokenActivated]);

  return null;
}
