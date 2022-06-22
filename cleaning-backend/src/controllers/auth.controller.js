const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Admin Only
exports.auth_user_login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    console.log("user",user)
    if (user == null) {
      throw new Error("Username/Password combination is invalid.");
    }
    // if (user.role === 1) {
    //     throw new Error('Username/Password combination is invalid.');
    // }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Username/Password combination is invalid.");
    }

    // Generate JWT token
    const token = await jwt.sign(
      { _id: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP }
    );
    // Removing password from user result
    filter_user = user.toClean();
    filter_user.token = token;

    return res.status(200).send({
      status: true,
      status_code: 200,
      user: filter_user,
      message: "User Logged In",
    });
  } catch (error) {
    console.log(error)
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message,
    });
  }
};
