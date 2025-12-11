import express from "express";
import path from "path";

import userController from "../controllers/userController.ts";
import cookieController from "../controllers/cookieController.ts";
import sessionController from "../controllers/sessionController.ts";
import swapiController from "../controllers/swapiController.ts";

const oauthRouter = express.Router();
// PATH VARIABLES (accessing React frontend)
// REACT path
const clientPath = path.resolve(import.meta.dirname, "../../client/");

// user signup without authentication
// http://localhost:3000/oauth/signup
oauthRouter.get("/signup", (_, res) => {
  return res.status(200).sendFile(path.join(clientPath, "signup.html"));
});

oauthRouter.post(
  "/signup",
  userController.createUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    console.log("user on signup page ", res.locals.username, res.locals.userId);
    console.log("cookies, if exists: ", req.cookies); // // TEST ssid COOKIES HERE
    return res.redirect("/"); // could show user preferences / favs / should just retrieve from DB NOT require another fetch call from external API
    // res.redirect('/'); // or if no time, just redirect to landing page
  }
);

/**
 * login - do we need login.html?
 * http://localhost:3000/oauth/login
 */
oauthRouter.post(
  "/login",
  userController.verifyUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    // do NOT test for req.cookies here since will still have previous logged in user's cookies, NOT yet coookies for current user
    console.log("POST oauthRouter user on login page", res.locals.username, res.locals.userId);
    return res.redirect("/");
  }
);

// authorized routes (without authentication yet)
// * http://localhost:3000/oauth/secret
oauthRouter.get("/secret", sessionController.isLoggedIn, swapiController.getAllAnime, (req, res) => {
  console.log("user at secret page");
  console.log("req.cookies, userId, username ", req.cookies, res.locals.userId, res.locals.username); // TEST ssid COOKIES HERE to make sure matches userId
  // return res.status(200).sendFile(path.join(clientPath, "secret.html"));
  return res.redirect("http://localhost:3000/") // use FULL URL to return to landing page index.html
});





export default oauthRouter;

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
