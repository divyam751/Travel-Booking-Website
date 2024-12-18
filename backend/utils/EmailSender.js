const nodemailer = require("nodemailer");
const { AUTH_MAIL_PASS, AUTH_MAIL_USER } = require("../constants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_MAIL_USER,
    pass: AUTH_MAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: AUTH_MAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};

module.exports = { sendEmail };
