import prisma from "@/Features/api/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function chacklogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method is allowed" });
  }

  const { login } = req.query;

  if (!login || typeof login !== "string") {
    return res.status(400).json({ message: "login is required" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { login } });
  } catch (error) {
    console.error("Username check error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
