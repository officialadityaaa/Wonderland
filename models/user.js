
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const {Schema}=mongoose;
const passportlocalmongoose=require("passport-local-mongoose");
//passport local is basic stepu liek username passsword type stregategy
const userschema=new Schema({

email:{
    type:String,
    required:true
}
,
// these two are automatically decleared by passport local mongoose
// username:{
//     type:string,
//     required:true
// },
// password:{
//     type:string,
//     required:true
// }
// ,

})

userschema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User",userschema);