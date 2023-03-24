import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import S3 from "aws-sdk/clients/s3";

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
      const s3 = new S3({
        apiVersion: "2006-03-01",
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SUPER_SECRET_KEY,
        region: process.env.AWS_REGION,
        signatureVersion: "v4",
      });
      const Key = `${input.category}/${input.id}/${input.type}.${input.ext}`;
      const s3params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key,
        Expires: 120,
        ContentType: `image/${input.ext}`,
      };
      const uploadURL = await s3.getSignedUrlPromise("putObject", s3params);
      return { uploadURL, key: Key };
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
