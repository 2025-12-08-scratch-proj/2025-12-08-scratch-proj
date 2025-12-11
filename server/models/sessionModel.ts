import mongoose from "mongoose";
const Schema = mongoose.Schema;

// cookie id = session id
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: 600, default: Date.now },
});

export default mongoose.model("Session", sessionSchema);
