const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const Todo = require("../schemas/todoSchema");
const User = require("../schemas/userShema");

const router = express.Router();

// active status todos
router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({ result: data });
  } catch (err) {
    res.status(500).json({ error: "There was a server side error!" });
  }
});

// find by js word
router.get("/js", async (req, res) => {
  try {
    const data = await Todo.findByJS();
    res.status(200).json({ result: data });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error!" });
  }
});
// find by language
router.get("/language", async (req, res) => {
  try {
    const data = await Todo.find().byLanguage("html");
    res.status(200).json({ result: data });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error!" });
  }
});

// get all the todos
router.get("/", checkLogin, (req, res) => {
  Todo.find({})
    .populate("user", "name username -_id")
    .select({
      _id: 0,
      __v: 0,
      //   date: 0,
    })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          result: data,
          message: "Success",
        });
      }
    });
  // .clone()
  // .catch((err) => console.log(err.message));
});

// get a single todo
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.findById({ _id: req.params.id }).select({
      _id: 0,
      __v: 0,
    });
    res.status(200).json({ result: data });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error!" });
  }
});

// post a single tood
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );

    res.status(200).json({ result: "Todo inserted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error!" });
  }
});

// post multiple todos
router.post("/all", (req, res) => {
  Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error!" });
    } else {
      res.status(200).json({
        result: "Todos were inserted successfully!",
      });
    }
  });
});

// update a single todo
router.put("/:id", (req, res) => {
  Todo.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  )
    .select({
      _id: 0,
      __v: 0,
    })
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ error: "There was a server side error!" });
      } else {
        res.status(200).json({ result: data });
      }
    });
});

// delete a single todo
router.delete("/:id", (req, res) => {
  Todo.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error!" });
    } else {
      res.status(200).json({ message: "Todo was successfully deleted!" });
    }
  }).catch((err) => console.log(err.message));
});

module.exports = router;
