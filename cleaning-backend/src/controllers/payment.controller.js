const Payment = require('../models/payment.model');
const stripe = require('../lib/payment');
const User = require('../models/users.model');
const { getMaxListeners } = require('../models/payment.model');
const fs = require('fs');
// const Stripe = require('stripe')('sk_test_51HtXEhFN6qkedXq7A1ZEEZQIU5JS0PwDHRUJZgZlwqWTRy4q6nBxVtm8atR7apb9GlcI3RfNKQNwsLwGAM76LHZP00Q1kDzWg3');
const dotenv = require('dotenv');
dotenv.config();
//configure stripe
let key;
if (process.env.TYPE === 'test') {
	key = process.env.STRIPE_SECRET_KEY || 'sk_test_51HtXEhFN6qkedXq7A1ZEEZQIU5JS0PwDHRUJZgZlwqWTRy4q6nBxVtm8atR7apb9GlcI3RfNKQNwsLwGAM76LHZP00Q1kDzWg3';
} else {
	key = process.env.STRIPE_PUBLIC_KEY;
}
const Stripe = require('stripe')(key);
exports.createPayement = async (req, res) => {
	try {
		const charges = await stripe.charge(req.body);
		res.send({
			charges: charges
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while creating payement.'
		});
	}
};

exports.createPayementProfile = async (req, res) => {
	let data = {};
	try {
		// checking stripe id i exsisted or not
		if (req.logged_in_user.stripeId) {
			console.log('m here');
			// getting data according to id
			data.customer = await stripe.retrieve(req.logged_in_user.stripeId);
			if (!data.customer) throw new Error('Error while getting your details!!!!');
		} else {
			console.log('not');
			data.customer = await stripe.saveDetails(req.logged_in_user);
			console.log('customer', data.customer);

			// data.token = await Stripe.tokens.create({
			// 	// card: {
			// 	// 	number: '4242424242424242',
			// 	// 	exp_month: 11,
			// 	// 	exp_year: 2021,
			// 	// 	cvc: '314'
			// 	// }
			// 	bank_account: {
			// 		country: 'US',
			// 		currency: 'inr',
			// 		account_holder_name: 'Jenny Rosen',
			// 		account_holder_type: 'individual',
			// 		routing_number: '110000000',
			// 		account_number: '000123456789'
			// 	}
			// });
			data.banktoken = await Stripe.tokens.create({
				bank_account: {
					country: req.body.country || 'US',
					currency: req.body.currency || 'usd',
					account_holder_name: req.body.account_holder_name,
					account_holder_type: 'individual',
					routing_number: req.body.routing_number,
					account_number: req.body.account_number
				}
			});
			console.log('banktoken', data.banktoken);
			// data.cardtoken = await Stripe.tokens.create({
			// 	card: {
			// 		number: req.body.number || '4242424242424242',
			// 		exp_month: req.body.exp_month || 11,
			// 		exp_year: req.body.exp_year || 2021,
			// 		cvc: req.body.cvc || '314'
			// 	}
			// });
			console.log('cardtoken', data.cardtoken);
			data.account = await Stripe.customers.createSource(data.customer.id, { source: data.banktoken.id });
			console.log('account', data.account);
			data.verifyBankAccount = await Stripe.customers.verifySource(data.customer.id, data.account.id, { amounts: [32, 45] });
			console.log('account', data.verifyBankAccount);
			// let updateUser = await User.updateOne({ _id: req.logged_in_user._id }, { customerId: data.customer.id ,accountId: data.account.});
			// console.log('updateUser', updateUser);
		}
		// let transfer = await Stripe.paymentIntents.create({
		// 	confirm: true,
		// 	off_session: true,
		// 	amount: req.body.amount || 200,
		// 	currency: req.body.currency || 'inr',
		// 	// payment_method_types: ['card'],
		// 	customer: data.customer.stripeId,
		// 	metadata: { integration_check: 'accept_a_payment' }
		// });
		// console.log('transfer', transfer);
		return res.status(200).send({
			status: true,
			status_code: 200,
			data,
			message: 'Payement Profile created successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while creating Payement Profile.'
		});
	}
};
exports.proceedPayment = async (req, res) => {
	// let data = {};
	try {
		console.log('req.logged_in_user.stripeId', req.body);
		// let transfer = await Stripe.transfers.create({
		// 	amount: 200,
		// 	currency: 'GB',
		// 	destination: req.logged_in_user.stripeId,
		// 	transfer_group: 'order_1'
		// });
		// // let param = {
		// // 	amount: req.body.amount || 200,
		// // 	currency: req.body.curreny || 'usd',
		// // 	destination: req.logged_in_user.stripeId,
		// // 	description: req.body.description || ''
		// // };
		// // console.log(param);
		// // let transfer = await Stripe.payouts.create(param);

		// let transfer = await Stripe.paymentIntents.create({
		// 	// confirm: true,
		// 	// off_session: true,
		// 	amount: req.body.amount || 200,
		// 	currency: req.body.currency || 'usd',
		// 	// payment_method_types: ['p24'],
		// 	// payment_method_types: ['alipay', 'au_becs_debit', 'bacs_debit', 'bancontact', 'card', 'eps', 'fpx', 'giropay', 'grabpay', 'ideal', 'oxxo', 'p24', 'sepa_debit', 'sofort'],
		// 	customer: req.logged_in_user.stripeId,
		// 	// transfer_data: {
		// 	// 	destination: req.logged_in_user.stripeId
		// 	// },
		// 	confirm: true,
		// 	metadata: { integration_check: 'accept_a_payment' }
		// });
		let transfer = await Stripe.transfers.create({
			amount: req.body.amount,
			currency: 'gbp',
			destination: req.logged_in_user.stripeId
		});
		console.log('transfer', transfer);
		return res.status(200).send({
			status: true,
			status_code: 200,
			transfer,
			message: 'Payement send successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while creating Payement Profile.'
		});
	}
};

