const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const authUser = async (req, res, next) => {
  try {
    const custom_header = req.header("X-custom-header");
    const token = req.header("Authorization");

    if (custom_header !== process.env.CUSTOM_HEADER) {
      throw new Error("Error - Header");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode._id });
    if (!user) {
      throw new Error("Error - Identity");
    }
    if (user.role === 0) {
      throw new Error("Error - Type");
    }
    if (user.profile_status == "-2") {
      throw new Error("Error - Your account has been deleted permanently");
    }
    // To use in next route
    req.logged_in_token = token;
    req.logged_in_user = user;
    next();
  } catch (error) {
    res.status(403).send({
      status: false,
      status_code: 403,
      error: error,
      message: error.message,
    });
  }
};

module.exports = authUser;
