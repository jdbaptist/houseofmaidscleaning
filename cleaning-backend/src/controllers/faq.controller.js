const FAQ = require("../models/faq.model");

exports.createFaq = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    const result = await faq.save();
    if (!result) {
      throw new Error("Server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "faq created successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while creating FAQ.",
    });
  }
};

exports.fetchFAQs = async (req, res) => {
  try {
    switch (req.logged_in_user.role) {
      case 0:
        var result = await FAQ.find({ deleted: false }).sort({ createdAt: -1 });
        break;
      default:
        var result = await FAQ.find({ deleted: false, active: true }).sort({
          createdAt: -1,
        });
        break;
    }
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "FAQs fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching FAQs",
    });
  }
};

exports.fetchActiveFAQs = async (req, res) => {
  try {
    var result = await FAQ.find({ deleted: false, active: true }).sort({
      createdAt: -1,
    });
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "FAQs fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while fetching FAQs",
    });
  }
};

exports.fetchFAQ = async (req, res) => {
  try {
    const result = await FAQ.findById(req.params.id);
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "FAQ fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status_code: 400,
      status: false,
      error,
      message: error.message ? error.message : "Error while fetching FAQ",
    });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const result = await FAQ.deleteById(req.params.id);
    if (!result) {
      throw new Error("Server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status_code: 400,
      status: false,
      error,
      error_fields,
      message: error.message ? error.message : "Error while deleting FAQ",
    });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const result = await FAQ.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "FAQ updated successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status_code: 400,
      status: false,
      error,
      message: error.message ? error.message : "Error while updating FAQ",
    });
  }
};
