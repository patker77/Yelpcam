export const handleAsync = func =>{
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}