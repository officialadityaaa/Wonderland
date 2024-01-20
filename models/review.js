const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const {Schema}=mongoose;
const User=require("./user");
// import {Schema} from 'mongoose';
const reviewSchema= new Schema({
Comment:String,
rating:{

type:Number,
min:1,
max:5

},

createdAt:{
type:Date,
default:Date.now()

},
author:{
    type:Schema.Types.ObjectId,
    ref:"User"
   
}



})
module.exports=mongoose.model("Review",reviewSchema);
//we want listing ke sath review attach ho so we use one to mnay 