const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const projectSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
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
projectSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
projectSchema.plugin(beautifyUnique);
projectSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
projectSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
projectSchema.methods.toClean = function () {
  const project = this;
  const projectObject = project.toObject();

  delete projectObject.__v;

  return projectObject;
};

const project = mongoose.model("project", projectSchema);

project.paginate().then({});

module.exports = project;
