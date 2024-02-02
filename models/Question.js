const mongoose = require("mongoose");

const { Schema } = mongoose;

const PaperSchema = new Schema({
  college: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false, // Set default value to false if not provided
  },

  questions: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("paper", PaperSchema);
