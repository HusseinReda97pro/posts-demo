const mongoose = require("mongoose");

const MONGODB = "mongodb+srv://prohusseinreda:L9zERWwwjPON9Pru@cluster0.swglsvy.mongodb.net/  ";
mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log("Connect to MongooDB....");
  })
  .catch((err) => {
    console.log(err);
  });
