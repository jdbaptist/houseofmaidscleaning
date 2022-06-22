const nodemailer = require('nodemailer');
const webUrl = process.env.WEB_URL;
const ejs = require('ejs');
const path = require('path');

const Path = path.join(__dirname, '../../public/views');
const smtpTransport = nodemailer.createTransport({
	// ENV
	service: process.env.MAIL_SERVICE,
	host: process.env.MAIL_HOST,
	port: 465,
	tls: {
		rejectUnauthorized: false
	},
	// secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

sendMail = (to, subject, html) => {
	const mailOptions = {
		from: process.env.MAIL_USER,
		to,
		subject,
		html
	};
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log("Error <<<<<<<<<<<<< ============= >>>>>>>>>>>>",error);
		} else {
			console.log('Message sent: ' + response.messageId);
		}
	});
};


//Send Multiple Email
sendEMail = (to, subject, text) => {
	let emailPromiseArray = [];
	to.forEach(async function (to, i, array) {
	  emailPromiseArray.push(
		sendBulkMail({
		  from: "House MAid",
		  to: to,
		  subject: subject,
		  html: text
		})
	  )
	})


	 //run the promise
	 Promise.all(emailPromiseArray).then((result) => {
		  console.log("||||||||||||||  All Mail Completed  |||||||||")
	  }).catch((error) => {
		  console.log("Error <<<<<<<<<<<<< ==== >>>>>>>>>>>",error); 
	  })

	  function sendBulkMail(mail) {
		return new Promise((resolve, reject) => {
		  smtpTransport.sendMail(mail, function (error, response) {
			if (error) {
			  console.log(error);
			  reject(error);
			} else {
			  console.log("Message sent: " + JSON.stringify(response.messageId));
			  resolve(response);
			}
	
			smtpTransport.close();
		  });
		})
	  }
}

exports.send_html = async (email, html) => {
	const sub = 'Rseject payment';
	const text = 'your payment is rejected';

	sendMail(email, sub, text);
};

exports.send_otp = async (email,otp) => {
	let  variables = { otp :otp }
	const sub = 'Change Password';
	// let html = './views/email/forgotPassword.ejs';
	let htm = await ejs.renderFile(Path + '/forgotPassword.ejs', variables, { async: true });
	sendMail(email, sub, htm);
};

exports.send_registered = async (variables) => {
	const sub = `Register`;
	// let html = './views/email/register.ejs';
	let htm = await ejs.renderFile(Path + '/register.ejs', variables, { async: true });
	sendMail(variables.email, sub, htm);
};

exports.send_customer = async (variables) => {
	// console.log('variables------customer>>>>>>>>>>>', variables);
	const sub = `${variables.cleanerName} Accepted Your Booking`;
	// let html = './views/email/cutomer.ejs';
	let htm = await ejs.renderFile(Path + '/cutomer.ejs', variables, { async: true });
	sendMail(variables.sendEmail, sub, htm);
};

exports.send_cleaner = async (variables) => {
	const sub = `Booked`;
	let htm = await ejs.renderFile(Path + '/cleaner.ejs', variables, { async: true });
	console.log(sub);
	await sendMail(variables.sendEmail, sub, htm);
};

exports.send_allCleaner = async (mailList,variables) => {
	const sub = `Add New Service`;
	let htm = await ejs.renderFile(Path + '/allCleaner.ejs', variables, { async: true });
	await sendEMail(mailList, sub, htm);
}
