import Campground from "../models/campground.js";

export const index = async (req, res) => {
  const camps = await Campground.find({});
  
  res.render("campgrounds/index", { camps });
};
export const createCampForm = (req, res) => {
  res.render("campgrounds/new");
};
export const createCamp = async (req, res, next) => {
  const camps = new Campground(req.body.campground);
  await camps.save();
  req.flash("success", `${camps.titel} was Successfully created!`);
  res.redirect(`campgrounds/${camps._id}`);
};
export const getCamp = async (req, res) => {
  const camps = await Campground.findById(req.params.id).populate("review").populate("author");
  if (!camps) {
    req.flash("error", "Sorry can not find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camps });
};
export const editCampForm = async (req, res) => {
  const camps = await Campground.findById(req.params.id);
  if (!camps) {
    req.flash("error", "Sorry can not find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camps });
};
export const editCamp = async (req, res) => {
  const { id } = req.params;
  const camps = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", `${camps.titel} was Successfully update!`);
  res.redirect(`/campgrounds/${camps._id}`);
};
export const deleteCamp = async (req, res) => {
  const { id } = req.params;
  const camps = await Campground.findByIdAndDelete(id);
  req.flash("success", `${camps.titel} was Successfully deleted!`);
  res.redirect("/campgrounds");
};
