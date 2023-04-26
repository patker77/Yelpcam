import User from "../models/user.js";

export const registerForm = (req, res) => {
  res.render("users/register");
};

export const logout = async (req, res, next) => {
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
};

export const createUser = async (req, res, next) => {
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
};

export const loginForm = (req, res) => {
  res.render("users/login");
};

export const login = (req, res) => {
  const { username } = req.body;
  req.flash("success", `Welcom ${username}`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
