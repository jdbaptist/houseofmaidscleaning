const multer = require("multer");
const Service = require("../models/service.model");
const User = require('../models/users.model');
const path = require("path");
let fs = require("fs");
const mailController = require('./mail.controller');

let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/services");
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
}).single("service_image");

exports.createService = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["service_image"],
        message: "Error in file size/extension.",
      });
    }

    const body = req.body;
    body.imageUrl = "services/" + req.fileUrl;
    const service = new Service(body);

    try {
      const result = await service.save();

      //Send Mail To All Cleaner Regarding New Service Added
      const cleaner = await User.aggregate([
         {
           $match: {deleted :false,role:2}
         },
         {
           $group:{
            _id:null,
            mailList: { $addToSet: "$email" }
           }
         }
      ])
     if(cleaner.length > 0 ) {
      let mailList = cleaner[0].mailList
      await mailController.send_allCleaner(mailList,result);
     } 
      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "Service created successfully.",
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
          : "Error while creating service.",
      });
    }
  });
};

// Fetch All Service
exports.fetchServices = async (req, res) => {
  try {
    switch (req.logged_in_user.role) {
      case 0:
        var result = await Service.find({ deleted: false }).sort({
          createdAt: -1,
        });
        break;
      default:
        var result = await Service.find({ deleted: false, active: true }).sort({
          createdAt: -1,
        });
        break;
    }
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching services.",
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
      error_message: "Error while fetching services.",
    });
  }
};

// Fetch All Service
exports.fetchActiveServices = async (req, res) => {
  try {
    var result = await Service.find({ deleted: false, active: true }).sort({
      createdAt: -1,
    });
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching services.",
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
      error_message: "Error while fetching services.",
    });
  }
};

// Fetch Service details by id
exports.fetchServiceById = async (req, res) => {
  const _id = req.params.id;

  try {
    const result = await Service.findById(_id);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching Service - Service ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Service fetched.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching Service - Service ID - Incorrect",
    });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["service_image"],
        message: "Error in file size/extension.",
      });
    }

    const body = req.body;
    let old_image = null;

    if (req.hasOwnProperty("fileUrl")) {
      const service = await Service.findOne({ _id: req.params.id });
      old_image = service.imageUrl;
      body.imageUrl = "services/" + req.fileUrl;
    }

    try {
      const result = await Service.findOneAndUpdate(
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
          message: "Error while updating service.",
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
        message: "Service updated.",
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
        message: "Error while updating service.",
      });
    }
  });
};

// Delete Service
exports.deleteService = async (req, res, next) => {
  const serviceId = req.params.id;
  try {
    const result = await Service.deleteById(serviceId);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while deleting Service - Service ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: serviceId,
      message: "Service deleted.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while deleting Service.",
    });
  }
};
