// Setting test data
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");


const user1ID = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1ID,
  name: "Gullyboy",
  email: "mygully@gully.com",
  password: "youcantstealthis<>",
  tokens: [
    {
      token: jwt.sign({ _id: user1ID }, process.env.AUTH_SECRET),
    },
  ],
};

const user2ID = new mongoose.Types.ObjectId();
const user2 = {
  _id: user2ID,
  name: "Gullyboy2",
  email: "mygully2@gully.com",
  password: "youcantstealthis<69>",
  tokens: [
    {
      token: jwt.sign({ _id: user2ID }, process.env.AUTH_SECRET),
    },
  ],
};


const task1 ={
    _id:new mongoose.Types.ObjectId(),
    description:"Get a job",
    completed:false,
    owner:user1._id
};

const task2 ={
    _id:new mongoose.Types.ObjectId(),
    description:"Complete learning Blockchain",
    owner:user1._id
};

const task3 ={
    _id:new mongoose.Types.ObjectId(),
    description:"Become good at front end development",
    completed:false,
    owner:user2._id
};

const task4 ={
    _id:new mongoose.Types.ObjectId(),
    description:"Start learning ML by the end of 2020",
    completed:false,
    owner:user2._id
}


const setUpDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(user1).save();
  await new User(user2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
  await new Task(task4).save();
};

module.exports = {
  user1,
  user1ID,
  setUpDB,
};
