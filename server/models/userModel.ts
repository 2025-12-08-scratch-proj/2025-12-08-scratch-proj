import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  favorites: {type: String, required: false}
});


userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash the password with salt rounds
    const hashPwd = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hashPwd;
    next();
  } catch (err) {
    next(err);
  }
});


export default mongoose.model('User', userSchema);
