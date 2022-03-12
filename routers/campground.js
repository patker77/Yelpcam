const express = require("express");
const Campground = require("../models/campground");
const router = express.Router();
const handlerError = require("../utils/handleError");
const ExpresError = require("../utils/expressError");
const isLoggedIn = require("../utils/middleware");
const { campsgroundSchema } = require("../schemas.js");

//middleware

const validateCamps = (req, res, next) => {
  const { error } = campsgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpresError(400, msg);
  } else {
    next();
  }
};

router.get(
  "",
  handlerError(async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "",
  isLoggedIn,
  validateCamps,
  handlerError(async (req, res, next) => {
    const camps = new Campground(req.body.campground);
    await camps.save();
    req.flash("success", `${camps.titel} was Successfully created!`);
    res.redirect(`campgrounds/${camps._id}`);
  })
);

router.get(
  "/:id",
  handlerError(async (req, res) => {
    const camps = await Campground.findById(req.params.id).populate("review");
    if (!camps) {
      req.flash("error", "Sorry can not find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camps });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  handlerError(async (req, res) => {
    const camps = await Campground.findById(req.params.id);
    if (!camps) {
      req.flash("error", "Sorry can not find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camps });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCamps,
  handlerError(async (req, res) => {
    const { id } = req.params;
    const camps = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", `${camps.titel} was Successfully update!`);
    res.redirect(`/campgrounds/${camps._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  handlerError(async (req, res) => {
    const { id } = req.params;
    const camps = await Campground.findByIdAndDelete(id);
    req.flash("success", `${camps.titel} was Successfully deleted!`);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
