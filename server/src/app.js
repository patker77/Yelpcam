import express from "express";
import session from "express-session";
import flash from "connect-flash";
import User from "./models/user.js"

import dotenv from "dotenv";
import passport from "passport";
import LocalStrategy from "passport-local";
import path from "path";
dotenv.config();

import methodOverride from "method-override";
import ejsMate from "ejs-mate";

import ExpresError from "./utils/expressError.js";

import registerRoutes from "./routes/user.js";
import reviewsRoutes from "./routes/review.js";
import campgroundsRoutes from "./routes/campground.js";

const app = express();



//config789

const sessionConfig = {
    secret: "imasaltedpassphrase",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 2,
      maxAge: 1000 * 60 * 60 * 2,
    },
  };
  //used modules
  import { fileURLToPath } from "url";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride("_methode"));
  app.use(express.static(path.join(__dirname, "../../client/public")));
  app.use(session(sessionConfig));
  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


//setting engine render

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../client/views"));

//routers to pages

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews/", reviewsRoutes);
app.use("/", registerRoutes);

app.all("*", (req, res, next) => {
  next(new ExpresError(404, "Page not found"));
});

//Handling Error

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Somthing went wrong!!!";
  res.status(statusCode).render("error", { err });
});
export default app;