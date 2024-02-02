const express = require("express");
const Question = require("../models/Question");
const router = express.Router();
const cors = require("cors");
const path = require("path");
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
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/pdf",
  ];
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

router.route("/addPaper").post(upload.array("questions"), async (req, res) => {
  const college = req.body.college;
  const semester = req.body.semester;
  const type = req.body.type;
  const branch = req.body.branch;
  const subject = req.body.subject;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const questions = req.files.map((file) => file.filename);

  console.log(college);

  try {
    const newQuestionData = {
      college,
      branch,
      semester,
      type,
      subject,
      questions,
    };

    const newQuestion = new Question(newQuestionData);

    await newQuestion.save();
    res.json("Question Added");
  } catch (error) {
    console.error(error);
    res.status(400).json("Error: " + error.message);
  }
});

router.get("/questionList", async (req, res) => {
  try {
    const verifiedQuestions = await Question.find({ verified: true });
    res.json(verifiedQuestions);
  } catch (error) {
    console.error("Error fetching verified questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/questionList1", async (req, res) => {
  try {
    const verifiedQuestions = await Question.find({ verified: false });
    res.json(verifiedQuestions);
  } catch (error) {
    console.error("Error fetching verified questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getQuestionById", async (req, res) => {
  // Extract the user ID from the request query parameters
  const questionId = req.query.questionId;

  try {
    // Query the database to retrieve the user based on the ID
    const question = await Question.findById(questionId);
    // console.log(student);
    // Check if the user exists
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
