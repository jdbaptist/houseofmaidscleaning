const Blog = require("../models/blog.model");

// Create Comment
exports.createComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    req.body.userId = req.logged_in_user._id;
    blog.comments.push(req.body);
    const result = await blog.save();

    await Blog.populate(result, [
      { path: "serviceType" },
      { path: "publishedBy" },
      { path: "comments.userId" },
    ]);

    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "comment created successfully.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : "Error while creating comment.",
    });
  }
};

// Delete Comment
exports.deleteComment = async (req, res, next) => {
  const blogId = req.params.id;
  const commentId = req.params.commentId;
  try {
    const blog = await Blog.findById(blogId);

    blog.comments = blog.comments.filter((comment) => {
      if (comment._id != commentId) {
        return comment;
      }
    });

    const result = await blog.save();

    await Blog.populate(result, [
      { path: "serviceType" },
      { path: "publishedBy" },
      { path: "comments.userId" },
    ]);

    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while deleting Comment - Comment ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: result,
      message: "Comment deleted.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while deleting comment.",
    });
  }
};

// update comment
exports.updateComment = async (req, res) => {
  const blogId = req.params.id;
  const commentId = req.params.commentId;
  try {
    const blog = await Blog.findById(blogId);

    blog.comments = blog.comments.filter((comment) => {
      if (comment._id == commentId) {
        comment.comment = req.body.comment;
      }
      return comment;
    });

    const result = await blog.save();
    await Blog.populate(result, [
      { path: "serviceType" },
      { path: "publishedBy" },
      { path: "comments.userId" },
    ]);
    if (!result) {
      return res.status(200).send({
        status: false,
        status_code: 400,
        message: "Error while updating Comment - Comment ID - Incorrect",
      });
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: result,
      message: "Comment updated.",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: "Error while updating Comment.",
    });
  }
};
