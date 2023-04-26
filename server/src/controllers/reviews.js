import Campground from "../models/campground.js";
import Review from "../models/reviews.js";

export const createReview = async (req, res) => {
  const camps = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  await camps.review.push(review);
  await review.save();
  await camps.save();
  req.flash("success", "Your review was Successfully added!");
  res.redirect(`/campgrounds/${camps._id}`);
};

export const deleteReview = async (req, res) => {
  const{id,reviewId} = req.params;
  await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Your review was Successfully deleted!");
  res.redirect(`/campgrounds/${id}`);
};
