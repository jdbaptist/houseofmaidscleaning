const Content = require("../models/content.model");

exports.createContent = async (req, res) => {
  try {
    const aboutUs = new Content(req.body);
    const result = await aboutUs.save();
    if (!result) {
      throw new Error("Server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "data created successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while creating data",
    });
  }
};

// exports.fetchesContent = async (req, res) => {
//   try {
//     const result = await Content.find({ deleted: false }).sort({ createdAt: -1 });
//     if (!result) {
//       throw new Error('server error occured');
//     }
//     return res.status(200).send({
//       status: true,
//       status_code: 200,
//       result,
//       message: 'fetchesContents fetched successfully',
//     });
//   } catch (error) {
//     return res.status(200).send({
//       status: false,
//       status_code: 400,
//       error,
//       message: error.message ? error.message : 'Error while fetching fetchesContents',
//     });
//   }
// };

exports.fetcheContents = async (req, res) => {
  try {
    const result = await Content.find();
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "data fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status_code: 400,
      status: false,
      error,
      message: error.message ? error.message : "Error while fetching data",
    });
  }
};

exports.fetcheContent = async (req, res) => {
  try {
    const result = await Content.findOne({ page: req.params.page });
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "data fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status_code: 400,
      status: false,
      error,
      message: error.message ? error.message : "Error while fetching data",
    });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const result = await Content.findOneAndUpdate(
      { page: req.params.page },
      req.body,
      {
        new: true,
        upsert: true,
      }
    );
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "data updated successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status_code: 400,
      status: false,
      error,
      message: error.message ? error.message : "Error while updating data",
    });
  }
};

// exports.deleteContent = async (req, res) => {
//   try {
//     const result = await Content.delete({name:req.params.name});
//     if (!result) {
//       throw new Error('Server error occured');
//     }
//     return res.status(200).send({
//       status: true,
//       status_code: 200,
//       result: req.params.id,
//       message: 'data deleted successfully',
//     });
//   } catch (error) {
//     return res.status(200).send({
//       status_code: 400,
//       status: false,
//       error,
//       error_fields,
//       message: error.message ? error.message : 'Error while deleting data',
//     });
//   }
// }
