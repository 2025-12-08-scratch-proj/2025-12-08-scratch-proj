import express from "express";
import path from "path";
// import fileController from "../controllers/fileController.ts";
import swapiController from "../controllers/swapiController.ts";
import userController from "../controllers/userController.ts";

import cookieController from "../controllers/cookieController.ts";
import sessionController from "../controllers/sessionController.ts";

const apiRouter = express.Router(); // creates a mini Express app for routing

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
//GET req
// if req path matches '/api/' 
// 

// ADD GET ROUTE HANDLER HERE - make sure to change endpoint URL
apiRouter.get(
  "/",
  swapiController.getAllAnime,
  (_req, res) => {
    return res.status(200).json({ getAnime: res.locals.getAnime });
  }
);

// http://localhost:3000/api/genre
apiRouter.get(
  "/genre",
  swapiController.getByGenre, userController.updateUser, 
  (req, res) => {
    return res.status(200).json({ animeGenre: res.locals.animeGenre });
  }
);

// EXPORT THE ROUTER
export default apiRouter;
