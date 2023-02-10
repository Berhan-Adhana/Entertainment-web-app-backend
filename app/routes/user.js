var express = require("express");
var router = express.Router();
const _ = require("lodash");
const { verifySignUp } = require("../middlewares");
const addHeaders = require("../middlewares/addHeaders");

const { User, validate } = require("../models/user");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");
const verifyMongoId = require("../middlewares/verifyMongoId");

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, addHeaders],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = new User(
      _.pick(req.body, ["userName", "email", "password", "isAdmin"])
    );

    user = await user.save();
    res.status(200).send(user);
  }
);

/* GET users listing. */
router.get("/all-users", async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});

// Deleting a s user by admin
router.delete("/:id", verifyMongoId, verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete({ _id: id });
  res.status(200).send(user);
});

// Updating a user
router.put("/:id", verifyMongoId, verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    id,
    _.pick(req.body, ["userName", "email", "password", "isAdmin"])
  );
  res.status(200).send(user);
});

router.get("/bookmarks", verifyToken, async (req, res) => {
  const id = req.userId;
  User.findById(id)
    .populate("bookmarks")
    .exec((err, user) => {
      if (err) return res.status(401).send(err.message);
      return res.status(200).send(user.bookmarks);
    });
  // bookmarks.map(())
});

router.post("/bookmark", verifyToken, async (req, res) => {
  const id = req.userId;
  let user;
  user = await User.findById(id);

  let isBookmarked = user?.bookmarks?.includes(req.body.entertaimentId);
  if (!isBookmarked) {
    await User.findByIdAndUpdate(id, {
      $push: { bookmarks: req.body.entertaimentId },
    }).then(() => {
      return res
        .status(200)
        .send({ message: "Movie added to Bookmarks successfully" });
    });
  } else {
    await User.findByIdAndUpdate(id, {
      $pull: { bookmarks: req.body.entertaimentId },
    }).then(() => {
      return res
        .status(200)
        .send({ message: "Movie removed from Bookmarks successfully" });
    });
  }
});
module.exports = router;
