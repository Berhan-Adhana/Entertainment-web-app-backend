const mongoose = require("mongoose");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
    },

    year: {
      type: "Number",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    // isBookmarked: {
    //   type: Boolean,
    //   required: true,
    // },
    isTrending: {
      type: Boolean,
      required: true,
    },
    thumbnail: {
      trending: {
        small: {
          type: String,
        },
        large: {
          type: String,
        },
      },
      regular: {
        small: {
          type: String,
        },
        medium: {
          type: String,
        },
        large: {
          type: String,
        },
      },
    },
  })
);
module.exports = Movie;
