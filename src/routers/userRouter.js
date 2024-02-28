import express from "express";
import {
  handleProcessCreateUser,
  handleSignInUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

// sign in route
userRouter.post("/signIn", handleSignInUser);
// signup router
userRouter.post("/signup", handleProcessCreateUser);

export default userRouter;
