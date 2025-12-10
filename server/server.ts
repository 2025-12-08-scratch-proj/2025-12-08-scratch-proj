import path from "path";
// import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from "express";
import apiRouter from "./routes/api";
// import favRouter from "./routes/favs";

import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import userController from './controllers/userController.ts';
// import cookieController from './controllers/cookieController.ts';
// import sessionController from './controllers/sessionController.ts';

dotenv.config(); // process.env

const PORT = 3000;


// make sure to initialize express
// This calls the imported express() function, creating a new Express application object and storing it in the app variable. This app object is what you use to define routes, middleware, and start the server.
const app = express();

// create a .env file at root (top-level), not nested inside any folder
// set up mongoDB under your organization, create a project, and under project,deploy a cluster (default name: Cluster 0)
// add teammates as database admin under Database & Network Access (need to expand left-side menu)
// give each teammate username and password URI
// put MONGO_URI=<uri connection string> inside .env file
const mongoURI : any = process.env.MONGO_URI;

// mongoose.connect(mongoURI);
mongoose.connect(mongoURI, {
  // sets the name of the DB that our collections are part of
  dbName: 'animeUsers'
})
  .then(() => console.log('Connected to Mongo DB.')) // check to verify connected to DB in .then clause
  .catch(err => console.log(err));


// add parsing middleware
app.use(express.json()); // parsing json
app.use(express.urlencoded({ extended: true })); // for parsing forms 
app.use(cookieParser()); // parsing cookies for authentication


// PATH VARIABLES (accessing React frontend)
// REACT path
const clientPath = path.resolve(import.meta.dirname, "../client");

// serving REACT frontend files (HTML, CSS, JS, also images)
app.use("/", express.static(clientPath));

// set up routes, from most specific to least specific
// app.use("/api/genre", apiRouter);

//  Use api router for routes starting with /api
app.use("/api", apiRouter);
//http://localhost:3000/api
// inside of api.ts file, "/" is same as "http://localhost:3000/api"

// ROUTE HANDLER TO SERVE REACT APP
// This catches ALL other routes and serves index.html
app.get("/", (_, res) => {
  return res.status(200).sendFile(path.join(clientPath, "index.html"));
});



// user signup without authentication
app.get('/signup', (_, res) => {
  return res.status(200).sendFile(path.join(clientPath, "signup.html"));
});

app.post('/signup', userController.createUser, (req, res) => {
  console.log(req.cookies);  
  res.redirect('/secret'); // could show user preferences / favs / should just retrieve from DB NOT require another fetch call from external API
  // res.redirect('/'); // or if no time, just redirect to landing page
});

/**
* login - do we need login.html?
*/
app.post('/login', userController.verifyUser, (req, res) => {
  console.log('POST login req.cookies ', req.cookies);
  res.redirect('/secret');
});


// authorized routes (without authentication yet)
app.get('/secret', (req, res) => {
  return res.status(200).sendFile(path.join(clientPath, "secret.html"));
});


/**
* signup
*/
// app.get('/signup', (_, res) => {
//   return res.status(200).sendFile(path.join(clientPath, "signup.html"));
// });

// app.post('/signup', userController.createUser , cookieController.setSSIDCookie, sessionController.startSession, (req, res) => {
//   console.log(req.cookies);  
//   res.redirect('/secret');
// });

// /**
// * login
// */
// app.post('/login', userController.verifyUser, cookieController.setSSIDCookie, sessionController.startSession, (req, res) => {
//   // what should happen here on successful log in?
//   console.log('POST login req.cookies ', req.cookies);
//  // return res.status(200).json(res.locals.verifyUser)  
//   res.redirect('/secret');
// });


/**
* Authorized routes
*/

// Add this route to test cookies
// app.get('/check-cookies', (req, res) => {
//   console.log('Cookies received:', req.cookies);
//   res.json({ 
//     cookies: req.cookies,
//     headers: req.headers.cookie
//   });
// });

// app.get('/secret', sessionController.isLoggedIn, (req, res) => {
//   return res.status(200).sendFile(path.join(clientPath, "secret.html"));
// });

// app.get('/secret/users', sessionController.isLoggedIn, userController.getAllUsers, (req, res) => {
//   res.send( { users: res.locals.users });
// })


// // cookie for all requests here?
// app.use('/', cookieController.setCookie, (req, res) => {
//   console.log(req.cookies);  // should show cookie headers
//   res.send('set a new cookie!');
// })







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
