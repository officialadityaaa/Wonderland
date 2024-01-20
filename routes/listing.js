const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const wrapaysnc = require("../util/wrapaysnc");
const Listing = require("../models/listing");
const passport=require("passport");
const eerror = require("../util/eerror");
const { listingSchema, reviewSchema } = require("../schema");
const {isloggedin, ownerstatus}=require("../middleware");
const multer=require('multer')

const {cloudinary, storage}=require("../cloudconfig")
const upload=multer({storage})
const usser=require("../models/user")
const {indexx,newlist,showss,listedit,dellist,uplist,createpost}=require("../controller/listing");

const validatelisting = (req, res, next) => {
  // let result=listingSchema.validate(req.body);
  let { error } = listingSchema.validate(req.body);

  // if(result.error){
  if (error) {
    //eeror jyda aati h kabhi kabhi to
    let errormsg = error.details.map((el) => el.message).join(",");

    throw new eerror(400, errormsg);
  } else {
    next();
  }
  //now we can pass this as middle ware
};

//basic funcinily to made the project to make look simple make common routes to easy way
router.route("/:id")
.get(showss)
.delete(isloggedin,ownerstatus,wrapaysnc(dellist))
.put(isloggedin,ownerstatus,upload.single('listing[image]'), wrapaysnc(uplist));






router.get("/", wrapaysnc(indexx
  //async ke andr ka gayab kr diya
));

// app.get("/listing/:id",async(req,res)=>{
// const fnd=req.params;
// try{
// const listing = await Listing.findById(fnd);
// //console.log(listing.title);
// }
// catch(err){
//   //console.log(err);
// }

// })







router.post(
  //  >?"/create",isloggedin,
  // isloggedin,
  // wrapaysnc(createpost)
  // catch(err){

  //   next(err);
  // }
  //pass as a middleware
 

  "/create",isloggedin, upload.single('listing[image]'),wrapaysnc(createpost)
    //empty image ayega
  
);

router.get("/:id/edit",isloggedin,ownerstatus, wrapaysnc(listedit));

module.exports = router;  