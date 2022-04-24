if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const car = require("./car");
const { storage } = require("./cloudinary");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/cars", () => {
  console.log("Database import connected");
});
const multer = require("multer");
const upload = multer({ storage });
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
new car({});
app.use(express.static(__dirname + "/"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database export connected");
});

app.get("/*", async (req, res) => {
  const data = await car.find({});
  res.render("newcar", { cars: data });
});

app.post("/car", upload.single("image"), (req, res) => {
  const myData = new car({
    title: req.body.title,
    comments: req.body.comments,
    year: req.body.year,
    price: req.body.price,
    tel: req.body.tel,
    email: req.body.email,
    image: req.file.path,
  });
  console.log(req.file.path, req.body);
  myData.save().then((updatedPage) => {
    res.render("newcar");
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
