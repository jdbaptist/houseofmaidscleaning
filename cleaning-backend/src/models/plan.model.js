const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const planSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
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
planSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
planSchema.plugin(beautifyUnique);
planSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
planSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
planSchema.methods.toClean = function () {
  const plan = this;
  const planObject = plan.toObject();

  delete planObject.__v;

  return planObject;
};

const plan = mongoose.model("plan", planSchema);

plan.paginate().then({});

module.exports = plan;
