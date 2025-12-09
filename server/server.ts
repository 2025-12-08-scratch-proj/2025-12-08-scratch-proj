import path from "path";
// import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from "express";

import apiRouter from "./routes/api";
// import charRouter from "./routes/characters";
// import favRouter from "./routes/favs";

// fetch GET request from https://anime-db.p.rapidapi.com/anime 
// universal API key to connect to rapidapi.com's databases of databases: 364d55f1f0msh935e709f926d171p114655jsnd8aa628e1124

const app = express();
const PORT = 3000;


app.use(express.json());


// PATH VARIABLES (accessing React frontend)
// REACT path
const clientPath = path.resolve(import.meta.dirname, "../client");

// serving REACT frontend files (HTML, CSS, JS, also images)
app.use("/", express.static(clientPath));

// set up routes, from most specific to least specific
// app.use("/api/getAnime", apiRouter);

//  Use api router for routes starting with /api
app.use("/api", apiRouter);
//http://localhost:3000/api
// inside of api.ts file, "/" is same as "http://localhost:3000/api"

// ROUTE HANDLER TO SERVE REACT APP
// This catches ALL other routes and serves index.html
app.get("/", (_, res) => {
  return res.status(200).sendFile(path.join(clientPath, "index.html"));
});

// catch-all route handler for any requests to an unknown route
app.use((_, res) => {
  // res.sendStatus(404);
  return res.status(404).send("404: page not found"); // do we need to put return here?
});

type CustomError = {
  log?: string;
  status?: number;
  message?: any;
};

// 4 params for error handler middleware (vs. 3 for regular middleware)
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };

  // Create error obj using defaultErr as base, overwriting w err param
  const errorObj = Object.assign({}, defaultErr, err);
  //                target  ↑      source1 ↑ source2 ↑

  // If err has {log: 'custom', status: 404}, result is:
  // {log: 'custom', status: 404, message: {err: 'An error occurred'} }

  console.log("error logged: ", errorObj.log);

  const { status, message } = errorObj;

  // reply to client w err status / msg (remember to convert json)
  return res.status(status).json(message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
