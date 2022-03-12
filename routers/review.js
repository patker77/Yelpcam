const express = require('express');
const router = express.Router({mergeParams: true});

const Review = require('../models/reviews');
const Campground = require('../models/campground');

const handlerError = require('../utils/handleError');
const ExpresError = require('../utils/expressError');
const isLoggedIn = require('../utils/middleware');

const {reviewSchema} = require('../schemas.js');


//middleware

const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpresError(400,msg);
    }else{
        next();
    }
}



router.post('',isLoggedIn, validateReview, handlerError( async (req,res) =>{
    const camps = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    await camps.review.push(review);
    await review.save();
    await camps.save();
    req.flash('success','Your review was Successfully added!');
    res.redirect(`/campgrounds/${camps._id}`)
}))

router.delete('/:reviewId',isLoggedIn, handlerError( async (req,res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Your review was Successfully deleted!');
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router;