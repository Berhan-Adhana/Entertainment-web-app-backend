const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    isAdmin: {
      type: String,
      default: "User",
    },
    refreshToken: {
      type: String,
      // required: true,
    },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Movie",
      },
    ],
    // bookmarks
  },

  {
    methods: {
      isPasswordMatched(enteredPassword) {
        return bcrypt.compareSync(enteredPassword, this.password);
      },
      generateAuthToken() {
        const token = jwt.sign({ id: this._id }, config.secret, {
          expiresIn: 86400,
        });
        return token;
      },
    },
  }
).pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    isAdmin: Joi.string(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
