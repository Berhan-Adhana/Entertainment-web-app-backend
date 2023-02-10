const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("../routes/auth");
const movie = require("../routes/movie");
const user = require("../routes/user");
const { errorHandler, notFound } = require("../middlewares/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  // app.use(cookieParser());
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/movies", movie);
  app.use("/api/users", user);
  app.use(notFound);
  app.use(errorHandler);
  
};
