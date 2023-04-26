import express from 'express';
const router = express.Router({mergeParams: true});
import { deleteReview,createReview } from '../controllers/reviews.js';
import { handleAsync} from "../utils/handleError.js";
import { isLoggedIn,validateReview } from "../utils/middleware.js";


router.post('/',isLoggedIn, validateReview, handleAsync(createReview))

router.delete('/:reviewId',isLoggedIn, handleAsync(deleteReview))


export default router;