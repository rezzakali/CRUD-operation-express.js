const express = require("express");
const Todo = require("../schemas/todoSchema");

const router = express.Router();

// get all the todos
router.get("/", (req, res) => {
  Todo.find({ status: "active" })
    .select({
      _id: 0,
      __v: 0,
      //   date: 0,
    })
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
router.post("/", (req, res) => {
  const newTodo = new Todo(req.body);
  newTodo.save((err) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error!" });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully!" });
    }
  });
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
