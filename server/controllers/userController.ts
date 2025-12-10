import User from "../models/userModel.ts";
// import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { UserController } from "../types.ts";

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

    // OPTION 1: User.create() -> Mongoose middleware under the hood will automatically run .pre method before saving even with .create(). No need to do create in 2 separate steps of creating new User instance, then .save() method later
    // OPTION 2: does same thing as Option 1, except 2 separate steps of creating new User instance, then .save() method later

    try {
      // OPTION 1: using create() method
      const newUser = await User.create({
        username: username,
        password: password,
      });

      res.locals.userId = newUser._id;
      res.locals.username = newUser.username;

      console.log("new user created with _id: ", newUser._id);

      // OPTION 2: using new keyword to create new instance of User, then save() separately

      // const newUser = new User({
      //   username: username,
      //   // password: hashPwd
      //   password: password,
      // });

      // await newUser.save();

      // store user ID for setSSIDCookie to use
      // res.locals.userId = newUser._id;
      // res.locals.username = newUser.username;

      // console.log("new user created: ", newUser.username);

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
        console.log('bad password')
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


//   updateUser: async (req: Request, res: Response, next: NextFunction) => {

//     if (!req.cookies) return next();

//     const { ssid } = req.cookies;

//     try {
//       // check if already existing user, IF the userSchema didn't already require unique
//       console.log(ssid);


//       const userExist = await User.findById({ ssid });

//       if (!userExist) {
//         return res.redirect("/signup");
//       }

//       console.log("user found");


//       return next();

//     } catch (err) {
//       return next(err);
//     }


// },

}

export default userController;
