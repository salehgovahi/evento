const nodemailer = require('nodemailer');
const environments = require('../configs/environments');

const sendEmail = async (to, subject, htmlTemplate, sentence) => {
    const finalHtml = htmlTemplate.replace('{{content}}', sentence);

    // Configure your transporter (example with Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: environments.SENDER_EMAIL,
            pass: environments.SENDER_EMAIL_PASSWORD
        }
    });

    // Send the email
    await transporter.sendMail({
        from: `"Evento" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: finalHtml
    });
};

module.exports = sendEmail;
