const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      // required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    comments: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          comment: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search in multiple fields
blogSchema.index(
  { tags: "text", title: "text", categoryId: "text" },
  { default_language: "none" }
);

// For soft delete
blogSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
blogSchema.plugin(beautifyUnique);
blogSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
blogSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from blog data before sending reaponse to client
blogSchema.methods.toClean = function () {
  const blog = this;
  const blogObject = blog.toObject();

  delete blogObject.__v;

  return blogObject;
};

const Blog = mongoose.model("blog", blogSchema);

Blog.paginate().then({});

module.exports = Blog;
