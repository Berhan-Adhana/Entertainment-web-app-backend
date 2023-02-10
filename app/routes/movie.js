const { verifyToken, isAdmin } = require("../middlewares/authJwt");
const verifyMongoId = require("../middlewares/verifyMongoId");
const Movie=require('../models/movie')



const router = require("express").Router();

router.get("/all", verifyToken, async (req, res) => {
  Movie.find((err, result) => {
    if (err) return res.status(500).send({ message: err.message });
    res.status(200).send(result);
  });
});

router.get("/movies", verifyToken, (req, res) => {
  Movie.find({ category: "Movie" }, (err, movies) => {
    if (err) return res.status(404).send("Movies nto found!");
    res.status(200).send(movies);
  });
});

router.get("/tv-series", verifyToken, (req, res) => {
  Movie.find({ category: "TV Series" }, (err, result) => {
    if (err) return res.status(500).send({ message: err.message });
    res.status(200).send(result);
  });
});

// for creating a new movie data
router.post("/create-movie", verifyToken, isAdmin, async (req, res) => {
  const { title, year, category, rating, isTrending, isBookmarked, thumbnail } =
    req.body;
  const movie = new Movie({
    thumbnail: {
      trending: {
        small: thumbnail?.trending?.small,
        large: thumbnail?.trending?.large,
      },
      regular: {
        small: thumbnail?.regular?.small,
        medium: thumbnail?.regular?.medium,
        large: thumbnail?.regular?.large,
      },
    },

    title: title,
    year: year,
    category: category,
    rating: rating,
    isBookmarked: isBookmarked,
    isTrending: isTrending,
  });
  await movie.save();
  res.status(200).send(movie);
});

// getting a specfic movie
router.get("/:id", verifyMongoId, verifyToken, async (req, res) => {
  const { id } = req.params;

  await Movie.findById({ _id: id }, (err, movie) => {
    if (err) return res.status(404).send("Movie not found!");

    return res.status(200).send(movie);
  }).clone();
});

// deleting a specfic movie
router.delete("/:id", verifyMongoId, verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  Movie.findOneAndDelete({ _id: id }, (err, movie) => {
    if (err) return res.status(404).send("Invalid Id");
    if (!movie) return res.status(200).send("Movie Not found!");
    return res.status(200).send(movie);
  });
});

module.exports = router;
