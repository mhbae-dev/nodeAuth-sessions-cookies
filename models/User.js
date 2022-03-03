import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    reqired: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
})

const UserSchema = mongoose.model("User", userSchema)

export default UserSchema;