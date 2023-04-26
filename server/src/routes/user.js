import express from "express";
import passport from "passport";
import { handleAsync } from "../utils/handleError.js";
import {
  login,
  registerForm,
  loginForm,
  logout,
  createUser,
} from "../controllers/users.js";

const router = express.Router({ mergeParams: true });

router.route("/register").get(registerForm).post(handleAsync(createUser));

router.get("/logout", handleAsync(logout));

router
  .route("/login")
  .get(loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );
export default router;
