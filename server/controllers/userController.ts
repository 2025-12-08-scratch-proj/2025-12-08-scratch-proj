import User from "../models/userModel.ts";
import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";

interface UserController {
  getAllUsers: RequestHandler;
  createUser: RequestHandler;
  verifyUser: RequestHandler;
}

const userController: UserController = {
  getAllUsers: (req, res, next) => {
    User.find({}, (err, users) => {
      if (err)
        return next(
          "Error in userController.getAllUsers: " + JSON.stringify(err)
        );
      res.locals.users = users;
      return next();
    });
  },

  /* createUser - create and save a new User into the database. */
  createUser: async (req, res, next) => {
    const { username, password } = req.body;

  // alternative method:
  // User.create() -> Mongoose middleware under the hood will automatically run .pre method before saving even with .create()

    try {
      const newUser = new User({
        username: username,
        // password: hashPwd
        password: password,
      });

      await newUser.save();

      // store user ID for setSSIDCookie to use
      res.locals.userId = newUser._id;
      res.locals.username = newUser.username;

      console.log("new user created: ", newUser.username);

      return next();
    } catch (err) {
      return next(err);
    }
  },

  /**
   * verifyUser - Obtain username and password from the request body, locate
   * the appropriate user in the database, and then authenticate the submitted password
   * against the password stored in the database.
   */
  verifyUser: async (req, res, next) => {
    const { username, password } = req.body;
    try {
      // check if already existing user, IF the userSchema didn't already require unique
      const userExist = await User.findOne({ username });

      if (!userExist) {
        return res.redirect("/signup");
      }

      console.log("user exists");

      // Compare passwords properly
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        return res.redirect("/signup");
      }

      res.locals.userId = userExist._id;
      res.locals.username = userExist.username;
      console.log("verifyUser userId ", userExist._id);

      return next();
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
