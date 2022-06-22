const multer = require("multer");
const User = require("../models/users.model");
const path = require("path");
let fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailController = require("./mail.controller");
/**
 *
 * Upload Profile picture
 *
 */
let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    switch (file.fieldname) {
      case "profile_image":
        cb(null, "./public/uploads/images/users");
        break;
      case "idCardUrl":
        cb(null, "./public/uploads/images/users/idCards");
        break;
      case "drivingLicenseUrl":
        cb(null, "./public/uploads/images/users/drivingLicenses");
        break;
      case "otherIdUrl":
        cb(null, "./public/uploads/images/users/otherIds");
        break;

      default:
        break;
    }
  },
  filename: function (req, file, cb) {
    let datetimestamp = Date.now();
    const tempFileName =
      file.fieldname +
      "-" +
      datetimestamp +
      "." +
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    req.fileUrl = tempFileName;
    cb(null, tempFileName);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 2097152, // in bytes 2MB
  },
  onFileUploadStart: function (file) {
    const fileMime = file.mimetype;
    const fileMimeSplit = fileMime.split("/");
    if (fileMimeSplit[0] == "image") {
      cb(null, true);
    } else {
      cb(new Error("Please upload only jpg|jpeg|png."));
    }
  },
}).fields([
  { name: "profile_image" },
  { name: "idCardUrl" },
  { name: "drivingLicenseUrl" },
  { name: "otherIdUrl" },
]);

exports.createUser = async (req, res) => {
  await upload(req, res, async (err) => {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["profile_image"],
        message: "Error in file size/extension",
      });
    }
    try {
      const body = req.body;
      if (req.files && req.files["profile_image"]) {
        body.profileImage = "users/" + req.files["profile_image"][0].filename;
      }
      if (req.files && req.files["idCardUrl"]) {
        body.idCardUrl = "users/idCards/" + req.files["idCardUrl"][0].filename;
      }
      if (req.files && req.files["drivingLicenseUrl"]) {
        body.drivingLicenseUrl =
          "users/drivingLicenses/" + req.files["drivingLicenseUrl"][0].filename;
      }
      if (req.files && req.files["otherIdUrl"]) {
        body.otherIdUrl =
          "users/otherIds/" + req.files["otherIdUrl"][0].filename;
      }
      const user = new User(body);
      const result = await user.save();
      await User.populate(result, { path: "serviceId" });
      if (!result) {
        throw new Error("server error occured");
      }
      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "User created successfully",
      });
    } catch (error) {
      let error_fields = [];
      if (error.hasOwnProperty("errors")) {
        for (let key in error.errors) {
          error_fields.push(key);
        }
      }
      return res.status(200).send({
        status: false,
        status_code: 400,
        error,
        error_fields,
        message: error.message ? error.message : "Error while create user.",
      });
    }
  });
};
exports.fetchUsers = async (req, res) => {
  try {
    const result = await User.find({
      deleted: false,
      role: 1,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "serviceId" });

    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while fetching users",
    });
  }
};

exports.fetchUser = async (req, res) => {
  try {
    switch (req.logged_in_user.role) {
      case 0:
        var result = await User.findById(req.params.id).populate({
          path: "serviceId",
        });
        break;

      default:
        var result = await User.findById(req.logged_in_user._id).populate({
          path: "serviceId",
        });
        break;
    }
    if (!result) {
      throw new Error("server error occured");
    }
    if (result.deleted) {
      throw new Error("User has been deleted");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while fetching user",
    });
  }
};

