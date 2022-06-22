const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientCompanyName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    clientReview: {
      type: String,
      required: true,
    },
    clientRating: {
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
testimonialSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
testimonialSchema.plugin(beautifyUnique);
testimonialSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
testimonialSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
testimonialSchema.methods.toClean = function () {
  const testimonial = this;
  const testimonialObject = testimonial.toObject();

  delete testimonialObject.__v;

  return testimonialObject;
};

const testimonial = mongoose.model("testimonial", testimonialSchema);

testimonial.paginate().then({});

module.exports = testimonial;
