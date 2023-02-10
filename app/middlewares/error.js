const errorHandler = function (err, req, res, next) {
  //log errors

  res.status(500).send("Something failed!");
};
const notFound = function (req, res, next) {
  //log errors

  res.status(404).send("Sorry can't find that!");
};

module.exports = {
  errorHandler,
  notFound,
};
