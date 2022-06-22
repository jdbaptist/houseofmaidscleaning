const Notification = require('../models/notifications.model');
const ServiceRequest = require('../models/service-request.model');
const ServicePackage = require('../models/service-package.model');
const Service = require('../models/service.model');
const User = require('../models/users.model');
const mailController = require('./mail.controller');
var moment = require('moment');
const { ObjectId } = require('mongodb');

exports.createNotification = async (data) => {
	try {
		const notification = new Notification(data);
		const result = await notification.save();
		if (!result) {
			throw new Error('Server error occured');
		}
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while creating Notification'
		});
	}
};

exports.fetchNotifications = async (req, res) => {
	try {
		// let criteria = {
		// 	users: req.logged_in_user._id,
		// 	rejectedBy: { $ne: req.logged_in_user._id }
		// };
		// if (req.logged_in_user.role === 2) {
		// 	criteria.active = true;
		// }
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
		// var result = await Notification.find(criteria).sort({ createdAt: -1 }).populate([{ path: 'serviceRequestId' }]);

		// console.log('fetchNotifications', result);
		// .limit(count)
		// .skip(skip)
		let criteria = {
			deleted: false,
			active: true,
			rejectedBy: { $ne: ObjectId(req.logged_in_user._id) }
		}
		criteria = {
			...criteria,
			users: { $in: [ObjectId(req.logged_in_user._id)] },
			createdAt: { $gte: new Date(req.logged_in_user.createdAt) }
		}
		let sort = { createdAt: -1 }
		let result = await Notification.aggregate([
			{
				$match: { $and: [criteria] }
			},
			{
				$lookup: {
					from: "servicerequests",
					localField: "serviceRequestId",
					foreignField: "_id",
					as: "servicerequests"
				}
			},
			{ $unwind: "$servicerequests" },
			{
				$lookup: {
					from: "users",
					localField: "servicerequests.customerId",
					foreignField: "_id",
					as: "user"
				}
			},
			{ $unwind: "$user" },
			{
				$lookup: {
					from: "services",
					localField: "servicerequests.serviceType",
					foreignField: "_id",
					as: "service"
				}
			},
			{ $unwind: "$service" },
			{
				$lookup: {
					from: "users",
					localField: "servicerequests.acceptedBy",
					foreignField: "_id",
					as: "acceptedBy"
				}
			},
			{
				$unwind:
				{
					path: "$acceptedBy",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "rejectedBy",
					foreignField: "_id",
					as: "rejectedBy"
				}
			},
			{
				$unwind:
				{
					path: "$rejectedBy",
					preserveNullAndEmptyArrays: true
				}
			},

			{ $sort: sort }
		]);
		if (!result) {
			throw new Error('Server Error Occured');
		}
		// for (let singleResult of result) {

		// 	console.log('hiiiii', singleResult);
		// 	if (singleResult.serviceRequestId) {
		// 		if (singleResult.serviceRequestId.servicePackage) {
		// 			singleResult.serviceRequestId.servicePackage = await ServicePackage.findById(singleResult.serviceRequestId.servicePackage);
		// 		}
		// 		if (singleResult.serviceRequestId.serviceType) {
		// 			singleResult.serviceRequestId.serviceType = await Service.findById(singleResult.serviceRequestId.serviceType);
		// 		}
		// 		if (singleResult.serviceRequestId.customerId) {
		// 			singleResult.serviceRequestId.customerId = await User.findById(singleResult.serviceRequestId.customerId);
		// 		}
		// 		if (singleResult.serviceRequestId.acceptedBy) {
		// 			singleResult.serviceRequestId.acceptedBy = await User.findById(singleResult.serviceRequestId.acceptedBy);
		// 		}
		// 	}
		// }
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'fetch Notifications fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while fetching fetch Notifications'
		});
	}
};

exports.rejectServiceRequest = async (req, res) => {
	try {
		//update the notifcation when provider reject the notifcation
		const notification = await Notification.findById(req.params.id);
		notification.rejectedBy.push(req.logged_in_user._id);
		await notification.save();
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",req.body.reason)   
		// update the workstatus and rejectedBy when provider rejected the ServiceRequest 
		const result = await ServiceRequest.findOneAndUpdate(
			{ _id: notification.serviceRequestId },
			{ $set: { rejectedBy: req.logged_in_user._id, workStatus: -1 }, reason:req.body.reason },
			{ new: true }
		);
        
		//create a notifcation to user while provider reject the notification
		const data = {
			notificationType: 'request',
			serviceRequestId: notification.serviceRequestId,
			users: result.customerId,
			rejectedBy: req.logged_in_user._id
		};
		this.createNotification(data);
		if (!result) {
			throw new Error('Server Error occured');
		}
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'fetchNotifications fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while fetching fetchNotifications'
		});
	}
};

exports.acceptServiceRequest = async (req, res) => {
	try {
		//update the notifcation when provider accept the notifcation
		const notification = await Notification.findById(req.params.id);
		notification.active = false;
		await notification.save();

		// update the workstatus and acceptedBy when provider accept the ServiceRequest 
		const result = await ServiceRequest.findOneAndUpdate(
			{ _id: notification.serviceRequestId },
			{ $set: { acceptedBy: req.logged_in_user._id, workStatus: 1 } },
			{ new: true }
		);

		//create a notifcation to user while provider accept the notification
		const data = {
			notificationType: 'request',
			serviceRequestId: notification.serviceRequestId,
			users: result.customerId
		};
		this.createNotification(data);

		if (!result) {
			throw new Error('Server Error Occured');
		}
		let populateQuery = [{ path: 'customerId' }, { path: 'acceptedBy' }, { path: 'serviceType' }, { path: 'servicePackage' }];
		let result2 = await ServiceRequest.findOne({ _id: notification.serviceRequestId }).populate(populateQuery);

		// customer send mail
		let variablesCustomer = {
			sendEmail: result2.acceptedBy.email,
			cleanerName: `${result2.acceptedBy.firstname} ${result2.acceptedBy.lastname}`,
			name: `${result2.customerId.firstname} ${result2.customerId.lastname}`,
			email: result2.customerId.email,
			serviceName: result2.serviceType.service,
			location: result2.serviceArea,
			address: `${result2.address}, ${result2.zipcode}`,
			date: moment(result2.dateOfService).format('Do MMMM, YYYY')
		};
		await mailController.send_customer(variablesCustomer);
		// cleaner send mail
		let variablesCleaner = {
			sendEmail: result2.customerId.email,
			name: `${result2.customerId.firstname} ${result2.customerId.lastname}`,
			email: result2.customerId.email,
			serviceName: result2.serviceType.service,
			location: result2.serviceArea,
			address: `${result2.address}, ${result2.zipcode}`,
			date: moment(result2.dateOfService).format('Do MMMM, YYYY')
		};
		await mailController.send_cleaner(variablesCleaner);
		return res.status(200).send({
			status: true,
			status_code: 200,
			result,
			message: 'fetchNotifications fetched successfully'
		});
	} catch (error) {
		return res.status(200).send({
			status: false,
			status_code: 400,
			error,
			message: error.message ? error.message : 'Error while fetching fetchNotifications'
		});
	}
};
