import { NextApiRequest, NextApiResponse } from "next";
import { updateTokenStatus } from "@/app/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { token, status } = req.body;

    if (!token || !status) {
      return res.status(400).json({ error: "Token and status are required" });
    }

    try {
      await updateTokenStatus(token, status);
      return res
        .status(200)
        .json({ message: "Token status updated successfully" });
    } catch (error) {
      console.error("Error updating token status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
