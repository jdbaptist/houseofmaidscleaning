const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
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
faqSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
faqSchema.plugin(beautifyUnique);
faqSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
faqSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To remove password and tokens from service query data before sending reaponse to client
faqSchema.methods.toClean = function () {
  const faq = this;
  const faqObject = faq.toObject();

  delete faqObject.__v;

  return faqObject;
};

const faq = mongoose.model("faq", faqSchema);

faq.paginate().then({});

module.exports = faq;
