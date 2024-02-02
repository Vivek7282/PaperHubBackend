const express = require("express");
const User = require("../models/User");
const router = express.Router();
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const jwtSecret = "HaHa";
const app = express();
app.use(cors());

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Try Logging in with correct credentials",
        });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res.status(400).json({
          success: false,
          error: "Try Logging in with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
          name: user.name,
          college: user.college,
        },
      };
      success = true;
      const authToken = jwt.sign(data, jwtSecret);

      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/userData", async (req, res) => {
  const token = req.headers.authorization; // Get the token from the request header
  // console.log(token);
  // Verify and decode the token (use your own verification logic)
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.user.id; // Extract user ID from the decoded token
      // console.log(userId);
      // Fetch user data from the database using the user ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user data as JSON
      res.json({ success: true, data: user });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Token not provided" });
  }
});

module.exports = router;
