const multer = require("multer");
const Testimonial = require("../models/testimonial.model");
const path = require("path");
let fs = require("fs");

let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/testimonials");
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
}).single("testimonial_image");

exports.createTestimonial = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["testimonial_image"],
        message: "Error in file size/extension.",
      });
    }

    const body = req.body;
    body.image = "testimonials/" + req.fileUrl;
    const testimonial = new Testimonial(body);

    try {
      const result = await testimonial.save();
      if (!result) {
        throw new Error("servcer error occured");
      }
      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "Testimonial created successfully.",
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
        message: error.message
          ? error.message
          : "Error while creating testimonial.",
      });
    }
  });
};

// Fetch All Testimonial
exports.fetchTestimonials = async (req, res) => {
  try {
    switch (req.logged_in_user.role) {
      case 0:
        var result = await Testimonial.find({ deleted: false }).sort({
          createdAt: -1,
        });
        break;

      default:
        var result = await Testimonial.find({
          deleted: false,
          active: true,
        }).sort({
          createdAt: -1,
        });
        break;
    }
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching testimonials.",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_message: "Error while fetching testimonials.",
    });
  }
};
// Fetch All Testimonial
exports.fetchActiveTestimonials = async (req, res) => {
  try {
    var result = await Testimonial.find({
      deleted: false,
      active: true,
    }).sort({
      createdAt: -1,
    });
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching testimonials.",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_message: "Error while fetching testimonials.",
    });
  }
};

// Fetch Testimonial details by id
exports.fetchTestimonial = async (req, res) => {
  const _id = req.params.id;

  try {
    const result = await Testimonial.findById(_id);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message:
          "Error while fetching Testimonial - Testimonial ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Testimonial fetched.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching Testimonial - Testimonial ID - Incorrect",
    });
  }
};

// Update Testimonial
exports.updateTestimonial = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["testimonial_image"],
        message: "Error in file size/extension.",
      });
    }

    const body = req.body;
    let old_image = null;

    if (req.hasOwnProperty("fileUrl")) {
      const testimonial = await Testimonial.findOne({ _id: req.params.id });
      old_image = testimonial.imageUrl;
      body.image = "testimonials/" + req.fileUrl;
    }

    try {
      const result = await Testimonial.findOneAndUpdate(
        { _id: req.params.id },
        body,
        {
          new: true,
        }
      );

      if (!result) {
        return res.status(200).send({
          status: false,
          status_code: 400,
          error: "No record found.",
          error_fields: [],
          message: "Error while updating testimonial.",
        });
      }

      if (old_image != null) {
        let filePath = path.join(__dirname, "../../public/uploads/images/");
        filePath += old_image;
        await fs.unlinkSync(filePath);
      }

      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "Testimonial updated.",
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
        message: "Error while updating testimonial.",
      });
    }
  });
};

// Delete Testimonial
exports.deleteTestimonial = async (req, res, next) => {
  const testimonialId = req.params.id;
  try {
    const result = await Testimonial.deleteById(testimonialId);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message:
          "Error while deleting Testimonial - Testimonial ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: testimonialId,
      message: "Testimonial deleted.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while deleting Testimonial.",
    });
  }
};
