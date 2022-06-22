const User = require("../models/users.model");
const ServiceRequest = require("../models/service-request.model");
const Service = require("../models/service.model");

exports.get_stats = async (req, res) => {
  try {
    const customerCount = await User.find({
      deleted: false,
      role: 2,
    }).countDocuments();
    const cleanerCount = await User.find({
      deleted: false,
      role: 1,
    }).countDocuments();
    const requestsCount = await ServiceRequest.find({
      deleted: false,
    }).countDocuments();
    const servicesCount = await Service.find({
      deleted: false,
    }).countDocuments();
    res.status(200).send({
      status: true,
      status_code: 200,
      stats: {
        customerCount,
        cleanerCount,
        requestsCount,
        servicesCount,
      },
    });
  } catch (error) {
    res.status(200).send({
      status: false,
      status_code: 400,
      error: {
        customerCount: 0,
        cleanerCount: 0,
        requestsCount: 0,
        servicesCount: 0,
      },
      message: "Error - While fetching stats.",
    });
  }
};

exports.test_api = async (req, res) => {
  res.status(200).send({
    status: true,
    status_code: 200,
    message: "This is testing route.",
  });
};
