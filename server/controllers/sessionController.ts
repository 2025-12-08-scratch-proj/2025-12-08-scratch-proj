import { SessionController } from "../types";
import Session from "../models/sessionModel"

const sessionController: SessionController = {
    isLoggedIn: async (req, res, next) => { // Make it async
      console.log('isLoggedIn starting');
      console.log(`sessionController's req.cookies `, req.cookies);
      
      const sessionId = req.cookies.ssid;
      
      if (!sessionId) {
        console.log('No session cookie found');
        return res.redirect('/'); // or to login page
      }
    
      try {
        // verify the session exists in database
        const session = await Session.findOne({ cookieId: sessionId });
        if (!session) {
          console.log('Session not found in database');
          res.clearCookie('ssid'); // clear invalid cookie
          return res.redirect('/');
        }
        
        console.log('User is logged in');
        res.locals.userId = sessionId;
        return next();
      } catch (err) {
        console.error('Error checking session:', err);
        return next(err);
      }
    },    
 
      /*startSession - create and save a new Session into the database. */
      startSession: async (req, res, next) => {
        console.log('sessionController is running')
        try {
        const { userId } = res.locals;
          if (!userId) {
            return next(new Error ('no userId for res.locals cookie'))
          }
          console.log('res.locals userId ', userId)
    
        const newSession = await Session.create( {
          cookieId: userId
         })
         
        console.log('Session created for user:', userId);
          return next();
        } catch (err) {
          return next(err);
        }  
      },
    };
    
    export default sessionController;
    