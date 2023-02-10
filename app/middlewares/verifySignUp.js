const User = require("../models/user");

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    userName: req.body.userName,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! user name is already in use!" });
      return;
    }

    //Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};



const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
