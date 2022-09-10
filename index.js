const express = require("express");
require("./db_connection/db");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");

const port = process.env.PORT || 3000;
const hostname = "127.0.0.1";

dotenv.config();
const app = express();
app.use(express.json());

// route
app.use("/todo", todoHandler);

app.use("/user", userHandler);

// error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({ err });
});

app.listen(port, hostname, () => {
  console.log(
    `Your server is running successfully at http://${hostname}:${port}`
  );
});
