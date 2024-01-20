const express=require("express");
const router=express.Router({mergeParams:true});
//to get the param from the router
const wrapaysnc = require("../util/wrapaysnc");
const Listing = require("../models/listing");
const {isloggedin,authorstatus}=require("../middleware");
const eerror = require("../util/eerror");
const { listingSchema, reviewSchema } = require("../schema");

const review= require("../models/review");
//common part to cut /listing/:id/review

const validatereview=(req,res,next)=>{
    // let result=listingSchema.validate(req.body);
    let {error}=reviewSchema.validate(req.body);
        //  if(result.error){
  if(error){
  //eeror jyda aati h kabhi kabhi to 
  let errormsg=error.details.map((el)=>el.message).join(",");
  
          throw new  eerror(400,errormsg);
         }
         else{
          next();
         }
         //now we can pass this as middle ware
    
  }
//   router.post("/", isloggedin, validatereview, async (req, res) => {
//     const { id } = req.params;
//     let nreview = new review(req.body.review);
//     nreview.author = req.user._id;

//     await nreview.save();
// console.log(nreview)
//     // Find the review again and populate the author field
   
//     let listing = await Listing.findById(id);
//     listing.reviews.push(nreview);

//     await listing.save();

//     req.flash("success", "Review added");
//     res.redirect(`/listing/${id}`);
//  });


  router.post("/", isloggedin,validatereview, wrapaysnc(async(req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let nreview = new review(req.body.review);
    nreview.author = req.user._id;
// let bc=await nreview.populate("author");
// console.log(bc);
//console.log("hii");

await nreview.save();
 listing.reviews.push(nreview);
    
    let b=await listing.save();
console.log(b)
let populatedReview = await review.findById(nreview._id).populate('author');

console.log(populatedReview);


    // console.log(listing.reviews)
    // Find the review again and populate the author field
    // nreview = await review.findById(nreview._id).populate('author');
//console.log("pussy");
    //console.log(nreview); // Now this should print the author

  
  



    req.flash("success", "Review added")
    // //console.log(t);
    res.redirect(`/listing/${id}`);
}));

  
  
  
  
  //Delete Route for the reviews
  // app.delete("/listings/:id/reviews/:reviewID", wrapasync(async (req, res) => {
  //   //console.log('kuch to hua')
  //   let {id, reviewId} = req.params;
  //   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  //   await review.findByIdAndDelete(reviewId);
  //   res.redirect(`/listing/${id}`);
    
  // }));
  router.delete("/:reviewId",isloggedin, authorstatus,wrapaysnc(async (req, res) => {
    //console.log('kuch to hua')
  
    let {id, reviewId} = req.params;
    //console.log(id);
    //console.log(reviewId)
    try {
      let b = await Listing.findByIdAndUpdate(id, { $pull: { reviews: { _id: reviewId } } });
      let c = await review.findByIdAndDelete(reviewId);
      
      req.flash("success","Review Deleted")
      res.redirect(`/listing/${id}`);
    } catch (error) {
      //console.error(error);
      // Handle the error appropriately here
    }
  }));
  
  
  module.exports=router;