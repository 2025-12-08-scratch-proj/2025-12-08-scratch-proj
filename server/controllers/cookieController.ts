import { CookieController } from "../types";

const cookieController: CookieController = {
 
  /**
   * setSSIDCookie - store the user id in a cookie ssid
   */
  setSSIDCookie: (req, res, next) => {
    console.log('setSSIDCookie is running')
    try {
    const { userId } = res.locals;
      if (!userId) {
        return next(new Error ('no userId for SSID cookie'))
      }
      console.log('cookieSSID userId ', userId)
      res.cookie("ssid", userId, {
        httpOnly: true,
        // secure: true, // ONLY work with HTTPS, NOT localhost so don't use here
        maxAge: 1000 * 60 * 60 * 24,
      })
      console.log('setSSIDCookie req.cookies ', req.cookies) // req.cookies NOT yet available since cookies are set in response headers
      return next();
    } catch (err) {
      return next(err);
    }
  },

};



export default cookieController;