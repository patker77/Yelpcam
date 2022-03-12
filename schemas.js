const Joi = require ('joi');

module.exports.campsgroundSchema = Joi.object({
    campground: Joi.object({
        titel: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(100),
        location: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
    }).required()
});