import mongoose from "mongoose";
// import {Schema, Document } from 'mongoose'; // make sure to import Document type from mongoose (unless already imported from line above)? yes
import bcrypt from "bcryptjs";
import { AnimeData } from "../types";

// extend Document type from Mongoose
export interface IUser extends Document {
  username: string;
  password: string;
  favorites: AnimeData[];
}

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

// create AnimeData schema separately, though ended up not really using
const animeDataSchema = new Schema({
  title: { type: String, required: true },
  ranking: { type: Number, required: true },
  genres: [{ type: String }],
  image: { type: String, required: true },
  synopsis: { type: String },
});

// create userSchema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: {
    type: [animeDataSchema], // use the separate schema here
    required: false, // this makes it optional
    default: [], // set up empty array as default - good practice for arrays
  },
});

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // hash password with salt rounds
    const hashPwd = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hashPwd;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("User", userSchema);

// no need to call mongoose.model() meethod on animeDataSchema
// animeDataSchema is a subdocument schema, not a standalone collection
// so it's embedded directly within userSchema via type: [animeDataSchema]
