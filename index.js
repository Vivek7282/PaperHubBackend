const express = require("express");
const dotenv = require("dotenv");
require("dotenv").config();
const PORT = 8080;
const app = express();
const cors = require("cors");
// const PORT = process.env.PORT;
dotenv.config();

const mongoDB = require("./config/db");
const authMiddleware = require("./middlewares/authMiddleware");
const { authController } = require("./controller/userController");
mongoDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE" // Include DELETE here
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });
app.use(express.json());
app.use("/images", express.static("images"));
app.use("/api/v1/user", require("./routers/AddQuestion"));
app.use("/api/v1/user", require("./routers/Operations"));
app.use("/api/v1/user", require("./routers/Login"));
app.use("/api/v1/user", require("./routers/Register"));
app.post("/api/v1/user/getUserData", authMiddleware, authController);
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
