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
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key,
        Expires: 120,
        ContentType: `image/${input.ext}`,
      };
      const uploadURL = await s3.getSignedUrlPromise("putObject", s3params);
      return { uploadURL, key: Key };
    }),
});
