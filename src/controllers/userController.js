import createError from "http-errors";
import User from "../models/userModel.js";
import { accessTokenSecret, refreshTokenSecret } from "../../secrets.js";
import createJWT from "../helper/createJWT.js";

const handleProcessCreateUser = async (req, res, next) => {
  const { username, password, isAdmin, isChairman } = req.body;
  try {
    const newUser = await User.signup(username, password, isAdmin, isChairman);

    const user = newUser.toObject();

    delete user.password;

    res.status(200).send({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
const handleSignInUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.signIn(username, password);

    // first make user object then delete a key value by using delete from the object
    const signedInUser = user.toObject();
    delete signedInUser.password;

    //TOKEN COOKIE
    const accessToken = await createJWT({ user }, accessTokenSecret, "1m");
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 1000, // 1 minute in milliseconds
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const refreshToken = await createJWT({ user }, refreshTokenSecret, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).send({
      success: true,
      message: "user signed in successfully",
      signedInUser,
    });
  } catch (error) {
    next(error);
  }
};

export { handleProcessCreateUser, handleSignInUser };
