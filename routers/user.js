import express from "express";
import passport from "passport";
import User from "../models/user.js"
const router = express.Router({ mergeParams: true });
import { handleError } from "../utils/handleError.js";



router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/logout",
  handleError(async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have been logged out");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/campgrounds");
    }
  })
);
router.post(
  "/register",
  handleError(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcom ${newUser.username}`);
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcom ${username}`);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);
export default router;
