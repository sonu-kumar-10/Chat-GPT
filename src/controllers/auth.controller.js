const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const {
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    res.status(400).json({
      message: "User Already exist!",
    });
  }

  // hash Password
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashPassword,
  });

  //token create
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  //save to cookie me
  res.cookie("token", token);

  //user created
  res.status(201).json({
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invaild email or password!",
    });
  }
  const isPassVaild = await bcrypt.compare(password,user.password)
  if (!isPassVaild) {
    return res.status(400).json({
      message: "Invaild email or password!",
    });
  }

  // all sahi hai to login hoga
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);

  res.status(200).json({
    message: "Login Successfully",
    user:{
        email:user.email,
        fullName:user.fullName,
        _id: user._id
    }
  });
};

module.exports = { register, login };
