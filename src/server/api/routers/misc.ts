import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const miscRouter = createTRPCRouter({
  returnS3Token: protectedProcedure
    .input(
      z.object({
        category: z.string(),
        id: z.string(),
        type: z.string(),
        ext: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const client = new S3Client({
        region: process.env.AWS_REGION,
      });
      const Key = `${input.category}/${input.id}/${input.type}.${input.ext}`;
      const s3params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key,
        ContentType: `image/${input.ext}`,
      };
      const command = new PutObjectCommand(s3params);
      const signedUrl = await getSignedUrl(client, command, { expiresIn: 120 });
      return { uploadURL: signedUrl, key: Key };
    }),
  sendContactRequest: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), message: z.string() })
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.SENDINBLUE_KEY as string;
      const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

      const sendinblueData = {
        sender: {
          name: "Weave",
          email: "michael@freno.me",
        },
        to: [
          {
            email: "michael@freno.me",
          },
        ],
        htmlContent: `<html><head></head><body><div>Request Name: ${input.name}</div><div>Request Email: ${input.email}</div><div>Request Message: ${input.message}</div></body></html>`,
        subject: `Weave Contact Request`,
      };
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(sendinblueData),
      });
      return res.status;
    }),
});
