const express = require("express");
const User = require("../models/User");
const router = express.Router();
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });
app.use(express.urlencoded({ extended: true }));
// Serve uploaded photos
app.use("/uploads", express.static("uploads"));

router.route("/createUser").post(upload.single("photo"), async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const college = req.body.college;
  
  const email = req.body.email;
  const photo = req.file.filename;
  const Ppassword = req.body.password;
  const saltRounds = 10;
  // console.log(name, "", className, "", location, " ", photo);

  try {
    const password = await bcrypt.hash(Ppassword, saltRounds);
    const newUserData = {
      name,
      phone,
      college,
      password,
      email,
      photo,
    };

    const newUser = new User(newUserData);

    await newUser.save();
    res.json("Admin Added");
  } catch (error) {
    console.error(error);
    res.status(400).json("Error: " + error.message);
  }
});

router.get("/mentorList", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
