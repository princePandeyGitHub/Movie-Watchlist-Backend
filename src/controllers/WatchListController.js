import { prisma } from "../config/db.js";

const addToWatchList = async (req,res) => {
    const { movieId, userId, status, rating, notes} = req.body;

    // Verify movie exists in movie table
    const movieExists = await prisma.movie.findUnique({
        where: {id: movieId}
    });
    if(!movieExists){
        return res.status(404).json({error: "movie not found"});
    }; 

    // check is movie already exist in watchlist
    const movieExistsInWatchList = await prisma.watchListItem.findUnique({
        where: {
            userId_movieId: {
                userId: userId,
                movieId: movieId
            }
        }
    });
    if(movieExistsInWatchList){
        return res.status(400).json({error: "movie already exists in watchlist"});
    };

    // Create movie after checks
    const watchListItem = await prisma.watchListItem.create({
        data: {
            userId,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        }
    });

    res.status(201).json({
        status: "success",
        data: {
            watchListItem,
        }
    })
}

export {addToWatchList}