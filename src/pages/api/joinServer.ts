import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function joinServer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session == null) {
    res.status(401).redirect("/login");
  } else {
    const token = req.query.token as string;
    if (token == null) {
      res.status(401).redirect("/");
    }
    const key = process.env.JWT_SECRET as string;
    jwt.verify(token, key, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: err.message });
      } else if (typeof decoded === "string") {
        return res.status(401).json({ error: "unknown error" });
      } else {
        const userEmail = decoded?.data.email;
        if (userEmail !== session?.user?.email) {
          return res.status(401).json({ error: "Invite email mismatch!" });
        }
        const user = await prisma.user.findFirst({
          where: { email: userEmail },
        });
        const serverID = decoded?.data.server;
        console.log("serverID: " + serverID);
        const inviter = decoded?.data.inviter;
        await prisma.server_Member.create({
          data: {
            member: {
              connect: { id: user?.id },
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
