const Listing=require("../models/listing")
const mongoose=require("mongoose");

module.exports.indexx=async (req, res) => {
  console.log("sjjs")
    const datalist = await Listing.find();
   
    res.render("listings/index.ejs", { datalist });
  }
  // module.exports.newlist=
  module.exports.showss=async (req, res) => {
    let { id } = req.params;
  
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
          path: "author",
          // Specify the fields you want to populate
      }
  }).populate("owner");
  // console.log(listing.reviews.author); // Access the username
  // console.log(listing.reviews.populate("reviews"));    // Access the email
  

    
    res.render("listings/show.ejs", { listing });
}
module.exports.listedit=async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  if(!data){
    req.flash("success","Listing Not Exist")
    res.redirect("/listing");
  }
  
  
  res.render("listings/edit.ejs", { data });
}
module.exports.dellist=async (req, res) => {
  let { id } = req.params;
  console.log("ID:", id); // Log the id to the console

  // Check if the id is a valid ObjectId
  if (mongoose.isValidObjectId(id)) {
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  } else {
    console.log("Invalid ObjectId");
    // Handle the case where id is not a valid ObjectId
    res.status(400).send("Invalid ObjectId");
  }
}



module.exports.uplist=async (req, res) => {
  if (!req.body.listing) {
    throw new eerror(400, "lisiting empty");
  }
 
  // //console.log("kaamthodasa");
 let { id } = req.params;
  
 let list=await Listing.findById(id);
// list.image={url,filename}
//   if(!list.owner.equals(res.locals.datauser._id)){
//   req.flash("success","You are not Owner of this listing")
//   res.redirect(`/listing/${id}`); 
//  }
// we made miidleware ownerstatus for above

 let liss=await Listing.findByIdAndUpdate(id,{...req.body.listing});
 if(typeof req.file !== "undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
 liss.image={url,filename};
 await liss.save();
 }
  req.flash("success","Listing Updated")
  // Redirect to another page after update

  
  res.redirect(`/listing/${id}`); // or any other desired page
}



module.exports.createpost=async (req, res, next) => {
  // try{
  // if(!req.body.listing){
  //   throw new eerror(400,"lisiting empty");
  // }
  //this will use we we send data from server site liek using hopscotch postman
  //if we send only desciption or price or not anotehr thing sthen it will work but it shoudld nto worked
  // const nlist=new Listing(req.body.listing);
let url=req.file.path;
console.log(url);
let filename=req.file.filename;
  // //console.log(req.body);
  let listingo = await req.body.listing;
  //below method is incovenient bcz it much time and
  //if we have too much mdoel it tough
  //so we use joi
  listingo.image={url,filename};
  // if(!listingo.title){
  //   throw new eerror(400,"title missing");
  // }
  // if(!listingo.location){
  //   throw new eerror(400,"location missing");
  // }
  const nw = new Listing(listingo);
  nw.owner=req.user._id;
  await nw.save();
  req.flash("success","Created New Listing")
  res.redirect("/listing");
}