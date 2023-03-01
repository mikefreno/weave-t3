import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function userCheck(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const emailCheck = await prisma?.user.findFirst({
    where: {
      email: req.query.email as string,
    },
  });
  if (emailCheck === null || emailCheck === undefined) {
    res.status(204).json({ message: "not found" });
  } else if (emailCheck) {
    res.status(200).json({ message: "found" });
  }
}
