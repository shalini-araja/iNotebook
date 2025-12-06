const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("connected to mongo successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
};
module.exports = connectToMongo;
