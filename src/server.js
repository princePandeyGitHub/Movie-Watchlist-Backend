import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB, prisma } from './config/db.js';

//importing routes
import MovieRouter from './routes/MovieRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import WatchListRoute from './routes/WatchListRoute.js';

config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//applying routes
app.use('/movie',MovieRouter);
app.use('/auth',AuthRoute);
app.use('/watchlist',WatchListRoute);


const PORT = 5001;
const server = app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err)=>{
    console.log("Unhandled Rejection : ", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    })
})

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.log("Uncaught Exception : ", err);
    await disconnectDB();
    process.exit(1);
})

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    })
})

//different routes
//auth - login/register
//movie - getting all movies
//user - profile
//watchList