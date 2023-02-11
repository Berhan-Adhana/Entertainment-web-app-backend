var express = require("express");
const moviesData = require("./app/data");
const { User } = require("./app/models/user");
var app = express();
require("dotenv").config();
// require("express-async-errors");

app.get("/", (req, res) => {
  res.status(200).send({ message: "hello" });
});

/* GET users listing. */
app.get("/api/users/all-users", async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});

require("./app/startup/db")();
require("./app/startup/routes")(app);

// app.get("/", (req, res) => {
//   res.status(200).send({ message: "hello" });
// });

//database connetion  ://berhan:<password>@cluster0.zabguzd.mongodb.net/test

// initial();
// function initial() {
//   Movie.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {
//       moviesData.map((movie) => {
//         console.log(movie);
//         return new Movie({
//           title: movie.title,
//           thumbnail: {
//             trending: {
//               small: movie.thumbnail.trending?.small,
//               large: movie.thumbnail.trending?.large,
//             },
//             regular: {
//               small: movie.thumbnail.regular.small,
//               medium: movie.thumbnail.regular.medium,
//               large: movie.thumbnail.regular.large,
//             },
//           },
//           year: movie.year,
//           category: movie.category,
//           rating: movie.rating,
//           isTrending: movie.isTrending,
//         }).save((err, res) => {
//           if (err) {
//             console.log("erorr", err);
//           }
//           console.log("added 'movie' to movies collection");
//         });
//       });
//     }
//   });
// }

//set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
