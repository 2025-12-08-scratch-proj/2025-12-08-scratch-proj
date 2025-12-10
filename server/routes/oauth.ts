import express from "express";
import path from "path";

import userController from '../controllers/userController.ts';
// import cookieController from '../controllers/cookieController.ts';
// import sessionController from '../controllers/sessionController.ts';

const oauthRouter = express.Router();
// PATH VARIABLES (accessing React frontend)
// REACT path
const clientPath = path.resolve(import.meta.dirname, "../../client/");

// user signup without authentication
// http://localhost:3000/oauth/signup
oauthRouter.get('/signup', (_, res) => {
  return res.status(200).sendFile(path.join(clientPath, "signup.html"));
});

oauthRouter.post('/signup', userController.createUser, (req, res) => {
//   console.log(req.cookies);  
  console.log('user on signup page')
  return res.redirect('/secret'); // could show user preferences / favs / should just retrieve from DB NOT require another fetch call from external API
  // res.redirect('/'); // or if no time, just redirect to landing page
});

/**
* login - do we need login.html? 
* http://localhost:3000/oauth/login
*/
oauthRouter.post('/login', userController.verifyUser, (req, res) => {
//   console.log('POST login req.cookies ', req.cookies);
console.log('user on login page')
  return res.redirect('/secret');
});


// authorized routes (without authentication yet)
// * http://localhost:3000/oauth/secret
oauthRouter.get('/secret',  (req, res) => {
    console.log('user at secret page');
  return res.status(200).sendFile(path.join(clientPath, "secret.html"));
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

