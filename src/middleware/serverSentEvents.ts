import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const useServerSentEventsMiddleware: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Accel-Buffering", "no");

  const channelID = parseInt(req.query.id as string, 10);

  setInterval(async () => {
    const commentData = await prisma?.comment.findMany({
      where: { channelID: channelID },
    });
    res.write(`data : ${commentData}`);
  }, 2000);
};

export default useServerSentEventsMiddleware;
