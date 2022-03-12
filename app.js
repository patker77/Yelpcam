//Require Modules

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");

const LocalStrategy = require("passport-local");
const passport = require("passport");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpresError = require("./utils/expressError");

const campgroundsRoutes = require("./routers/campground.js");
const reviewsRoutes = require("./routers/review");
const registerRoutes = require("./routers/user");

//config

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_methode"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Creat mongoose database

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("the database is connected");
});

//setting engine render

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
