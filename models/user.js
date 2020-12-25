const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  username: {
    type: String,
    required: true,
    min: 1,
    max: 30,
    validate: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
  },
  email: {
    type: String,
    required: true,
    validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  resettoken: {
    type: Object,
    default: null,
  },
  passwordexpirytime: {
    type: Date,
    default: Date.now() + 604800000
  },
  scrapeddata: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scrapeddata",
  },
});

userSchema.methods.generateAuthToken = function (changepassword) {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      changepassword,
    },
    process.env.JWT_AUTH_PRIVATE_KEY
  );
  return token;
};

userSchema.methods.generateResetToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_CHANGEPASSWORD_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("user", userSchema);

let passwordValidation = [
  Joi.string().min(6).max(256).required(),
  Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({"any.only": "passwords does not match"}),
];

function validateUser(data) {
  console.log(data);
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string()
      .min(1)
      .max(30)
      .required()
      .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)),
    email: Joi.string()
      .required()
      .pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)),
    password: passwordValidation[0],
    confirmpassword: passwordValidation[1],
  });
  return schema.validate(data);
}

function validatePassword(data) {
  const schema = Joi.object(
    {
      oldpassword: Joi.string(),
      password: passwordValidation[0],
      confirmpassword: passwordValidation[1]
    }
  );

  return schema.validate(data);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validatePassword = validatePassword;
