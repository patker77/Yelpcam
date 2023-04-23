import express from 'express';
const router = express.Router({mergeParams: true});
import Review from '../models/reviews.js';
import Campground from '../models/campground.js';

import { handleError } from "../utils/handleError.js";
import ExpresError from "../utils/expressError.js";
import { isLoggedIn } from "../utils/middleware.js";
import { reviewSchema} from "../schemas.js";


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



router.post('',isLoggedIn, validateReview, handleError( async (req,res) =>{
    const camps = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    await camps.review.push(review);
    await review.save();
    await camps.save();
    req.flash('success','Your review was Successfully added!');
    res.redirect(`/campgrounds/${camps._id}`)
}))

router.delete('/:reviewId',isLoggedIn, handleError( async (req,res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Your review was Successfully deleted!');
    res.redirect(`/campgrounds/${id}`)
}))


export default router;