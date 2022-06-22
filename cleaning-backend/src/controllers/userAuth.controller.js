const multer = require("multer");
const User = require("../models/users.model");
const path = require("path");
let fs = require("fs");
const bcrypt = require("bcryptjs");

/**
 *
 * Upload Profile picture
 *
 */
let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/users");
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
}).single("profile_image");

// Change Password
exports.update_user_password = async (req, res, next) => {
  const user_id = req.logged_in_user._id;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while updating user password - User ID - Incorrect",
      });
    }
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        error: "Credentials are not correct",
        error_fields: ["old_password"],
        message: "Password is not correct.",
      });
    }

    user["password"] = new_password;
    await user.save();
    return res.status(200).send({
      status: true,
      status_code: 200,
      user,
      message: "User Password Changed.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while updating user password.",
    });
  }
};

// Update user profile
exports.update_user_logged_in = async (req, res) => {
  const id = req.logged_in_user._id;
  await upload(req, res, async function (err) {
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
    let old_profile_image = null;

    if (req.hasOwnProperty("fileUrl")) {
      if (req.body.login_provider === "web") {
        if (
          !(
            req.body.profile_image.includes("facebook") ||
            req.body.profile_image.includes("google")
          )
        ) {
          old_profile_image = req.body.profile_image;
        } else {
          old_profile_image = null;
        }
      }
      body.profile_image = "users/" + req.fileUrl;
    }

    if (req.body.details) {
      body.details = JSON.parse(req.body.details);
    }

    try {
      const user = await User.findOneAndUpdate({ _id: id }, body, {
        new: true,
      });

      if (!user) {
        return res.status(200).send({
          status: false,
          status_code: 400,
          error: "No record found.",
          error_fields: [],
          message: "Error while updating user profile.",
        });
      }

      if (old_profile_image != null) {
        let filePath = path.join(__dirname, "../../public/uploads/images");
        filePath += old_profile_image;
        await fs.unlinkSync(filePath);
      }

      return res.status(200).send({
        status: true,
        status_code: 200,
        user,
        message: "User profile updated.",
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
        message: "Error while updating user profile.",
      });
    }
  });
};
