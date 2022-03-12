const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        require: true
    },
    body: {
        type: String,
        require: true
    }

});

module.exports = mongoose.model('Review',reviewSchema);