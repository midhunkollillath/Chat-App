const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
// Login
const loginUser = async (req, res) => {
 
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  
  if (user && (password === user.password)) { 
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic:user.pic,
      token: generateToken(user._id),
    };
    res.json(response);
  } else {
    
    res.status(401);
    throw new Error("Invalid UserName or Password");
  }
};

// Registration
const registerUser = async (req, res) => {
  const { name, email, password,pic } = req.body;

  // check for all fields
  if (!name || !email || !password) {
    res.send(400);
    throw Error("All necessary input fields have not been filled");
  }

  // pre-existing user
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    // res.send(405);
    throw new Error("User already Exists");
  }

  // userName already Taken
  const userNameExist = await userModel.findOne({ name });
  if (userNameExist) {
    // res.send(406);
    throw new Error("UserName already taken");
  }

  // create an entry in the db
  const user = await userModel.create({ name, email, password ,pic});
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic:user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
};

const fetchAllUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
};

module.exports ={
  loginUser,
  registerUser,
  fetchAllUser,
};
