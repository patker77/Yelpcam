import { campsgroundSchema,reviewSchema } from "../schemas.js";

export const isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must sign in!');
        return res.redirect('/login');
    }
    next();
}
export const validateCamps = (req, res, next) => {
    const { error } = campsgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e) => e.message).join(",");
      throw new ExpresError(400, msg);
    } else {
      next();
    }
  };

 export const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpresError(400,msg);
    }else{
        next();
    }
}