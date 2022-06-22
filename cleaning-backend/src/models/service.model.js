const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const serviceSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
    },
    serviceText: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
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
serviceSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
serviceSchema.plugin(beautifyUnique);
serviceSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
serviceSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service data before sending reaponse to client
serviceSchema.methods.toClean = function () {
  const service = this;
  const serviceObject = service.toObject();

  delete serviceObject.__v;

  return serviceObject;
};

const Service = mongoose.model("service", serviceSchema);

Service.paginate().then({});

module.exports = Service;
