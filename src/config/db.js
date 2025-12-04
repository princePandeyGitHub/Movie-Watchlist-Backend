import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log:
        process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
});




const connectDB = async () => {
    try{
        // run inside an async function
        await prisma.$connect();
        console.log("DB connected via Prisma");
    }
    catch(error){
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();
}

export {prisma, connectDB, disconnectDB };