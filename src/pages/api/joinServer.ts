import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function joinServer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session == null) {
    res.redirect(401, "/login");
  } else {
    const token = req.query.token as string;
    const key = process.env.JWT_SECRET as string;
    jwt.verify(token, key, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: err.message });
      } else {
        const userId = session.user.id;
        const serverID = decoded.data.server;
        const inviter = decoded.data.inviter;
        const serverMember = await prisma?.server_Member.create({
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
        return res.redirect(202, `/app`);
      }
    });
  }
}
