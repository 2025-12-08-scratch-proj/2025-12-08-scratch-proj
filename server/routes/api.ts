import express from "express";
import path from "path";
// import fileController from "../controllers/fileController.ts";
import swapiController from "../controllers/swapiController.ts";
// import characterController from "../controllers/characterController.ts";

const apiRouter = express.Router(); // creates a mini Express app for routing

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
//GET req
// if req path matches '/api/' 

// ADD GET MORE CHARACTERS ROUTE HANDLER HERE - make sure to change endpoint URL
apiRouter.get(
  "/",
  swapiController.getAllAnime,
  (_, res) => {
    return res.status(200).json({ getAnime: res.locals.getAnime });
  }
);



// EXPORT THE ROUTER
export default apiRouter;
