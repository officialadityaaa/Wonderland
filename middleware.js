const Listing=require("./models/listing");
const review = require("./models/review");

module.exports.isloggedin=(req,res,next)=>{

    if(!req.isAuthenticated()){
        console.log(req.user)
        req.flash("error","You must be login");
        //then we have store the orginalURl
        //we made parameneter 
        req.session.redirectUrl=req.originalUrl;
        return res.redirect("/login");
        // above will the work if we use 
      }
      console.log(req.user)
      next();

}
module.exports.saveredirecturl=(req,res,next)=>{

if(req.session.redirectUrl){

    res.locals.redirectUrl=req.session.redirectUrl;
    
  
}
next();

     
}

module.exports.ownerstatus=async(req,res,next)=>{
    let { id } = req.params;
  
    let list=await Listing.findById(id);
  
    if(!list.owner.equals(res.locals.datauser._id)){
    req.flash("success","You are not Owner of this listing")
    res.redirect(`/listing/${id}`); 
   }
   
   next();


}



module.exports.authorstatus = async (req, res, next) => {
    let { id, reviewId } = req.params;


        let Review = await review.findById(reviewId);

        if (!Review.author.equals(res.locals.datauser._id)) {
            req.flash("success", "You don't own this review");
            return res.redirect(`/listing/${id}`);
        }
        
        next();
    
};
