const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const servicePackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hour: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
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
servicePackageSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
servicePackageSchema.plugin(beautifyUnique);
servicePackageSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
servicePackageSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service data before sending reaponse to client
servicePackageSchema.methods.toClean = function () {
  const service = this;
  const serviceObject = service.toObject();

  delete serviceObject.__v;

  return serviceObject;
};

const Service = mongoose.model("servicePackage", servicePackageSchema);

Service.paginate().then({});

module.exports = Service;
