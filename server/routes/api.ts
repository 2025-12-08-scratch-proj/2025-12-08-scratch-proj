import express from "express";
import path from "path";
// import fileController from "../controllers/fileController.ts";
import swapiController from "../controllers/swapiController.ts";
// import characterController from "../controllers/characterController.ts";

const apiRouter = express.Router(); // creates a mini Express app for routing

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
//GET req
// if req path matches '/api/' (relative to router), then Middleware 1: getCharacters function - this gets data and stores data to res.locals.characters (see fileController.getCharacters function)
// apiRouter.get("/", fileController.getCharacters, (_, res) => {
  // Middleware 2: sends JSON response with obj: data from characters property (stored on res.locals obj)
//   return res.status(200).json({ characters: res.locals.characters });
// });

// ADD GET MORE CHARACTERS ROUTE HANDLER HERE - make sure to change endpoint URL
apiRouter.get(
  "/more-characters",
  swapiController.getMoreChar,
//   characterController.populateCharPhotos,
  (_, res) => {
    // Middleware 2: sends JSON response with obj: data from characters property (stored on res.locals obj)
    return res.status(200).json({ moreCharacters: res.locals.moreCharacters });
  }
);

// EXPORT THE ROUTER
export default apiRouter;
