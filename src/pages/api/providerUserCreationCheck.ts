import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function providerUserCreationCheck(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await prisma?.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  if (user && user.registered_at !== null) {
    const now = new Date();
    const diff = now.getTime() - user.registered_at.getTime();
    if (diff < 60 * 1000) {
      res.redirect("/account-set-up");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}
