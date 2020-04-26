const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middlewares/auth");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/emails");

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    // after a user signs up, log him in
    const { token } = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
  // without async await, usual promises way
  //   user
  //     .save()
  //     .then(() => {
  //       res.status(201).send(user);
  //     })
  //     .catch((error) => {
  //       res.status(400).send(error);
  //     });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const { token } = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send({ user: req.user });
});

router.patch("/users/me", auth, async (req, res) => {
  const allowed = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowed.includes(update));
  if (!isValid) {
    return res.status(400).send({ error: "invalid update operations" });
  }
  try {
    // Next 3 lines can be done in a single line like this:// const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    // But that will bypass mongoose middleware which hashes password while saving, we don't want that to happen
    // const user = await User.findById(_id);

    // Dont care about top 3 comments, we do not even need to get user by id
    // completely different approach when using middlewares
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    const user = await req.user.remove();
    sendCancelEmail(user.email, user.name);
    res.send({ user });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Multer configurations
const upload = multer({
  limits: {
    fileSize: 6000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

// This can be used to post as well as update avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;
