const multer = require("multer");
const ServiceRequest = require("../models/service-request.model");
const User = require("../models/users.model");
const NotificationController = require("./notificationsController");
const mailController = require("./mail.controller");
// const path = require("path");
// let fs = require("fs");
const randomstring = require("randomstring");
var ObjectId = require('mongodb').ObjectID;

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
      case "captureImage":
        cb(null, "./public/uploads/images/users/captureImage");
        break;
      case "captureImage2":
        cb(null, "./public/uploads/images/users/captureImage");
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
}).fields([{ name: "captureImage" }, { name: "captureImage2" }]);


exports.createServiceRequest = async (req, res) => {
  try {
     
    const query = new ServiceRequest(req.body);
    // const alpha = randomstring.generate({length: 3,charset: "abcdefghijklmnopqrstuvwxyz",});
    const numeric = randomstring.generate({length: 8,charset: "0123456789",});
    query.orderId =  numeric
    query.customerId = req.logged_in_user._id;
    
    //check cleaner for existing service
    const users = await User.find({available: true, serviceId:query.serviceType});

    let userIds = [];
    users.filter(async (user) => {
      userIds.push(user._id);
    });
    
    const result = await query.save();

    if (!result) {
      throw new Error("server error occured");
    }
    
    //sent notification to all existing service provider
    const notification = {notificationType: "request",serviceRequestId: query._id, users: userIds };
    await NotificationController.createNotification(notification);

    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Service Request created successfully",
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
      message: "Error while creating query.",
    });
  }
};

exports.fetchServiceRequests = async (req, res) => {
  try {
    let populateQuery = [
      { path: "customerId" },
      { path: "acceptedBy" },
      { path: "serviceType" },
      { path: "servicePackage" },
    ];
    const result = await ServiceRequest.find({
      deleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .populate(populateQuery);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "ServiceRequest fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

exports.fetchServiceRequest = async (req, res) => {
  try {
    let populateQuery = [
      { path: "customerId" },
      { path: "acceptedBy" },
      { path: "serviceType" },
      { path: "servicePackage" },
    ];
    const result = await ServiceRequest.findById(req.params.id).populate(
      populateQuery
    );
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceRequest fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

exports.fetchServiceRequestsUpcoming = async (req, res) => {
  // console.log('hjddjhjz<h');
  try {
    console.log(req.logged_in_user._id, Date());
    let populateQuery = [
      { path: "customerId" },
      { path: "acceptedBy" },
      { path: "serviceType" },
      { path: "servicePackage" },
    ];
    var result = await ServiceRequest.find({
      deleted: false,
      workStatus: 1,
      // workStatus: { $in: [3, -1] },
      acceptedBy: req.logged_in_user._id,
      dateOfService: { $gte: new Date() },
    })
      .sort({
        dateOfService: 1,
      })
      .populate(populateQuery);
    // console.log(result);
    if (!result) {
      throw new Error("server error occured");
    } else if (result.length != 0) {
      // result = result[0];
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceRequestsUpcoming fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

exports.updateServiceRequest = async (req, res) => {
  try {
    let populateQuery = [
      { path: "customerId" },
      { path: "acceptedBy" },
      { path: "serviceType" },
      { path: "servicePackage" },
    ];
    const result = await ServiceRequest.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    ).populate(populateQuery);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "ServiceRequest updated successfully",
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
      message: "Error while creating query.",
    });
  }
};

exports.acceptByAdminServiceRequest = async (req, res) => {
  let data = {};
  console.log(req.body);
  try {
    let user = await User.findOne({
      _id: req.body.cleanerId,
    });
    console.log("user", user);
    let cutOff = 33.3 / 100;
    let totalValue = req.body.amount - req.body.amount * cutOff;
    let newPayment = totalValue.toFixed(0);
    let wallet = 0;
    if (user.wallet) {
      console.log("m here");
      wallet = parseInt(user.wallet) + parseInt(newPayment);
    } else {
      wallet = newPayment;
    }
    console.log(wallet);
    data.User = await User.findOneAndUpdate(
      {
        _id: req.body.cleanerId,
      },
      { wallet: wallet }
    );
    console.log(data.User);
    let populateQuery = [
      { path: "customerId" },
      { path: "acceptedBy" },
      { path: "serviceType" },
      { path: "servicePackage" },
    ];
    data.ServiceRequest = await ServiceRequest.findOneAndUpdate(
      {
        _id: req.body.serviceId,
      },
      { paidToCleaner: true },
      { new: true }
    ).populate(populateQuery);
    if (!data) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      data,
      message: "ServiceRequest updated successfully",
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
      message: "Error while creating query.",
    });
  }
};
exports.rejectByAdminServiceRequest = async (req, res) => {
  // let data = {};
  try {
    let result = await mailController.send_html(req.body.email);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "ServiceRequest updated successfully",
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
      message: "Error while creating query.",
    });
  }
};
exports.updateServiceRequestBilling = async (req, res) => {
  // var id = req.body.id;
  // console.log(id);
  upload(req, res, async (err) => {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["captureImage"],
        message: "Error in file size/extension.",
      });
    }
    let body = req.body;
    let id = req.body.id;
    console.log(id, req.files);
    let captureImage = null;
    let captureImage2 = null;
    const project = await ServiceRequest.findById(id);
    console.log(project);
    if (req.files && req.files["captureImage2"]) {
      console.log("mmmm");
      captureImage2 = project.captureImage2 || null;
      body.captureImage2 =
        "users/captureImage/" + req.files["captureImage2"][0].filename;
    }
    if (req.files && req.files["captureImage"]) {
      console.log("mmmm2");
      captureImage = project.captureImage || null;
      console.log(captureImage);
      body.captureImage =
        "users/captureImage/" + req.files["captureImage"][0].filename;
    }
    console.log(body);
    try {
      const result = await ServiceRequest.findOneAndUpdate(
        {
          _id: id,
        },
        body,
        { new: true }
      );
      // await User.populate(result, { path: 'serviceId' });
      if (!result) {
        throw new Error("Error while updating user");
      }
      // if (captureImage) {
      // 	try {
      // 		let filePath = path.join(__dirname, '../../public/uploads/images/');
      // 		filePath += oldImage;
      // 		await fs.unlinkSync(filePath);
      // 	} catch (error) {}
      // }
      // if (idCardUrl) {
      // 	try {
      // 		let filePath = path.join(__dirname, '../../public/uploads/images/');
      // 		filePath += idCardUrl;
      // 		await fs.unlinkSync(filePath);
      // 	} catch (error) {}
      // }
      // if (drivingLicenseUrl) {
      // 	try {
      // 		let filePath = path.join(__dirname, '../../public/uploads/images/');
      // 		filePath += drivingLicenseUrl;
      // 		await fs.unlinkSync(filePath);
      // 	} catch (error) {}
      // }
      // if (otherIdUrl) {
      // 	try {
      // 		let filePath = path.join(__dirname, '../../public/uploads/images/');
      // 		filePath += otherIdUrl;
      // 		await fs.unlinkSync(filePath);
      // 	} catch (error) {}
      // }

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
        message: "Error while updating captureImage.",
      });
    }
  });
};

