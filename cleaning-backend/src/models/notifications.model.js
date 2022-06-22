const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const notificationSchema = new mongoose.Schema(
	{
		serviceRequestId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'serviceRequest'
		},
		transactionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'transaction'
		},
		notificationType: {
			type: String,
			enum: ['payment', 'request']
		},
		active: {
			type: Boolean,
			default: true
		},
		users: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'users'
				}
			],
			default: []
		},
		rejectedBy: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'users'
				}
			],
			default: []
		}
		// readBy: {
		//   type: [
		//     {
		//       type: mongoose.Schema.Types.ObjectId,
		//       ref: "users",
		//     },
		//   ],
		//   default: [],
		// },
		// rejectedBy: {
		//   type: [
		//     {
		//       type: mongoose.Schema.Types.ObjectId,
		//       ref: "users",
		//     },
		//   ],
		//   default: [],
		// },
	},
	{
		timestamps: true
	}
);

// For soft delete
notificationSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
notificationSchema.plugin(beautifyUnique);
notificationSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
notificationSchema.post('save', function (error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(error);
	} else {
		next();
	}
});

// To remove password and tokens from service data before sending reaponse to client
notificationSchema.methods.toClean = function () {
	const service = this;
	const notificationObject = service.toObject();

	delete notificationObject.__v;

	return notificationObject;
};

const Service = mongoose.model('notification', notificationSchema);

Service.paginate().then({});

module.exports = Service;
