const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Project = require("../models/project.model");
const { populate } = require("../models/project.model");
const Blog = require("../models/blog.model");
const { dirname } = require("path");

let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/projects");
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
}).single("project_image");

exports.createProject = async (req, res) => {
  await upload(req, res, async (err) => {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["project_image"],
        message: "Error in file size/extension",
      });
    }

    const body = req.body;
    body.image = "projects/" + req.fileUrl;

    const project = new Project(body);
    try {
      const result = await project.save();
      await Project.populate(result, { path: "serviceType" });

      if (!result) {
        throw new Error("server error occured");
      }
      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "Project created successfully",
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
          : "Error while creating project.",
      });
    }
  });
};

exports.fetchProjects = async (req, res) => {
  try {
    switch (req.logged_in_user.role) {
      case 0:
        var result = await Project.find({
          deleted: false,
        })
          .sort({ createdAt: -1 })
          .populate({ path: "serviceType" });
        break;

      default:
        var result = await Project.find({
          deleted: false,
          active: true,
        })
          .sort({ createdAt: -1 })
          .populate({ path: "serviceType" });
        break;
    }
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while fetching projects",
    });
  }
};

exports.fetchActiveProjects = async (req, res) => {
  try {
    var result = await Project.find({
      deleted: false,
      active: true,
    }).sort({ createdAt: -1 });
    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while fetching projects",
    });
  }
};

exports.fetchProject = async (req, res) => {
  try {
    const result = await Project.findById(req.params.id).populate({
      path: "serviceType",
    });

    if (!result) {
      throw new Error("server error occured");
    }
    if (result.deleted) {
      throw new Error("Project has been deleted");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Project fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while fetching project",
    });
  }
};

exports.updateProject = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["blog_image"],
        message: "Error in file size/extension.",
      });
    }
    const body = req.body;
    let oldImage = null;

    if (req.hasOwnProperty("fileUrl")) {
      const project = await Project.findById(req.params.id);
      oldImage = project.image;
      body.image = "projects/" + req.fileUrl;
    }

    try {
      const result = await Project.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        body,
        { new: true }
      );
      if (!result) {
        throw new Error("Error while updating project");
      }

      if (oldImage) {
        try {
          let filePath = path.join(__dirname, "../../public/uploads/images/");
          filePath += oldImage;
          await fs.unlinkSync(filePath);
        } catch (error) {}
      }
      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "project updated.",
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
        message: "Error while updating project.",
      });
    }
  });
};

exports.deleteProject = async (req, res) => {
  try {
    const result = await Project.deleteById(req.params.id);

    if (!result) {
      throw new Error("server error occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message || "Error while deleting project",
    });
  }
};
