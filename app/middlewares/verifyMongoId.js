const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  const { id } = req.params;
  const isValid = mongoose.isObjectIdOrHexString(id);
  if (!isValid) return res.status(400).send({message:"Not Valide Id"});

  next();
};
