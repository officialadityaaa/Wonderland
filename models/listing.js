const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review");
const User=require("./user");
const defaultImageUrl = "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
 url:String,
  // or any other URL you want
  filename:String
  }
  ,
  price:Number,
  location: String,
  country: String,
  
  reviews:[
    {
type:Schema.Types.ObjectId,
ref:"Review"

    }
  ],

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});
//post middleware for mongooose
listingSchema.post("findOneAndDelete",async (listing) => {
if(listing){
  await Review.deleteMany({_id: { $in:listing.reviews}});

}
}
)
// })

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
