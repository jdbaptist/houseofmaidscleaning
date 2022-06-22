const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userSchema = new mongoose.Schema(
	{
		role: {
			type: Number, // 0 - Admin, 1 - cutomer ,2 -cleaner
			required: true
		},
		firstname: {
			type: String,
			// required: true,
			trim: true
		},
		lastname: {
			type: String,
			trim: true
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true
		},
		password: {
			type: String
		},
		profileImage: {
			type: String
		},
		phone: {
			type: String,
			trim: true,
			unique: true,
			sparse: true
		},
		active: {
			type: Boolean,
			default: true
		},
		wallet: {
			type: Number,
			default: 0
		},
		address1: {
			type: String
		},
		address2: {
			type: String
		},
		zipcode: {
			type: String
		},
		experience: {
			type: String
		},
		skill: {
			type: String
		},
		serviceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'service'
		},
		profile_status: {
			type: String,
			default: 0 // 0 - Pending, 1 = activate, -1 = deactivated, -2 = deleted
		},
		idCardUrl: {
			type: String
		},
		idCardVerified: {
			type: Boolean,
			default: false
		},
		drivingLicenseUrl: {
			type: String
		},
		drivingLicenseVerified: {
			type: Boolean,
			default: false
		},
		otherIdUrl: {
			type: String
		},
		otherIdVerified: {
			type: Boolean,
			default: false
		},
		available: {
			type: Boolean,
			default: true
		},
		resetToken: {
			type: String,
			trim: true
		},
		stripeId: {
			type: String
		},
		customerId: {
			type: String
		},
		city: {
			type: String
		},
		verified:{
			type:Boolean,
			default:false
		},
		facebookId:{
			type:String
		},
		googleId:{
			type:String
		}
	},
	{
		timestamps: true
	}
);

// Index for text search in multiple fields
// userSchema.index(
//   { firstname: "text", lastname: "text", email: "text" },
//   { default_language: "none" }
// );

// For soft delete
userSchema.plugin(mongoose_delete);
// Enable beautifying on this schema
userSchema.plugin(beautifyUnique);
userSchema.plugin(mongoosePaginate);

// Middleware
// Error handling
userSchema.post('save', function (error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(error);
	} else {
		next();
	}
});

// To hash password before saving a user into database
userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8); // Here 8 is no of rounds
	}
	next();
});

// To remove password and tokens from user data before sending reaponse to client
userSchema.methods.toClean = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.__v;
	delete userObject.tokens;

	return userObject;
};

const User = mongoose.model('user', userSchema);

User.paginate().then({});

module.exports = User;
