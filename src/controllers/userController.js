import createError from "http-errors";
import User from "../models/userModel.js";

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
  try {
    res.status(200).send({
      success: true,
      message: "user signed in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { handleProcessCreateUser, handleSignInUser };
