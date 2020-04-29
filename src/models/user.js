const mongoose = require("mongoose");
const Validator = require("validator");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.AUTH_SECRET;
const Task = require("../models/task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return Validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate: {
        validator: (value) => {
          return !value.toLowerCase().includes("password");
        },
        message: "Password cannot contian password",
      },
    },
    age: {
      type: Number,
      default: 0,
      validate: {
        validator: (value) => {
          return value >= 0;
        },
        message: (props) => `${props.value} is not a valid age`,
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// Relationship with Task (This is called virtual schema)
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// Used for login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email does not exist");
  }
  const isMatch = await brcypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Wrong password");
  }
  return user;
};

// To generate auth tokens
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, secret);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return { user: this, token };
};

// To return public profile of the user,
// when JSON.stringify is called on user, this method is invoked
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

// Middleware to hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await brcypt.hash(this.password, 8);
  }
  next();
});

// Middleware which deletes tasks when user is deleted
userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// const me = new User({
//     name:"adithya",
//     email:"adithya@gmail.com",
//     age:20,
//     password:"12345678"
// });
// me.save().then(()=>{
//     console.log(me);
// }).catch((erro)=>{
//     console.log(erro);
// });
