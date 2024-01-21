
if(process.env.NODE_ENV!="production"){
require('dotenv').config();
// then we can acces anywhefa-rotate}
} 

const express = require("express");

const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const review= require("./models/review.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate);
const {isloggedin, ownerstatus}=require("./middleware");
//views ke liye set
const passport=require("passport");
const localstrategy=require("passport-local");
 const User=require("./models/user.js");
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const wrapasync=require("./util/wrapaysnc");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const eerror = require("./util/eerror");
const  {listingSchema,reviewSchema}=require("./schema.js");
const userRouter=require("./routes/user_.js");
const listings=require("./routes/listing.js");

// const reviewss=require("./routes/review.js");
//for sever side schema vlaidation using joi
const flash=require("connect-flash");
app.use(flash());
async function main() {
  try {
    await mongoose.connect(process.env.atlaslink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true, // Add this line with a value (e.g., true or false)
    });

    // Other code that depends on the successful connection
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}}
main();


const  store=MongoStore.create({

  mongoUrl:process.env.atlaslink,
  crypto:{
    secret:"DarK"
  }
  ,
  touchAfter:24*60*60
  })


  store.on("error",()=>{
    console.log("Error In MOngoDb");
  })
const sessionopt={
  store,
  secret:"DarK",
resave:false,
saveUninitialized:true,
cookie:{


expires:Date.now() + 7*24*60*1000,
maxAge: 7*24*60*60*1000
,
httpOnly:true
}

};



//for web aplication nedds to know which user sending reqyests from the 
//use this for every request same 
app.use(session(sessionopt));
app.use(passport.initialize());
app.use(passport.session());

 passport.use(new localstrategy(User.authenticate()));

 passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.datauser=req.user;
//console.log(req.user);
next();

})


const reviews=require("./routes/review.js");
const user = require("./models/user.js");
// app.get("/demouser",async(req,res)=>{


//   let fakeuser=new User({
//     email:"aditya8923@gmail.com",
//     username:"adityaboudh"
//   });
//   let newuser=await User.register(fakeuser,"hello_world");
//   //console.log(newuser);
//   res.send(newuser);
//   })

app.get("/", async(req, res) => {
  const datalist = await Listing.find();
  // //console.log(datalist);
  res.render("listings/index.ejs", { datalist });
 
});
app.get("/listing/create",isloggedin,(req, res) => {
  if(!req.isAuthenticated()){
     console.log("kuch to hua")
    req.flash("error","You must be login to create");
    
   return res.redirect("/login");
  
     
    }
    res.render("listings/create.ejs");}
    
    
    
    );





app.use("/listing",listings);
app.use("/listing/:id/review",reviews);
app.use("/",userRouter);




//index route
const validatelisting=(req,res,next)=>{
  // let result=listingSchema.validate(req.body);
  let {error}=listingSchema.validate(req.body);
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




app.all("*",(req,res,next)=>{
  //console.log("hellos");
next(new eerror(404,"Some Error Occurs"));


})

app.use((err,req,res,next)=>{

  //console.log("something went wrong");
  let {statusCode=500,message="something wrong"}=err;
  // //console.log(statusCode);
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
  
})

app.listen(4000, () => {
  console.log("server working");
});
