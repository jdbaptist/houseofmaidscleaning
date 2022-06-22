const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const contactQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
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
contactQuerySchema.plugin(mongoose_delete);
// Enable beautifying on this schema
contactQuerySchema.plugin(beautifyUnique);
contactQuerySchema.plugin(mongoosePaginate);

// Middleware
// Error handling
contactQuerySchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
contactQuerySchema.methods.toClean = function () {
  const contactQuery = this;
  const contactQueryObject = contactQuery.toObject();

  delete contactQueryObject.__v;

  return contactQueryObject;
};

const contactQuery = mongoose.model("contactQuery", contactQuerySchema);

contactQuery.paginate().then({});

module.exports = contactQuery;
