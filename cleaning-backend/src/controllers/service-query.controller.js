const ServiceQuery = require("../models/service-query.model");

exports.createQuery = async (req, res) => {
  try {
    const query = new ServiceQuery(req.body);
    const result = await query.save();
    await ServiceQuery.populate(result, {
      path: "serviceId",
    });

    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Query created successfully",
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

exports.fetchQueries = async (req, res) => {
  try {
    const result = await ServiceQuery.find({
      deleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "serviceId" });
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Queries fetched successfully",
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

exports.fetchQuery = async (req, res) => {
  try {
    const result = await ServiceQuery.findById(req.params.id).populate({
      path: "serviceId",
    });
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Query fetched successfully",
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

exports.updateQuery = async (req, res) => {
  try {
    const result = await ServiceQuery.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    ).populate({ path: "serviceId" });
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Query updated successfully",
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

exports.deleteQuery = async (req, res) => {
  try {
    const result = await ServiceQuery.deleteById(req.params.id);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: "Query deleted successfully",
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
