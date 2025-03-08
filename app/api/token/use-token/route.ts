import { NextApiRequest, NextApiResponse } from "next";
import WebSocket from "ws";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { token } = req.body;

    // Notify the login page via WebSocket
    const ws = new WebSocket("ws://localhost:8080");
    ws.on("open", () => {
      ws.send(JSON.stringify({ type: "tokenUsed", token }));
      ws.close();
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      res.status(500).json({ message: "WebSocket error" });
    });

    ws.on("close", () => {
      res.status(200).json({ message: "Token used" });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