exports.deleteServiceRequest = async (req, res) => {
  try {
    const result = await ServiceRequest.deleteById(req.params.id);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: "ServiceRequest  deleted successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

exports.createRejectedServiceRequest = async (req, res) => {
  try {
    const Servicerequest = await ServiceRequest.findById(req.params.id);

    const result = await Servicerequest.save();
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceRequest fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

exports.createAcceptedServiceRequest = async (req, res) => {
  try {
    let populateQuery = [
      { path: "customerId" },
      { path: "acceptedBy" },
      { path: "serviceType" },
      { path: "servicePackage" },
    ];
    const result = await ServiceRequest.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    ).populate(populateQuery);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceRequest fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

// Cleaner
exports.fetchCleanerAcceptedBookings = async (req, res) => {
  try {
    // const customerId = '5f3a2436e9805635abe3ad2c';
    let sort = req.query.sort;
    let by = req.query.by;
    let page = req.query.page;
    let search = req.query.search;

    // For Page
    if (!page || page == "undefined") {
      page = 1;
    }

    let options = {
      page: page,
      limit: 5,
      populate: [
        { path: "customerId" },
        { path: "acceptedBy" },
        { path: "serviceType" },
        { path: "servicePackage" },
      ],
    };

    if (sort && sort != "undefined") {
      if (sort === "mode") {
        sort = "mode_of_payment.channel";
      }
      const sortObj = {};
      if (by && by != "undefined") {
        sortObj[sort] = by;
      } else {
        sortObj[sort] = 1;
      }
      options.sort = sortObj;
    } else {
      options.sort = {
        createdAt: -1,
      };
    }

    const result = await ServiceRequest.paginate(
      {
        deleted: false,
        workStatus: 1,
        // workStatus: { $in: [3, -1] },
        acceptedBy: req.logged_in_user._id,
        // acceptedBy: customerId,
      },
      options
    );
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceAcceptedRequests fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};
exports.fetchCleanerWorkHistory = async (req, res) => {
  try {
    // const customerId = '5f3a2436e9805635abe3ad2c';
    let sort = req.query.sort;
    let by = req.query.by;
    let page = req.query.page;
    let search = req.query.search;

    // For Page
    if (!page || page == "undefined") {
      page = 1;
    }

    let options = {
      page: page,
      limit: 10,
      populate: [
        { path: "customerId" },
        { path: "acceptedBy" },
        { path: "serviceType" },
        { path: "servicePackage" },
      ],
    };

    if (sort && sort != "undefined") {
      if (sort === "mode") {
        sort = "mode_of_payment.channel";
      }
      const sortObj = {};
      if (by && by != "undefined") {
        sortObj[sort] = by;
      } else {
        sortObj[sort] = 1;
      }
      options.sort = sortObj;
    } else {
      options.sort = {
        createdAt: -1,
      };
    }

    const result = await ServiceRequest.paginate(
      {
        deleted: false,
        workStatus: { $in: [3, -1] },
        acceptedBy: req.logged_in_user._id,
        // acceptedBy: customerId,
      },
      options
    );
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceAcceptedRequests fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

// Customer
exports.fetchCustomerBookingHistory = async (req, res) => {
  try {
    // const customerId = "5f3a23f1e9805635abe3ad28";
    let sort = req.query.sort;
    let by = req.query.by;
    let page = req.query.page;
    let search = req.query.search;

    // For Page
    if (!page || page == "undefined") {
      page = 1;
    }

    let options = {
      page: page,
      limit: 10,
      populate: [
        { path: "customerId" },
        { path: "acceptedBy" },
        { path: "serviceType" },
        { path: "servicePackage" },
      ],
    };

    if (sort && sort != "undefined") {
      if (sort === "mode") {
        sort = "mode_of_payment.channel";
      }
      const sortObj = {};
      if (by && by != "undefined") {
        sortObj[sort] = by;
      } else {
        sortObj[sort] = 1;
      }
      options.sort = sortObj;
    } else {
      options.sort = {
        createdAt: -1,
      };
    }

    const result = await ServiceRequest.paginate(
      {
        deleted: false,
        workStatus: { $in: [3, -1] },
        customerId: req.logged_in_user._id,
        // customerId: customerId,
      },
      options
    );

    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      page,
      search,
      sort,
      by,
      message: "fetch Service Accepted Requests fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};
exports.fetchCustomerBookedServices = async (req, res) => {
  try {
    let sort = req.query.sort;
    let by = req.query.by;
    let page = req.query.page;
    let search = req.query.search;

    // For Page
    if (!page || page == "undefined") {
      page = 1;
    }

    let options = {
      page: page,
      limit: 4,
      populate: [
        { path: "customerId" },
        { path: "acceptedBy" },
        { path: "serviceType" },
        { path: "servicePackage" },
      ],
    };

    if (sort && sort != "undefined") {
      if (sort === "mode") {
        sort = "mode_of_payment.channel";
      }
      const sortObj = {};
      if (by && by != "undefined") {
        sortObj[sort] = by;
      } else {
        sortObj[sort] = 1;
      }
      options.sort = sortObj;
    } else {
      options.sort = {
        createdAt: -1,
      };
    }

    const result = await ServiceRequest.paginate({
        deleted: false,
        workStatus: { $in: [0, 1, 2] },
        customerId: req.logged_in_user._id,
      },
      options
    );
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "fetchServiceAcceptedRequests fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching queries.",
    });
  }
};

// exports.createWorkInProgressServiceRequest = async (req, res) => {
//   try {
//     let populateQuery = [{path:'customerId'}, {path:'acceptedBy'},{path:'serviceType'},{path:'servicePackage'}];
//     const result = await ServiceRequest.findOneAndUpdate(
//       {
//         _id: req.params.id,
//       },
//       req.body,
//       { new: true }
//     ).populate(populateQuery);
//     if (!result) {
//       throw new Error("server error occured");
//     }
//     return res.status(200).send({
//       status: true,
//       status_code: 200,
//       result,
//       message: "createWorkInProgressServiceRequest fetched successfully",
//     });
//   } catch (error) {
//     return res.status(200).send({
//       status: false,
//       status_code: 400,
//       error,
//       message: "Error while fetching queries.",
//     });
//   }
// };

// exports.createCompleteServiceRequest = async (req, res) => {
//   try {
//     let populateQuery = [{path:'customerId'}, {path:'acceptedBy'},{path:'serviceType'},{path:'servicePackage'}];
//     const result = await ServiceRequest.findOneAndUpdate(
//       {
//         _id: req.params.id,
//       },
//       req.body,
//       { new: true }
//     ).populate(populateQuery);
//     if (!result) {
//       throw new Error("server error occured");
//     }
//     return res.status(200).send({
//       status: true,
//       status_code: 200,
//       result,
//       message: "createCompleteServiceRequest fetched successfully",
//     });
//   } catch (error) {
//     return res.status(200).send({
//       status: false,
//       status_code: 400,
//       error,
//       message: "Error while fetching queries.",
//     });
//   }
// };
