const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require('fs');
const authMiddleware = require('../middlewares/auth-user.middleware');

// const dashController = require("../controllers/dashboard.controller");
// const seederController = require("../controllers/seeder.controller");
const authController = require('../controllers/auth.controller');
// const userAuthController = require("../controllers/userAuth.controller");

const serviceController = require('../controllers/service.controller');
const blogController = require('../controllers/blog.controller');
const commentsController = require('../controllers/blog-comments.controller');
const faqController = require('../controllers/faq.controller');
const contactQueryController = require('../controllers/contact-query.controller');
const serviceQueryController = require('../controllers/service-query.controller');
const testimonialController = require('../controllers/testimonial.controller');
const projectController = require('../controllers/project.controller');
const userController = require('../controllers/userController');
// const cleanerController = require('../controllers/cleanerController');
const servicePackageController = require('../controllers/service-package.controller');
const serviceRequestController = require('../controllers/service-request.controller');
const contentController = require('../controllers/content.controller');
const paymentController = require('../controllers/payment.controller');
const transactionController = require('../controllers/transaction.controller');
const notificationController = require('../controllers/notificationsController');
const csvController = require('../controllers/csvController');
// const obj=new csvController();

// services
router.get('/services', serviceController.fetchActiveServices);
router.get('/services/:id', serviceController.fetchServiceById);

// Testimonials
router.get('/testimonials', testimonialController.fetchActiveTestimonials);

//service-plan
router.get('/servicePackages', servicePackageController.fetchServicePackagesWithoutAuth);
router.get('/service-packages', authMiddleware, servicePackageController.fetchServicePackages);

// Projects
router.get('/projects', projectController.fetchActiveProjects);

// blogs
router.get('/blogs', blogController.fetchActiveBlogs);
router.get('/blogs/recent', blogController.fetchRecentBlogs);
router.get('/blogs/:id', blogController.fetchBlogById);

// comments
router.post('/blogs/:id/comments', authMiddleware, commentsController.createComment);
router.patch('/blogs/:id/comments/:commentId', authMiddleware, commentsController.updateComment);
router.delete('/blogs/:id/comments/:commentId', authMiddleware, commentsController.deleteComment);

// Contact Queries
router.post('/contact-queries', contactQueryController.createQuery);

// FAQs
router.get('/faqs', faqController.fetchActiveFAQs);

//content api
router.get('/content', contentController.fetcheContents);
router.get('/content/:page', contentController.fetcheContent);

// Service Queries
router.post('/service-queries', serviceQueryController.createQuery);

//Authentication 
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.post('/auth/forgot-password', userController.forgotPassword);
router.post('/auth/verify-otp', userController.verifyOtp);
router.post('/auth/verify-link', userController.verifyResetLink);
router.get('/auth/verify-email/:id', userController.verifyEmail);
router.post('/auth/resent-otp',userController.resentOtp);
router.post('/auth/reset-password', userController.forgotPasswordUpdated);

//social login
router.post("/auth/facebook-login",userController.facebookLogin);
router.post("/auth/google-login",userController.googleLogin);

//Cleaner Dashboard Api For Website
router.get('/profile', authMiddleware, userController.fetchUser);
router.patch('/profile', authMiddleware, userController.updateUserProifle);
// router.get("/profile/change-pasword", authMiddleware, userController.fetchUser);
router.patch('/profile/change-pasword', authMiddleware, userController.changePassword);

// Cleaner Dashboard Api For Website //inrepor
router.patch('/cleaners/deactivate/:id', authMiddleware, userController.updateUser);

//accepted by //rejected by
router.patch('/service-requests/reject-request/:id', serviceRequestController.createAcceptedServiceRequest);
// router.get(
//   "/service-requests/accepted-by",
//   serviceRequestController.fetchServiceAcceptedRequests
// );

// Customer Dashboard Api For Website
router.patch('/customers/deactivate/:id', authMiddleware, userController.updateUser);

//service-requests
router.post('/service-requests/', authMiddleware, serviceRequestController.createServiceRequest);
router.get('/service-requests/', authMiddleware, serviceRequestController.fetchServiceRequests);
router.get('/service-requests/:id', authMiddleware, serviceRequestController.fetchServiceRequest);
router.patch('/service-requests/:id', authMiddleware, serviceRequestController.updateServiceRequest);

router.get('/work-history', authMiddleware, serviceRequestController.fetchCleanerWorkHistory);
router.get('/accepted-bookings', authMiddleware, serviceRequestController.fetchCleanerAcceptedBookings);

router.get('/booking-history', authMiddleware, serviceRequestController.fetchCustomerBookingHistory);
router.get('/booked-services', authMiddleware, serviceRequestController.fetchCustomerBookedServices);

// billing
router.get('/upcoming-services', authMiddleware, serviceRequestController.fetchServiceRequestsUpcoming);
router.patch('/billing', authMiddleware, serviceRequestController.updateServiceRequestBilling);

//payment
router.post('/payment', authMiddleware, paymentController.createPayement);
router.get('/payment-fetch', authMiddleware, paymentController.fetchPayement);
router.post('/payment-profile', authMiddleware, paymentController.proceedPaymenthhhhh);
// router.post('/payment-profile', authMiddleware, paymentController.createPayementProfile);
router.post('/withdrawal', authMiddleware, paymentController.proceedPayment);

//transaction
router.post('/transaction', authMiddleware, transactionController.createPayement);
router.get('/transaction/', authMiddleware, transactionController.fetchPayments);
router.get('/transaction/:id', authMiddleware, transactionController.fetchPayment);
router.patch('/transaction/:id', authMiddleware, transactionController.updatePayment);

//notification
router.post('/notification', authMiddleware, notificationController.createNotification);
router.get('/notification', authMiddleware, notificationController.fetchNotifications);
router.patch('/notification/:id/reject', authMiddleware, notificationController.rejectServiceRequest);
router.patch('/notification/:id/accept', authMiddleware, notificationController.acceptServiceRequest);

//csv
router.get('/customer/export-csv', csvController.exportCsvCustomer);
router.get('/cleaner/export-csv', csvController.exportCsvCleaner);

module.exports = router;
