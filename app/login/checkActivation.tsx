// This component has a button that when pressed, checkes the server to see if a token (passed in props from parent) is activated yet

import { useState } from "react";
import { useEffect } from "react";
import { isTokenActivated } from "../db";

export default function CheckActivation({ token }: { token: string }) {
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
            } catch (error) {
                console.error("Error checking token activation:", error);
            } finally {
                setLoading(false);
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

        checkToken();
        startChecking();

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {activated ? "Token is activated!" : "Token is not activated yet."}
        </div>
    );
}