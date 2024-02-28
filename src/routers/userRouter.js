import express from "express";
import {
  handleProcessCreateUser,
  handleSignInUser,
} from "../controllers/userController.js";
import { isAdminOrChairman, isLoggedIn } from "../middlewares/auth.js";

const userRouter = express.Router();

// sign in route
userRouter.post("/signIn", handleSignInUser);
// signup router
userRouter.post(
  "/signup",
  isLoggedIn,
  isAdminOrChairman,
  handleProcessCreateUser
);

export default userRouter;
