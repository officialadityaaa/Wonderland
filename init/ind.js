const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonder_land";
console.log("hello");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  //main thng to add user id
  initData.data=initData.data.map((obj)=>({...obj,owner:"65a6d93aa770fea6b4810368"} ))
//we use above bcz map makes new array we save in perveieous array
  await Listing.insertMany(initData.data);
  console.log("mission compelte");
};

initDB();
