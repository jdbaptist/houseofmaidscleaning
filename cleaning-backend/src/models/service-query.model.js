const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const serviceQuerySchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    query: {
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
serviceQuerySchema.plugin(mongoose_delete);
// Enable beautifying on this schema
serviceQuerySchema.plugin(beautifyUnique);
serviceQuerySchema.plugin(mongoosePaginate);

// Middleware
// Error handling
serviceQuerySchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
serviceQuerySchema.methods.toClean = function () {
  const serviceQuery = this;
  const serviceQueryObject = serviceQuery.toObject();

  delete serviceQueryObject.__v;

  return serviceQueryObject;
};

const ServiceQuery = mongoose.model("serviceQuery", serviceQuerySchema);

ServiceQuery.paginate().then({});

module.exports = ServiceQuery;