exports.updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["profile_image"],
        message: "Error in file size/extension.",
      });
    }
    const body = req.body;
    let oldImage = null;
    let idCardUrl = null;
    let drivingLicenseUrl = null;
    let otherIdUrl = null;
    const project = await User.findById(req.params.id);
    if (req.files && req.files["profile_image"]) {
      oldImage = project.profileImage;
      body.profileImage = "users/" + req.files["profile_image"][0].filename;
    }
    if (req.files && req.files["idCardUrl"]) {
      idCardUrl = project.idCardUrl;
      body.idCardUrl = "users/idCards/" + req.files["idCardUrl"][0].filename;
    }
    if (req.files && req.files["drivingLicenseUrl"]) {
      drivingLicenseUrl = project.drivingLicenseUrl;
      body.drivingLicenseUrl =
        "users/drivingLicenses/" + req.files["drivingLicenseUrl"][0].filename;
    }
    if (req.files && req.files["otherIdUrl"]) {
      otherIdUrl = project.otherIdUrl;
      body.otherIdUrl = "users/otherIds/" + req.files["otherIdUrl"][0].filename;
    }
    try {
      const result = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        body,
        { new: true }
      );
      await User.populate(result, { path: "serviceId" });
      if (!result) {
        throw new Error("Error while updating user");
      }
      if (oldImage) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += oldImage;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }
      if (idCardUrl) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += idCardUrl;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }
      if (drivingLicenseUrl) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += drivingLicenseUrl;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }
      if (otherIdUrl) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += otherIdUrl;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }

      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "user updated.",
      });
    } catch (error) {
      let error_fields = [];
      if (error.hasOwnProperty("errors")) {
        for (let key in error.errors) {
          error_fields.push(key);
        }
      }

      return res.status(200).send({
        status: false,
        status_code: 400,
        error,
        error_fields,
        message: "Error while updating user.",
      });
    }
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.deleteById(req.params.id);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while deleting user",
    });
  }
};

exports.fetchCleaners = async (req, res) => {
  try {
    const result = await User.find({
      deleted: false,
      role: 2,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "serviceId" });

    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while fetching users",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let email = req.body.email;
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false
    });
    let user = await User.findOne({ email: email });
    if (!user || user.role == 0) {
      throw new Error("email address is not registered with us");
    }
    const result = await User.findOneAndUpdate({ _id: user._id }, { resetToken: otp }, { new: true });

    if (!result) {
      throw new Error("server error occured");
    }
    mailController.send_otp(email, otp);
    return res.status(200).send({
      status: true,
      status_code: 200,
      // result: `http://localhost:4200/verify-token?token=${otp}`,
      message: "Email Fetch uccessfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching EMAIL.",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let result = await User.findOne({ resetToken: req.body.otp, deleted: false });
    if (!result) {
      throw new Error("Sorry Please Enter Correct Otp");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: result._id,
      message: "Otp Verify uccessfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching EMAIL.",
    });
  }
}

exports.verifyResetLink = async (req, res) => {
  try {
    let token = req.body.token;
    let result = await User.findOneAndUpdate(
      { resetToken: token },
      { resetToken: "" }
    );
    if (!result) {
      throw new Error("invalid url");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: result._id,
      message: "Email Fetch uccessfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching EMAIL.",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const result = await User.findOneAndUpdate({ _id: req.params.id }, { verified: true }, { new: true });
    if (!result) {
      throw new Error("server error occured");
    }
    res.redirect("https://houseofmaidscleaningservices.co.uk/auth/login");
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching EMAIL.",
    });
  }
}

exports.resentOtp = async (req, res) => {
  try {
    let email = req.body.email;
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    let user = await User.findOne({ email: email });
    if (!user || user.role == 0) {
      throw new Error("email address is not registered with us");
    }

    const result = await User.findOneAndUpdate({ _id: user._id }, { resetToken: otp }, { new: true });
    if (!result) {
      throw new Error("Server Error Occured");
    }
    mailController.send_otp(email, otp);
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: `http://localhost:4200/verify-token?token=${otp}`,
      message: "Email Fetch uccessfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching resent OTP.",
    });
  }
};

exports.forgotPasswordUpdated = async (req, res) => {
  try {
    let change = req.body.password;
    let password = await bcrypt.hash(change, 8);
    let result = await User.findByIdAndUpdate(
      req.body.id,
      { $set: { password: password } },
      { new: true }
    );
    if (!result) {
      throw new Error("Server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "paasword updated uccessfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while updated password.",
    });
  }
};

