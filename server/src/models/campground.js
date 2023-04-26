import mongoose from 'mongoose';
import Review from './reviews.js';


const Schema = mongoose.Schema;
const CampgroundSchema = new Schema({
    titel: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    review: [ 
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})

const Campground = mongoose.model('Campground',CampgroundSchema);
export default Campground;