exports.proceedPaymenthhhhh = async (req, res) => {
	let data = {};
	try {
		// stripeId;
		// customerId;
		// checking stripe id i exsisted or not
		// if (req.logged_in_user.stripeId) {
		// 	console.log('m here');
		// 	// getting data according to id
		// 	data.customer = await Stripe.retrieve(req.logged_in_user.stripeId);
		// 	if (!data.customer) throw new Error('Error while getting your details!!!!');
		// } else {
		// }
		data.createAccount = await Stripe.accounts.create({
			type: 'custom',
			country: 'GB',
			email: req.logged_in_user.email,
			requested_capabilities: ['card_payments', 'transfers']
		});
		console.log('createAccount', data.createAccount);
		data.token = await Stripe.tokens.create({
			bank_account: {
				country: 'GB',
				currency: 'gbp',
				account_holder_name: req.body.account_holder_name,
				account_holder_type: 'individual',
				routing_number: req.body.sort_code,
				// routing_number: req.body.routing_number,
				account_number: req.body.account_number
			}
		});
		console.log('token', data.token);
		console.log(req.logged_in_user.idCardUrl);
		const FrontFilePath = await fs.readFileSync('/var/www/html/cleaning_backend2/cleaning-backend/public/uploads/images/' + req.logged_in_user.idCardUrl);
		// const FrontFilePath = await fs.readFileSync('/var/www/html/vinay/cleening/cleaning-backend/public/uploads/images/users/idCards/idCardUrl-1594964690871.png');
		// console.log('FrontFilePath', FrontFilePath);
		const FrontPhotoIDUpload = await Stripe.files.create({
			file: {
				data: FrontFilePath,
				name: 'FrontPhotoID.jpg',
				type: 'application.octet-stream'
			},
			purpose: 'identity_document'
		});
		console.log('FrontPhotoIDUpload', FrontPhotoIDUpload);
		const BackFilePath = fs.readFileSync('/var/www/html/cleaning_backend2/cleaning-backend/public/uploads/images/' + req.logged_in_user.otherIdUrl);
		// const BackFilePath = fs.readFileSync('/var/www/html/vinay/cleening/cleaning-backend/public/uploads/images/users/idCards/idCardUrl-1594964690871.png');
		const BackPhotoIDUpload = await Stripe.files.create({
			file: {
				data: BackFilePath,
				name: 'BackPhotoID.jpg',
				type: 'application.octet-stream'
			},
			purpose: 'identity_document'
		});
		// const additionalFilePath = fs.readFileSync('/var/www/html/vinay/cleening/cleaning-backend/public/uploads/images/users/idCards/idCardUrl-1594964690871.png');
		// // const BackFilePath = fs.readFileSync(req.logged_in_user.drivingLicenseUrl);
		// const additionalPhotoIDUpload = await Stripe.files.create({
		// 	file: {
		// 		data: additionalFilePath,
		// 		name: 'additional.jpg',
		// 		type: 'application.octet-stream'
		// 	},
		// 	purpose: 'additional_verification'
		// });
		// console.log('additionalPhotoIDUpload', additionalPhotoIDUpload);
		data.account = await Stripe.accounts.update(data.createAccount.id, {
			business_type: 'individual',
			individual: {
				dob: { day: req.body.day, month: req.body.month, year: req.body.year },
				first_name: req.logged_in_user.firstname,
				last_name: req.logged_in_user.lastname,
				id_number: '006-20-8311',
				phone: req.logged_in_user.phone,
				address: {
					city: req.logged_in_user.city,
					line1: req.logged_in_user.address1,
					line2: req.logged_in_user.address2,
					postal_code: req.logged_in_user.zipcode,
					state: 'GB'
				},
				email: req.logged_in_user.email,
				// ssn_last_4: '8311',
				verification: {
					document: {
						front: FrontPhotoIDUpload.id,
						back: BackPhotoIDUpload.id
						// front: additionalPhotoIDUpload.id
					}
				}
			},
			business_profile: {
				mcc: '5734',
				url: 'http://www.houseofmaidscleaningservices.co.uk'
			},
			tos_acceptance: {
				date: Math.floor(Date.now() / 1000),
				ip: req.connection.remoteAddress
			}
		});
		console.log('data.account', data.account);
		data.externalAccount = await Stripe.accounts.createExternalAccount(data.createAccount.id, {
			external_account: data.token.id
		});
		console.log('data.externalAccount', data.externalAccount);
		// console.log(data.customer.id);
		let updateUser = await User.updateOne({ _id: req.logged_in_user._id }, { stripeId: data.createAccount.id });
		console.log('updateUser', updateUser);

		return res.status(200).send({
			status: true,
			status_code: 200,
			data,
			message: 'Payement send successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while creating Payement Profile.'
		});
	}
};
exports.fetchPayement = async (req, res) => {
	// let data = {};
	try {
		console.log('req.logged_in_user.stripeId', req.logged_in_user);
		const result = await Stripe.accounts.retrieve(req.logged_in_user.stripeId);
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'Payement Fetch successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while Fetching Payement Profile.'
		});
	}
};
