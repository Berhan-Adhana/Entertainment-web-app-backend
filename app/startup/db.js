const mongoose = require("mongoose");
module.exports = function () {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.zabguzd.mongodb.net/user`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("SUccessfully connected to MongoDb.");
    })
    .catch((err) => {
      console.error("Connection erorr", err);
      process.exit(1);
    });
};
