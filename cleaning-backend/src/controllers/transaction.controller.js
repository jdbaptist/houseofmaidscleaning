const Payment = require('../models/payment.model');
const ServicePackage = require('../models/service-package.model');
const Service = require('../models/service.model');
const stripe = require('../lib/payment');
// const stripe = require('stripe')('sk_test_51HADalJVcDteSwJNr9BMop3OBT2hrtj5d2mtkDfywnCaOguwfSy2A8Q0BpZUvLq1VY2fZfeb0LXBHorRkLnrzDuF00ijuXMGq1');
// const stripe = require('stripe')('sk_test_51HADalJVcDteSwJNr9BMop3OBT2hrtj5d2mtkDfywnCaOguwfSy2A8Q0BpZUvLq1VY2fZfeb0LXBHorRkLnrzDuF00ijuXMGq1');
exports.createPayement = async (req, res) => {
	try {
		req.body.customerId = req.logged_in_user._id;
		const payment = new Payment(req.body);
		const result = await payment.save();
		if (!result) {
			throw new Error('Server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'payment created successfully'
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
exports.fetchPayments = async (req, res) => {
	try {
		let populateQuery = [{ path: 'service' }, { path: 'customerId' }];
		// let count = 10;
		// let pageNo = 1;
		// let skip;
		// if (req.query.pageNo) {
		// 	count = req.query.count;
		// 	skip = (req.query.pageNo - 1) * req.query.count;
		// } else {
		// 	count = count;
		// 	skip = (pageNo - 1) * count;
		// }
		var result = await Payment.find({
			customerId: req.logged_in_user._id
		})
			// .limit(count)
			// .skip(skip)
			.populate(populateQuery);
		if (!result) {
			throw new Error('server error occured');
		}
		for (let singleResult of result) {
			console.log('hiiiii', singleResult);
			if (singleResult.service) {
				if (singleResult.service.servicePackage) {
					singleResult.service.servicePackage = await ServicePackage.findById(singleResult.service.servicePackage);
				}
				if (singleResult.service.serviceType) {
					singleResult.service.serviceType = await Service.findById(singleResult.service.serviceType);
				}
			}
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'payments fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status_code: 400,
			status: false,
			error,
			message: error.message ? error.message : 'Error while fetching data'
		});
	}
};

exports.fetchPayment = async (req, res) => {
	try {
		let populateQuery = [{ path: 'service' }, { path: 'customerId' }];
		const result = await Payment.findById(req.params.id).populate(populateQuery);
		if (!result) {
			throw new Error('server error occured');
		} else {
			if (result.service) {
				if (result.service.servicePackage) {
					result.service.servicePackage = await ServicePackage.findById(singleResult.service.servicePackage);
				}
				if (result.service.serviceType) {
					result.service.serviceType = await Service.findById(singleResult.service.serviceType);
				}
			}
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'payment fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: 'Error while fetching queries.'
		});
	}
};

exports.updatePayment = async (req, res) => {
	try {
		let populateQuery = [{ path: 'service' }, { path: 'customerId' }];
		const result = await ServiceRequest.findOneAndUpdate(
			{
				_id: req.params.id
			},
			req.body,
			{ new: true }
		).populate(populateQuery);
		if (!result) {
			throw new Error('server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'ServiceRequest updated successfully'
		});
	} catch (error) {
		let error_fields = [];
		if (error.hasOwnProperty('errors')) {
			for (let key in error.errors) {
				error_fields.push(key);
			}
		}
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			error_fields,
			message: 'Error while creating query.'
		});
	}
};
