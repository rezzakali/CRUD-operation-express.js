const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  todos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

// model
const User = mongoose.model("User", userSchema);

module.exports = User;
