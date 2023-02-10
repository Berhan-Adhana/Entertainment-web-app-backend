const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { User } = require("../models/user");

const verifyToken = function (req, res, next) {
  let token = req.header("x-auth-token");

  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided!" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(400).send({ message: "Invalid token!" });

    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.isAdmin !== "Admin")
      return res.status(401).send("Unauthorized user");
    next();
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
