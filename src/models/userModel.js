import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import createError from "http-errors";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isChairman: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// static signup method
UserSchema.statics.signup = async function (
  username,
  password,
  isAdmin,
  isChairman
) {
  if (!username || !password) {
    throw createError(400, "username & password is required");
  }

  const trimmedUserName = username.toLowerCase().replace(/\s/g, "");

  if (trimmedUserName.length < 3) {
    throw createError(400, "username must be at least 3 characters long");
  }

  if (typeof trimmedUserName !== "string") {
    throw createError(400, "username must be a string");
  }

  if (trimmedUserName.length < 3) {
    throw createError(400, "username must be at least 3 characters long");
  }

  if (/^\d/.test(trimmedUserName)) {
    throw createError(400, "username cannot start with a number");
  }

  if (/^[^a-zA-Z0-9]/.test(trimmedUserName)) {
    throw createError(400, "username cannot start with a special character");
  }

  const exists = await this.findOne({ username: trimmedUserName });
  if (exists) {
    throw createError(400, "username already in use");
  }

  if (password.length < 6) {
    throw createError(400, "password must be at least 6 characters long");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username: trimmedUserName,
    password: hash,
    isAdmin,
    isChairman,
  });
  return user;
};

// static signIn method
UserSchema.statics.signIn = async function (username, password) {
  if (!username || !password) {
    throw createError(400, "username & password is required");
  }

  if (username.length < 3) {
    throw createError(400, "username must be at least 3 characters long");
  }

  if (typeof username !== "string") {
    throw createError(400, "username must be a string");
  }

  if (username.length < 3) {
    throw createError(400, "username must be at least 3 characters long");
  }

  if (/^\d/.test(username)) {
    throw createError(400, "username cannot start with a number");
  }

  if (/^[^a-zA-Z0-9]/.test(username)) {
    throw createError(400, "username cannot start with a special character");
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw createError(404, "invalid username");
  }

  if (password.length < 6) {
    throw createError(400, "password must be at least 6 characters long");
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw createError.Unauthorized("incorrect password");
  }

  if (user.isBanned) {
    throw createError.Unauthorized(
      "you are banned. please contact with authority"
    );
  }

  return user;
};

const User = model("User", UserSchema);
export default User;