exports.updateUserProifle = async (req, res) => {
  var id = req.logged_in_user._id;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["profile_image"],
        message: "Error in file size/extension.",
      });
    }
    const body = req.body;
    let oldImage = null;
    let idCardUrl = null;
    let drivingLicenseUrl = null;
    let otherIdUrl = null;
    const project = await User.findById(id);
    if (req.files && req.files["profile_image"]) {
      oldImage = project.profileImage;
      body.profileImage = "users/" + req.files["profile_image"][0].filename;
    }
    if (req.files && req.files["idCardUrl"]) {
      idCardUrl = project.idCardUrl;
      body.idCardUrl = "users/idCards/" + req.files["idCardUrl"][0].filename;
    }
    if (req.files && req.files["drivingLicenseUrl"]) {
      drivingLicenseUrl = project.drivingLicenseUrl;
      body.drivingLicenseUrl =
        "users/drivingLicenses/" + req.files["drivingLicenseUrl"][0].filename;
    }
    if (req.files && req.files["otherIdUrl"]) {
      otherIdUrl = project.otherIdUrl;
      body.otherIdUrl = "users/otherIds/" + req.files["otherIdUrl"][0].filename;
    }
    try {
      const result = await User.findOneAndUpdate(
        {
          _id: id,
        },
        body,
        { new: true }
      );
      await User.populate(result, { path: "serviceId" });
      if (!result) {
        throw new Error("Error while updating user");
      }
      if (oldImage) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += oldImage;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }
      if (idCardUrl) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += idCardUrl;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }
      if (drivingLicenseUrl) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += drivingLicenseUrl;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }
      if (otherIdUrl) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += otherIdUrl;
          await fs.unlinkSync(filePath);
        } catch (error) { }
      }

      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "user updated.",
      });
    } catch (error) {
      let error_fields = [];
      if (error.hasOwnProperty("errors")) {
        for (let key in error.errors) {
          error_fields.push(key);
        }
      }

      return res.status(200).send({
        status: false,
        status_code: 400,
        error,
        error_fields,
        message: "Error while updating user.",
      });
    }
  });
};

exports.changePassword = async (req, res) => {
  try {
    let changePassword = await User.findById(req.logged_in_user._id).populate({
      path: "serviceId",
    });
    let oldpassword = req.body.oldpassword;
    const isMatch = await bcrypt.compare(oldpassword, changePassword.password);
    if (!isMatch) {
      throw new Error("Your old password combination is invalid.");
    }
    if (isMatch) {
      let newpassword = req.body.newpassword;
      let password = await bcrypt.hash(newpassword, 8);
      var result = await User.findByIdAndUpdate(
        req.logged_in_user,
        { $set: { password: password } },
        { new: true }
      );
    }
    if (!result) {
      throw new Error("Server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "paasword changed uccessfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while changed password.",
    });
  }
};

