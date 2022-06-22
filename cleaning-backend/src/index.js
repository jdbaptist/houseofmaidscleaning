const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./db/mongodb.js');
const fs = require('fs');
const path = require('path');

const mailController = require('./controllers/mail.controller');
let http = require('http');
const https = require('https');

var moment = require('moment');
let server;

const adminRoutes = require('./routes/admin.routes');
// const mobileRoutes = require('./routes/mobile.routes');
const webRoutes = require('./routes/web.routes');

const port = process.env.PORT;
const server_mode = process.env.ENVIRONMENT_PRODUCTION;

if (server_mode === 'true') {
	server = https.Server(
		{
			key: fs.readFileSync('/var/www/vhosts/houseofmaidscleaningservices.co.uk/httpdocs/cleaning-backend/cleaning.key'),
			cert: fs.readFileSync('/var/www/vhosts/houseofmaidscleaningservices.co.uk/httpdocs/cleaning-backend/cleaning.crt'),
			ca: fs.readFileSync('/var/www/vhosts/houseofmaidscleaningservices.co.uk/httpdocs/cleaning-backend/cleaning.ca.crt')
		},
		app
	);
} else {
	server = http.Server(app);
}

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicDirPath));

// CORS Middleware
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-custom-header, Authorization, Authorization-identity, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH, DELETE, PUT');
	next();
});

// Routes
app.use('/admin', adminRoutes);
// app.use("/mobile", mobileRoutes);
app.use('/web', webRoutes);

// 404 Error
app.get('/ping', (req, res) => {
	// let variablesCleaner = {
	// 	sendEmail: 'vinay.nagpal@snowflakessoftware.com',
	// 	name: 'dasdasda',
	// 	email: 'adssdas',
	// 	serviceName: 'adsdasd',
	// 	location: 'sdfsd',
	// 	address: 'ff',
	// 	date: moment().format('Do MMMM, YYYY')
	// };
	// mailController.send_cleaner(variablesCleaner);
	return res.send('hello world');
});
app.get('*', (req, res) => {
	return res.status(400).send({
		status: false,
		status_code: 400,
		message: 'URL Not found.'
	});
});

if (server_mode == 'true') {
	server.listen(port, () => {
		console.log('Server is up on port ' + port);
		console.log('Running production server.');
	});
} else {
	server.listen(port, () => {
		console.log('Server is up on port ' + port);
		console.log('Running stagging server.');
	});
}
