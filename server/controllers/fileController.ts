import fs from 'fs/promises';
import path from 'path';
import { Request, Response, NextFunction } from "express";
import { AnimeData, ErrorInfo } from '../types.ts'

// global error handler
const createErr  = (errInfo: ErrorInfo) => {
  const { method, type, err } = errInfo; // destructure props from errInfo (from input parameter)
  return {
    log: `fileController.${method} ${type}: ERROR: ${typeof err === "object" ? JSON.stringify(err) : err}`, // if err is JS object type, then convert to JSON string, otherwise just return err
    message: {
      err: `Error occurred in fileController.${method}. Check server logs for more details.`,
    },
  };
};


// saveFavorites 
// mongoose.findOne -> const { id, favorites } = req.body 
// comes from request from user input on frontend
// will check isLoggedIn
// will check user _id === req.cookies.ssid


// if both true, then push certain destructured props from res.locals.animeGenre to favorites array

// export default {

// saveFavorites: async (req: Request, res: Response, next: NextFunction) => {
//     try{
//         if (!res.locals.animeGenre && !res.locals.updates) {

//         }

//     } catch (err) {
//  next(createErr({
//         method: "",
//         type: " ",
//         err,
//       }));
//     }
//   },       


// }


