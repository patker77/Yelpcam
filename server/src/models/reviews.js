import mongoose from "mongoose";


const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

const Review = mongoose.model('Review',reviewSchema);
export default Review;