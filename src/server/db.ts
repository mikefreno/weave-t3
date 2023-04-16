import { PrismaClient } from "@prisma/client";
import { env } from "../env/server.mjs";
import { PrismaClient as PrismaClient2 } from "@prisma/client/mongo";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  var prismaMongo: PrismaClient2 | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export const prismaMongo =
  global.prismaMongo ||
  new PrismaClient2({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
