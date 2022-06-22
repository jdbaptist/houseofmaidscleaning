const multer = require("multer");
const Blog = require("../models/blog.model");
const path = require("path");
let fs = require("fs");

let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/blogs");
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
}).single("blog_image");

exports.createBlog = async (req, res) => {
  await upload(req, res, async function (err) {
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
    body.imageUrl = "blogs/" + req.fileUrl;
    body.publishedBy = req.logged_in_user._id;
    // body.tags = body.tags.split(',');
    const blog = new Blog(body);

    try {
      const result = await blog.save();
      await Blog.populate(result, [
        { path: "publishedBy" },
        { path: "serviceType" },
        { path: "comments.userId" },
      ]);
      if (!result) {
        throw new Error("servcer error occured");
      }
      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "Blog created successfully.",
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
        message: error.message ? error.message : "Error while creating blog.",
      });
    }
  });
};

// Fetch All Blog
exports.fetchBlogs = async (req, res) => {
  try {
    switch (req.logged_in_user.role) {
      case 0:
        var result = await Blog.find({ deleted: false })
          .sort({
            createdAt: -1,
          })
          .populate([
            { path: "serviceType" },
            { path: "publishedBy" },
            { path: "comments.userId" },
          ]);
        break;

      default:
        var result = await Blog.find({ deleted: false, active: true })
          .sort({
            createdAt: -1,
          })
          .populate([{ path: "serviceType" }, { path: "publishedBy" }]);
        break;
    }
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching blogs.",
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
      error_message: "Error while fetching blogs.",
    });
  }
};

// Fetch All Blog
exports.fetchActiveBlogs = async (req, res) => {
  try {
    const result = await Blog.find({ deleted: false, active: true })
      .sort({
        createdAt: -1,
      })
      .populate([
        { path: "serviceType" },
        { path: "publishedBy" },
        { path: "comments.userId" },
      ]);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching blogs.",
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
      error_message: "Error while fetching blogs.",
    });
  }
};
exports.fetchRecentBlogs = async (req, res) => {
  try {
    const result = await Blog.find({ deleted: false, active: true })
      .sort({
        createdAt: -1,
      })
      .limit(3)
      .populate([
        { path: "serviceType" },
        { path: "publishedBy" },
        { path: "comments.userId" },
      ]);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching blogs.",
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
      error_message: "Error while fetching blogs.",
    });
  }
};

// Fetch Blog details by id
exports.fetchBlogById = async (req, res) => {
  const _id = req.params.id;

  try {
    const result = await Blog.findById(_id).populate([
      { path: "serviceType" },
      { path: "publishedBy" },
      { path: "comments.userId" },
    ]);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching Blog - Blog ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "Blog fetched.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while fetching Blog - Blog ID - Incorrect",
    });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  await upload(req, res, async function (err) {
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
    body.tags = body.tags.split(",");
    let old_image = null;

    if (req.hasOwnProperty("fileUrl")) {
      const blog = await Blog.findOne({ _id: req.params.id });
      old_image = blog.imageUrl;
      body.imageUrl = "blogs/" + req.fileUrl;
    }

    try {
      const result = await Blog.findOneAndUpdate({ _id: req.params.id }, body, {
        new: true,
      }).populate([
        { path: "serviceType" },
        { path: "publishedBy" },
        { path: "comments.userId" },
      ]);

      if (!result) {
        return res.status(200).send({
          status: false,
          status_code: 400,
          error: "No record found.",
          error_fields: [],
          message: "Error while updating blog.",
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
        message: "Blog updated.",
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
        message: "Error while updating blog.",
      });
    }
  });
};

// Delete Blog
exports.deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const result = await Blog.deleteById(blogId);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while deleting Blog - Blog ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: blogId,
      message: "Blog deleted.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while deleting Blog.",
    });
  }
};

//all comment
exports.fetchAllComments = async (req, res) => {
  try {
    comments = [];
    const result = await Blog.find({ deleted: false })
      .sort({
        createdAt: -1,
      })
      .populate([{ path: "serviceType" }, { path: "publishedBy" }])
      .lean();

    // db.blogs.aggregate([ {$project : { comments : 1 }}, { $unwind : "$comments" }]

    await result.map((blog) => {
      blog.comments.map((comment) => {
        const commentDetails = Object.assign(
          {
            blogId: blog._id,
          },
          comment
        );
        // {
        //   ...comment,
        //   blogId: blog._id
        // }
        // {
        //   blogId: blog._id,
        //   _id: comment._id,
        //   commenterName: comment.commenterName,
        //   commenterEmail: comment.commenterEmail,
        //   comment: comment.comment
        // }
        comments.push(commentDetails);
      });
    });
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while fetching blogs.",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: comments,
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_message: "Error while fetching blogs.",
    });
  }
};
