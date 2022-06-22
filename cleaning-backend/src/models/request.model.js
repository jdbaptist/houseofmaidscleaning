const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const requestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    rejectedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
    serviceArea: {
      type: String,
    },
    servicePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
    },
    dateOfService: {
      type: Date,
    },
    timeOfService: {
      type: String,
    },
    location: {
      type: String,
    },
    contact: {
      type: String,
    },
    review: {
      rating: {
        type: Number,
      },
      reviewText: {
        type: String,
      },
    },
    workStatus: {
      type: Number, // 0 pending, 1 accepted, 2 work in progress, 3 complete
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
requestSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
requestSchema.plugin(beautifyUnique);
requestSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
requestSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
requestSchema.methods.toClean = function () {
  const request = this;
  const requestObject = request.toObject();

  delete requestObject.__v;

  return requestObject;
};

const request = mongoose.model("request", requestSchema);

request.paginate().then({});

module.exports = request;
