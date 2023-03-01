import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function joinServer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session == null) {
    res.status(401).redirect("/login");
  } else {
    const token = req.query.token as string;
    if (token == null) {
      res.status(401).redirect("/");
    }
    const key = process.env.JWT_SECRET as string;
    console.log("token: " + token);
    console.log("key: " + key);
    jwt.verify(token, key, async function (err, decoded) {
      console.log("payload: " + decoded);
      if (err) {
        return res.status(401).json({ error: err.message });
      } else if (typeof decoded === "string") {
        return res.status(401).json({ error: "unknown error" });
      } else {
        const userId = session?.user?.id;
        const serverID = decoded?.data.server;
        const inviter = decoded?.data.inviter;
        await prisma.server_Member.create({
          data: {
            member: {
              connect: { id: userId },
            },
            Server: {
              connect: { id: serverID },
            },
            invitedBy: inviter,
          },
        });
        return res.status(202).redirect("/app");
      }
    });
  }
}
