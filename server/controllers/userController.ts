import { Request, Response, NextFunction } from "express";
import User from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { UserController } from "../types.ts";

const userController: UserController = {
  getAllUsers: (req: Request, res: Response, next: NextFunction) => {
    User.find({}, (err, users) => {
      if (err)
        return next(
          "Error in userController.getAllUsers: " + JSON.stringify(err)
        );
      res.locals.users = users;
      return next();
    });
  },

  /* createUser - create and save new User in db. */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    try {
      // OPTION 1: using create() method
      // Mongoose middleware under the hood will automatically run .pre method (see userModel.ts) before saving. No need to create new instance, then save as 2 separate steps
      const newUser = await User.create({
        username: username,
        password: password,
      });

      // OPTION 2: using new keyword to create new User instance, then save(). Same as Option 1, except 2 separate steps

      // const newUser = new User({
      //   username: username,
      //   password: password,
      // });

      // await newUser.save();

      // store user ID
      res.locals.userId = newUser._id;
      res.locals.username = newUser.username;

      console.log("new user created with _id: ", newUser._id);

      return next();
    } catch (err) {
      return next(err);
    }
  },

  /* verifyUser - Obtain username and pw from req body, locate appropriate user in db, authenticate submitted pw against pw stored in db. */
  verifyUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      // no need to check if already existing user since userSchema already requires unique
      const userExist = await User.findOne({ username });

      if (!userExist) {
        return res.redirect("/signup");
      }

      console.log("user exists");

      // Compare passwords properly
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        console.log("bad password");
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

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies) return next();

    const ssid = req.cookies.ssid;

    if (!ssid) return next();

    try {
      // check if already existing user, IF the userSchema didn't already require unique
      console.log("checking for userId that matches ssid: ", ssid);

      const userExist = await User.findById(ssid);

      if (!userExist) {
        console.log("User not found with ssid: ", ssid);
        // since this is middleware that might run on many routes
        // clear invalid cookie
        console.log("clearing invalid cookie ssid");
        res.clearCookie("ssid");
        return next(); // or return next('User not found');
      }

      console.log("User found:", userExist.username, userExist._id);

      // const { favorites } = userExist;

      // const { title, ranking, genres, image, synopsis } = 



      return next();
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
