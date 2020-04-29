const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = process.env.AUTH_SECRET;

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Auth token not valid" });
  }
};
module.exports = auth;
