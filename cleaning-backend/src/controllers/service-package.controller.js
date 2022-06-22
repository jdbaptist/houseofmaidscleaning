const multer = require('multer');
const ServicePackage = require('../models/service-package.model');
const path = require('path');
let fs = require('fs');

exports.createServicePackage = async (req, res) => {
	try {
		const query = new ServicePackage(req.body);
		const result = await query.save();
		if (!result) {
			throw new Error('server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'ServicePackage created successfully'
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

exports.fetchServicePackagesWithoutAuth = async (req, res) => {
	try {
		var result = await ServicePackage.find({
			deleted: false,
			active: true
		}).sort({
			hour: 1
		});
		if (!result) {
			return res.status(200).send({
				status: false,
				status_code: 400,
				message: 'Error while fetching ServicePackages.'
			});
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			error_message: 'Error while fetching ServicePackages.'
		});
	}
};

exports.fetchServicePackages = async (req, res) => {
	try {
		var result;
		console.log(req.logged_in_user);
		switch (req.logged_in_user.role) {
			case 0:
				result = await ServicePackage.find({
					deleted: false
				}).sort({
					hour: 1
				});
				break;

			default:
				// console.log("Ethee rakhhh");
				result = await ServicePackage.find({
					deleted: false,
					active: true
				}).sort({
					hour: 1
				});
				break;
		}
		console.log(result);
		if (!result) {
			throw new Error('server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'ServicePackages fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: 'Error while fetching ServicePackages.'
		});
	}
};

exports.fetchServicePackage = async (req, res) => {
	try {
		const result = await ServicePackage.findById(req.params.id);
		if (!result) {
			throw new Error('server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'ServicePackage fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: 'Error while fetching ServicePackage.'
		});
	}
};

exports.updateServicePackage = async (req, res) => {
	try {
		const result = await ServicePackage.findOneAndUpdate(
			{
				_id: req.params.id
			},
			req.body,
			{ new: true }
		);
		if (!result) {
			throw new Error('server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'ServicePackage updated successfully'
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
			message: 'Error while ServicePackage  query.'
		});
	}
};

exports.deleteServicePackage = async (req, res) => {
	try {
		const result = await ServicePackage.deleteById(req.params.id);
		if (!result) {
			throw new Error('server error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result: req.params.id,
			message: 'ServicePackage  deleted successfully'
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
