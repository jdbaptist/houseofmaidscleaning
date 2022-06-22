const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const transactionSchema = new mongoose.Schema(
	{
		orderId: {
			type: String
			//   required: true,
		},
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		orderDate: {
			type: String
			//   required: true,
		},
		service: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'serviceRequest'
		},
		amount: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			enum: ['complete', 'cancel', 'pending']
		},
		active: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
);

// For soft delete
transactionSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
transactionSchema.plugin(beautifyUnique);
transactionSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
transactionSchema.post('save', function (error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(error);
	} else {
		next();
	}
});

// To remove password and tokens from service data before sending reaponse to client
transactionSchema.methods.toClean = function () {
	const service = this;
	const trancationObject = service.toObject();

	delete trancationObject.__v;

	return trancationObject;
};

const Service = mongoose.model('transaction', transactionSchema);

Service.paginate().then({});

module.exports = Service;