exports.register = async (req, res) => {
  try {
    let ExistingEmail = await User.findOne({ email: req.body.email });
    let ExistingPhone = await User.findOne({ phone: req.body.phone });
    if (ExistingEmail) {
      throw new Error("Email Already Exist");
    }
    if (ExistingPhone) {
      throw new Error("Phone Already Exist");
    }
    const user = new User(req.body);
    const result = await user.save();
    mailController.send_registered(result);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "User created successfully",
    });
  } catch (error) {
    let error_fields = [];
    if (error.hasOwnProperty("errors")) {
      for (let key in error.errors) {
        error_fields.push(key);
      }
    }
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_fields,
      message: error.message ? error.message : "Error while create user.",
    });
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email :email,role: parseInt(req.body.type)});
    if (user == null) {
      throw new Error("Email is not registered.");
    }
    if (user.role === 0) {
      throw new Error("Username/Password combination is invalid.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Username/Password combination is invalid.");
    }
    if (user.profile_status == "-1") {
      await User.findOneAndUpdate(
        { email },
        {
          profile_status: 1,
        }
      );
    }
    if (user.profile_status == "-2") {
      throw new Error(
        "Your account has been deleted, please contact customer support."
      );
    }
    if (user.verified == false) {
      throw new Error("Please Verify Your Account");
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
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message,
    });
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    let body = {
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      firstname: req.body.firstname,
      facebookId: req.body.facebookId,
      role:req.body.role
    }
    // Checking Exsistence email and phone
    let ExistingUser = await User.findOne({ email: body.email });
    if (ExistingUser) {
	
         if(ExistingUser.role == parseInt(req.body.role)) {
			 console.log("Match Successfully")
		   // Generate JWT token
           const token = await jwt.sign(
          { _id: ExistingUser._id.toString(), username: ExistingUser.firstname },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXP }
         );

       // Removing password from user result
       filter_user = ExistingUser.toClean();
       filter_user.token = token;

       return res.status(200).send({
        status: true,
        status_code: 200,
        user: filter_user,
        message: "User Logged In",
       });
       } else {
		   console.log("Not Match")
	   if(ExistingUser.role == 1) {
			   return res.status(200).send({
                 status: false,
                 status_code: 400,
                 message: "This Email Already Registered With Customer",
              });
			 }
			 if(ExistingUser.role == 2) {
			   return res.status(200).send({
                 status: false,
                 status_code: 400,
                 message: "This Email Already Registered With Cleaner",
              });
			 } 
	   }
     
    } else {

      body.verified = true
      let user = await new User(body);
      let creatUser = await user.save();

      // Generate JWT token
      const token = await jwt.sign(
        { _id: creatUser._id.toString(), username: creatUser.firstname },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXP }
      );

      // Removing password from user result
      filter_user = creatUser.toClean();
      filter_user.token = token;

      return res.status(200).send({
        status: true,
        status_code: 200,
        user: filter_user,
        message: "User Logged In",
      });
    }
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message,
    });
  }
}

exports.googleLogin = async (req, res) => {
  try {
    let body = {
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      firstname: req.body.firstname,
      googleId: req.body.googleId,
      role:req.body.role
    }
    // Checking Exsistence Email and Phone
    let ExistingUser = await User.findOne({ email: body.email });
    if (ExistingUser) {
		//check role
         if(ExistingUser.role == parseInt(req.body.role)) {
		   // Generate JWT token
           const token = await jwt.sign(
          { _id: ExistingUser._id.toString(), username: ExistingUser.firstname },
             process.env.JWT_SECRET,
           { expiresIn: process.env.JWT_EXP }
          );

          // Removing password from user result
          filter_user = ExistingUser.toClean();
          filter_user.token = token;

         return res.status(200).send({
             status: true,
            status_code: 200,
            user: filter_user,
            message: "User Logged In",
          });
		 } else {
		    if(ExistingUser.role == 1) {
			   return res.status(200).send({
                 status: false,
                 status_code: 400,
                 message: "This Email Already Registered With Customer",
              });
			 }
			 if(ExistingUser.role == 2) {
			   return res.status(200).send({
                 status: false,
                 status_code: 400,
                 message: "This Email Already Registered With Cleaner",
              });
			 } 
		 }        
    } else {

      body.verified = true
      let user = await new User(body);
      let creatUser = await user.save();

      // Generate JWT token
      const token = await jwt.sign(
        { _id: creatUser._id.toString(), username: creatUser.firstname },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXP }
      );

      // Removing password from user result
      filter_user = creatUser.toClean();
      filter_user.token = token;

      return res.status(200).send({
        status: true,
        status_code: 200,
        user: filter_user,
        message: "User Logged In",
      });
    }
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message,
    });
  }
}

// db.users.aggregate([
//   {
//     $match: {
//       _id: ObjectId("5f3a1ff9e9805635abe3ad1e"),
//     },
//   },
//   {
//     $lookup: {
//       from: "blogs",
//       localField: "_id",
//       foreignField: "publishedBy",
//       as: "blogs",
//     },
//   },
// ]);
