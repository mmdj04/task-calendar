import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl?.startsWith("postgresql") || databaseUrl?.startsWith("postgres")) {
    try {
      const { PrismaPg } = require("@prisma/adapter-pg");
      const adapter = new PrismaPg({ connectionString: databaseUrl });
      return new PrismaClient({ adapter });
    } catch {
      return new PrismaClient();
    }
  }

  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
