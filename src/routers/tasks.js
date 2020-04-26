const express = require("express");
const User = require("../models/user");
const Task = require("../models/task");
const router = new express.Router();
const auth = require("../middlewares/auth");

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET /tasks
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0, /tasks/limit=10&skip=10, also you can provide only one of limit or skip
// GET /tasks?sortBy=createAt:desc
router.get("/tasks", auth, async (req, res) => {
  try {
    // Use virtual schema(relationship) between user and tasks
    // without options: await req.user.populate("tasks").execPopulate();
    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
    }
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    const tasks = req.user.tasks;

    // You can also make use of normal find (by owner)
    // const tasks = await Task.find({ owner: req.user._id });

    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowed = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValid = updates.every((update) => allowed.includes(update));
  if (!isValid) {
    return res.status(400).send({ error: "invalid update operations" });
  }
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
