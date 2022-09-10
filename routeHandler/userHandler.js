const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schemas/userShema");

const router = express.Router();

// signup route
router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "Thanks for Registered!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0].userId,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );
        res.status(200).json({
          message: "Login successful",
          token,
        });
      } else {
        res.status(401).json({ error: "Authentication Failed!" });
      }
    } else {
      res.status(401).json({ error: "Authentication failed!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Authentication failed!" });
  }
});

module.exports = router;
