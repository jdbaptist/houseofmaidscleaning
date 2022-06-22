const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');

const dashController = require('../controllers/dashboard.controller');
const seederController = require('../controllers/seeder.controller');
const authController = require('../controllers/auth.controller');
const userAuthController = require('../controllers/userAuth.controller');

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
// Testing Routes
router.get('/test', dashController.test_api);
// Dashboard Routes
router.get('/dashboard/stats', authMiddleware, dashController.get_stats);

// Seeder
router.get('/seeder/initial', seederController.initial_seeder);

// Authentication Routes
router.post('/auth/login', authController.auth_user_login);

// Admin Profile
router.post('/profile/password', authMiddleware, userAuthController.update_user_password);
router.post('/profile/update', authMiddleware, userAuthController.update_user_logged_in);

// services
router.post('/services', authMiddleware, serviceController.createService);
router.get('/services', authMiddleware, serviceController.fetchServices);
router.get('/services/:id', serviceController.fetchServiceById);
router.delete('/services/:id', authMiddleware, serviceController.deleteService);
router.patch('/services/:id', serviceController.updateService);

// blogs
router.post('/blogs', authMiddleware, blogController.createBlog);
router.get('/blogs', authMiddleware, blogController.fetchBlogs);
router.get('/blogs/:id', authMiddleware, blogController.fetchBlogById);
router.delete('/blogs/:id', authMiddleware, blogController.deleteBlog);
router.patch('/blogs/:id', authMiddleware, blogController.updateBlog);

// comments
router.post('/blogs/:id/comments', commentsController.createComment);
router.delete('/blogs/:id/comments/:commentId', authMiddleware, commentsController.deleteComment);
// router.get('/blogs/:id/comments/:id', commentsController.fetchCommentById);
router.patch('/blogs/:id/comments/:commentId', authMiddleware, commentsController.updateComment);

// FAQs
router.post('/faqs', authMiddleware, faqController.createFaq);
router.get('/faqs', authMiddleware, faqController.fetchFAQs);
router.get('/faqs/:id', authMiddleware, faqController.fetchFAQ);
router.delete('/faqs/:id', authMiddleware, faqController.deleteFAQ);
router.patch('/faqs/:id', authMiddleware, faqController.updateFAQ);

// Contact Queries
router.post('/contact-queries', authMiddleware, contactQueryController.createQuery);
router.get('/contact-queries', authMiddleware, contactQueryController.fetchQueries);
router.get('/contact-queries/:id', authMiddleware, contactQueryController.fetchQuery);
router.delete('/contact-queries/:id', authMiddleware, contactQueryController.deleteQuery);
router.patch('/contact-queries/:id', authMiddleware, contactQueryController.updateQuery);

// Service Queries
router.post('/service-queries', authMiddleware, serviceQueryController.createQuery);
router.get('/service-queries', authMiddleware, serviceQueryController.fetchQueries);
router.get('/service-queries/:id', authMiddleware, serviceQueryController.fetchQuery);
router.delete('/service-queries/:id', authMiddleware, serviceQueryController.deleteQuery);
router.patch('/service-queries/:id', authMiddleware, serviceQueryController.updateQuery);

// Testimonials
router.post('/testimonials', authMiddleware, testimonialController.createTestimonial);
router.get('/testimonials', authMiddleware, testimonialController.fetchTestimonials);
router.get('/testimonials/:id', authMiddleware, testimonialController.fetchTestimonial);
router.delete('/testimonials/:id', authMiddleware, testimonialController.deleteTestimonial);
router.patch('/testimonials/:id', authMiddleware, testimonialController.updateTestimonial);

// Projects
router.post('/projects', authMiddleware, projectController.createProject);
router.get('/projects', authMiddleware, projectController.fetchProjects);
router.get('/projects/:id', authMiddleware, projectController.fetchProject);
router.delete('/projects/:id', authMiddleware, projectController.deleteProject);
router.patch('/projects/:id', authMiddleware, projectController.updateProject);

//customers
router.post('/customers', authMiddleware, userController.createUser);
router.get('/customers', authMiddleware, userController.fetchUsers);
router.get('/customers/:id', authMiddleware, userController.fetchUser);
router.patch('/customers/:id', authMiddleware, userController.updateUser);
router.patch('/customers/deactivate/:id', authMiddleware, userController.updateUser);
router.patch('/customers/delete/:id', authMiddleware, userController.updateUser);

//cleaner
router.post('/cleaners', userController.createUser);
router.get('/cleaners', authMiddleware, userController.fetchCleaners);
router.get('/cleaners/:id', authMiddleware, userController.fetchUser);
router.patch('/cleaners/:id', authMiddleware, userController.updateUser);
router.patch('/cleaners/deactivate/:id', authMiddleware, userController.updateUser);
router.patch('/cleaners/delete/:id', authMiddleware, userController.updateUser);

//service-plan
router.post('/service-packages', authMiddleware, servicePackageController.createServicePackage);
router.get('/service-packages', authMiddleware, servicePackageController.fetchServicePackages);
router.get('/service-packages/:id', authMiddleware, servicePackageController.fetchServicePackage);
router.patch('/service-packages/:id', authMiddleware, servicePackageController.updateServicePackage);
router.delete('/service-packages/:id', authMiddleware, servicePackageController.deleteServicePackage);
router.patch('/service-packages/change-status/:id', authMiddleware, servicePackageController.updateServicePackage);

//rejecttedby
// router.post('/service-requests/rejected-by/:id', serviceRequestController.createRejectedServiceRequest);
// router.patch('/service-requests/accepted-by/:id', serviceRequestController.createAcceptedServiceRequest);
// router.patch('/service-requests/work-in-progress/:id', serviceRequestController.createWorkInProgressServiceRequest);
// router.patch('/service-requests/work-complete/:id', serviceRequestController.createCompleteServiceRequest);
// router.get('/service-requests/accepted-by', serviceRequestController.fetchServiceAcceptedRequests);

router.post('/service-requests/', serviceRequestController.createServiceRequest);
router.get('/service-requests/', serviceRequestController.fetchServiceRequests);
router.get('/service-requests/:id', serviceRequestController.fetchServiceRequest);
router.patch('/service-requests/:id', serviceRequestController.updateServiceRequest);
router.delete('/service-requests/:id', serviceRequestController.deleteServiceRequest);
router.post('/service-requests/accept', serviceRequestController.acceptByAdminServiceRequest);
router.post('/service-requests/reject', serviceRequestController.rejectByAdminServiceRequest);

//all-comments
router.get('/all-comments', blogController.fetchAllComments);

// router.get("/filter", userController.filterUsers);

//content api
router.post('/content/', contentController.createContent);
router.get('/content/', contentController.fetcheContents);
router.get('/content/:page', contentController.fetcheContent);
router.patch('/content/:page', contentController.updateContent);

module.exports = router;
