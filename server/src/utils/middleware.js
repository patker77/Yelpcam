import { campsgroundSchema, reviewSchema } from "../schemas.js";
import ExpresError from "./expressError.js";
import Campground from "../models/campground.js";
import Review from "../models/reviews.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must sign in!");
    return res.redirect("/login");
  }
  next();
};
export const validateCamps = (req, res, next) => {
  const { error } = campsgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpresError(400, msg);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpresError(400, msg);
  } else {
    next();
  }
};

export const isCampAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  const campground = await Campground.findById(id);
  if (
    review.author.equals(req.user._id) ||
    campground.author.equals(req.user._id)
  ) {
    next();
  } else {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
};
