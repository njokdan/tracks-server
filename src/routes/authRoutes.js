const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
  //when you get a post request to the route /signup, do this...
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });

    const saveUser = await user.save();

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");

    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "must provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "invalid password or email" });
  }
});

module.exports = router;
