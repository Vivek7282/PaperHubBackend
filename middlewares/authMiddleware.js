const JWT = require("jsonwebtoken");
const JWT_KEY = "HaHa";
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, JWT_KEY, (err, decode) => {
      if (err) {
        console.log(err);
        return res.status(200).send({
          message: "Auth Failed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth Failed.......",
      success: false,
    });
  }
};
