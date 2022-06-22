const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const serviceRequestSchema = new mongoose.Schema(
	{
		firstname: {
			type: String
		},
		lastname: {
			type: String
		},
		email: {
			type: String
		},
		phone: {
			type: String
		},
		address: {
			type: String
		},
		zipcode: {
			type: String
		},
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		acceptedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		rejectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
		orderId: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			unique: true
		},
		title: {
			type: String
		},
		body: {
			type: String
		},
		serviceType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'service'
		},
		serviceArea: {
			type: String
		},
		rooms: {
			type: String
		},
		servicePackage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'servicePackage'
		},
		dateOfService: {
			type: Date
		},
		timeOfService: {
			type: Date
		},
		endTimeOfService: {
			type: Date
		},
		location: {
			type: String
		},
		longitude: {
			type: String
		},
		latitude: {
			type: String
		},
		contact: {
			type: String
		},
		captureImage: {
			type: String
		},
		captureImage2: {
			type: String
		},
		review: {
			rating: { type: String },
			reviewText: { type: String }
		},
		reason:{
			type:String
		},
		paidToCleaner: {
			type: Boolean,
			default: false
		},
		workStatus: {
			type: Number, // 0-Pending, 1-Accepted, 2-work in Progress, 3-Complete, -1-Cancelled
			default: 0
		}
	},
	{
		timestamps: true
	}
);

// For soft delete
serviceRequestSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
serviceRequestSchema.plugin(beautifyUnique);
serviceRequestSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
serviceRequestSchema.post('save', function (error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(error);
	} else {
		next();
	}
});

// To remove password and tokens from service data before sending reaponse to client
serviceRequestSchema.methods.toClean = function () {
	const service = this;
	const serviceObject = service.toObject();

	delete serviceObject.__v;

	return serviceObject;
};

const Service = mongoose.model('serviceRequest', serviceRequestSchema);

Service.paginate().then({});

module.exports = Service;
