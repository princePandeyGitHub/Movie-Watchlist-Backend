import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Create pool lazily so DATABASE_URL is already loaded
let prismaInstance;

function initPrisma() {
  if (!prismaInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prismaInstance;
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    return initPrisma()[prop];
  }
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected via Prisma 7");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
