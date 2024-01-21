if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
const { isloggedin, ownerstatus } = require("./middleware");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const wrapasync = require("./util/wrapaysnc");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const eerror = require("./util/eerror");
const { listingSchema, reviewSchema } = require("./schema.js");
const userRouter = require("./routes/user_.js");
const listings = require("./routes/listing.js");
const port = process.env.PORT || 4000;
const flash = require("connect-flash");
app.use(flash());

async function main() {
  try {
    await mongoose.connect(process.env.atlaslink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: 5000,
    });

    // Other code that depends on the successful connection
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

main();

const store = MongoStore.create({
  mongoUrl: process.env.atlaslink,
  crypto: {
      secret: "DarK"
  },
  touchAfter: 24 * 60 * 60
});

store.on("error", () => {
  console.log("Error In MOngoDb");
});

const sessionopt = {
  store,
  secret: "DarK",
  resave: false,
  saveUninitialized: true,
  cookie: {
      expires: Date.now() + 7 * 24 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
  }
};

app.use(session(sessionopt));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.datauser = req.user;
  next();
});

const reviews = require("./routes/review.js");
const user = require("./models/user.js");

app.get("/", async (req, res) => {
  const datalist = await Listing.find();
  res.render("listings/index.ejs", { datalist });
});

app.get("/listing/create", isloggedin, (req, res) => {
  if (!req.isAuthenticated()) {
      console.log("kuch to hua");
      req.flash("error", "You must be login to create");
      return res.redirect("/login");
  }
  res.render("listings/create.ejs");
});

app.use("/listing", listings);
app.use("/listing/:id/review", reviews);
app.use("/", userRouter);

const validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
      let errormsg = error.details.map((el) => el.message).join(",");
      throw new eerror(400, errormsg);
  } else {
      next();
  }
};

app.all("*", (req, res, next) => {
  next(new eerror(404, "Some Error Occurs"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log("server working");
})
