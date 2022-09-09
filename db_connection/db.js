const mongoose = require("mongoose");

// database connection
mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("connection successfully established!");
  })
  .catch((err) => {
    console.log(err.message);
  });
