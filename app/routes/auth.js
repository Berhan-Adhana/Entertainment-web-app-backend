const _ = require("lodash");
const addHeaders = require("../middlewares/addHeaders");
const router = require("express").Router();
const { User } = require("../models/user");

router.post("/signin", [addHeaders], async (req, res) => {
  let user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    return res.status(404).json({ message: "User Not found." });
  }

  const passwordIsValid = await user.isPasswordMatched(req.body.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      message: "Invalid Credentials",
    });
  }
  delete user.password;
  const token = user.generateAuthToken();
  // const refreshToken = jwt.sign({ id: user._id }, config.refreshSecret, {
  //   expiresIn: "3d", // 24 hours
  // });

  // const updatedUser = await User.findByIdAndUpdate(
  //   user._id,
  //   {
  //     refreshToken: refreshToken,
  //   },
  //   { new: true }
  // );
  // res.cookie("refreshToken", refreshToken, {
  //   maxAge: 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   // secure: true,
  // });

  user.accessToken = token;
  res
    .header("x-auth-token", token)
    .status(200)
    .send(
      _.pick(user, ["_id", "userName", "email", "bookmarks", "accessToken"])
    );
});

// This is the refresh token route
// router.get("/refresh", async (req, res) => {
//   const refreshToken = req.cookies?.refreshToken;
//   if (!refreshToken) return res.status(406).json({ message: "Unauthorized" });
//   const user = await User.findOne({ refreshToken: refreshToken });
//   if (!user) return res.status(400).send("Unathorized");
//   jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
//     if (err) return res.status(406).json({ message: "Unauthorized" });
//     const userId = decoded.id;
//     const accessToken = user.generateAuthToken(userId);
//     res.json({ accessToken });
//   });
// });

module.exports = router;
