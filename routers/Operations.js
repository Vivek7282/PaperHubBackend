const express = require("express");
const Question = require("../models/Question");
const router = express.Router();
const cors = require("cors");

const app = express();

app.use(cors());
router.delete("/deleteQuestion/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    // Find the question by ID
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Delete the question
    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/updateQuestion/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    // Find the question by ID and update the 'verified' field to true
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { verified: true },
      { new: true } // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a paper by ID
router.post("/updatePaper/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const updatedPaper = await Question.findOneAndUpdate(
      { _id: questionId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPaper) {
      return res.status(404).json({ error: "Paper not found" });
    }

    res.json({ message: "Paper updated successfully", paper: updatedPaper });
  } catch (error) {
    console.error("Error updating paper:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
