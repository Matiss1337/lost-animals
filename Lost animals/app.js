if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const animal = require("./animal");
const { storage } = require("./cloudinary");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/lostanimals", () => {
  console.log("connected to db");
});
const multer = require("multer");
const upload = multer({ storage });
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/animal", upload.single("image"), (req, res) => {
  const myData = new animal({
    comments: req.body.comments,
    tel: req.body.tel,
    email: req.body.email,
    image: req.file.path,
  });
  myData.save();
  console.log(req.file.path, req.body);
  res.send("Animal saved");
});

new animal({});

app.use(express.static(__dirname + "/"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/*", (req, res) => {
  res.render("index");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
