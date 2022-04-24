const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: String,
  image: String,
  comments: String,
  year: Number,
  price: Number,
  tel: Number,
  email: String,
});

module.exports = mongoose.model("car", userSchema);
