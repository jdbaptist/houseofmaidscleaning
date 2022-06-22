const dotenv = require('dotenv');
dotenv.config();
//configure stripe
let key;
if (process.env.TYPE === 'test') {
	key = process.env.STRIPE_SECRET_KEY || 'sk_test_51HtXEhFN6qkedXq7A1ZEEZQIU5JS0PwDHRUJZgZlwqWTRy4q6nBxVtm8atR7apb9GlcI3RfNKQNwsLwGAM76LHZP00Q1kDzWg3';
} else {
	key = process.env.STRIPE_PUBLIC_KEY;
}
const stripe = require('stripe')(key);

// internal Dependencies
const charge = (payload) => {
	return new Promise((resolve, reject) => {
		console.log('mmmmmmmmmmm', payload);
		stripe.charges
			.create({
				amount: payload.amount,
				currency: payload.currency,
				source: payload.source, //STRIPE_TOKEN_FROM_CLIENT
				// receipt_email: payload.receipt_email,
				description: payload.description
			})
			.then(function (message) {
				resolve(message);
			})
			.catch(function (err) {
				reject(err);
			});
	});
};

const saveDetails = (payload) => {
	return new Promise((resolve, reject) => {
		console.log('mmmm', payload);
		stripe.customers
			.create({
				description: 'My First Test Customer (created for API docs)',
				email: payload.email,
				name: payload.name,
				phone: payload.phone
			})
			.then(function (message) {
				resolve(message);
			})
			.catch(function (err) {
				reject(err);
			});
	});
};

const createToken = (cardDetails) => {
	return new Promise((resolve, reject) => {
		console.log('mmmm', cardDetails);
		stripe.tokens
			.create({
				number: cardDetails.number,
				exp_month: cardDetails.exp_month,
				exp_year: cardDetails.exp_year,
				cvc: cardDetails.cvc
			})
			.then(function (message) {
				resolve(message);
			})
			.catch(function (err) {
				reject(err);
			});
	});
};
const retrieve = (stripeId) => {
	return new Promise((resolve, reject) => {
		console.log('mmmm', stripeId);
		stripe.customers
			.retrieve(stripeId)
			.then(function (message) {
				resolve(message);
			})
			.catch(function (err) {
				reject(err);
			});
	});
};

module.exports = {
	charge,
	saveDetails,
	createToken,
	retrieve
};
