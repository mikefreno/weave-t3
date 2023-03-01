import type { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SUPER_SECRET_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});
// const userId = useSession().data?.user?.id;

export default async function s3Upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const Key = `${req.query.category}/${req.query.id}/${req.query.type}.${req.query.ext}`;
  const s3params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key,
    Expires: 120,
    ContentType: `image/${req.query.ext}`,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3params);

  res.status(200).json({
    uploadURL,
    key: Key,
  });
}
