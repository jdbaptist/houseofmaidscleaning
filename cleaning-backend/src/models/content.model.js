const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const { strict } = require("assert");

const contentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    openingHours: {
      type: String,
      trim: true,
    },
    closingHours: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    fbUrl: {
      type: String,
      trim: true,
    },
    instaUrl: {
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
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

// For soft delete
contentSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
contentSchema.plugin(beautifyUnique);
contentSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
contentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
contentSchema.methods.toClean = function () {
  const content = this;
  const contentObject = content.toObject();

  delete contentObject.__v;

  return contentObject;
};

const content = mongoose.model("content", contentSchema);

content.paginate().then({});

module.exports = content;
