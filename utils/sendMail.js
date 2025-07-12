require("dotenv").config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSKEY
    }
});

const sendMail = async ({ to, subject, text }) => {
    if (!transporter) await setupTransporter();

    const info = await transporter.sendMail({
        from: '"Event Manager" <no-reply@example.com>',
        to,
        subject,
        text
    });

    console.log(`📨 Email sent: ${info.messageId}`);
    // Will get the URL in console/bash copy the URL and paste in browser to view the mail
    console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
};

module.exports = sendMail;