const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapaysnc = require("../util/wrapaysnc");
const passport=require("passport");
const {saveredirecturl}=require("../middleware")
router.get("/signup",(req,res)=>{
    
    res.render("user/signup.ejs")
})
router.post("/signup",wrapaysnc(async(req,res)=>{
    try{
let {username,email,password}=req.body;
const newuser=new User({email,username});
let cb=await User.register(newuser,password );
//console.log(cb);
req.login(cb,(err)=>{
    if(err){
      return   next(err);
    }
    req.flash("success","User Registered Successfully ")
res.redirect(`/listing`);
})

    }
    catch(e){
req.flash("success",e.message);
res.redirect("/signup");

    }
}))

router.get("/login",wrapaysnc(async(req,res)=>{
res.render("user/login.ejs");


}))
// router.post("/login",saveredirecturl,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true,}),async(req,res)=>{
//     //for failure flash show we must have flash as error in our
// req.flash("success","Login Successful");
// //we can't directly go to redidtecr to redirecturl that we sav from  originalUrl;
// //after passport login then it will reset the otehr datafrom req.session
// res.redirect(res.locals.redirectUrl);




// })
router.post("/login", saveredirecturl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), async(req, res) => {
    req.flash("success", "Login Successful");
    if (res.locals.redirectUrl) {
      res.redirect(res.locals.redirectUrl);
    } else {
      res.redirect("/");
    }
  });
  
router.get("/logout",async(req,res)=>{
req.logOut((err)=>{
    //inbuilt functions
if(err){
    return next(err);
}
else{
    req.flash("success","You are logged out!");
    res.redirect("/listing");
}

})

})

module.exports=router;