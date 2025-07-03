const emailjs = require('emailjs');

const sendEmail = (templateParams) => {
  emailjs
    .send(
      'YOUR_EMAILJS_SERVICE_ID',
      'YOUR_EMAILJS_TEMPLATE_ID',
      templateParams,
      'YOUR_EMAILJS_USER_ID'
    )
    .then(
      response => console.log('Email sent:', response.status, response.text),
      err => console.error('Email error:', err)
    );
};

module.exports = { sendEmail };