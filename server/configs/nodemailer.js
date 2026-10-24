import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  //for all this smtp data we need an smtp provider
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text,
    html: body,
  });

  return response;
};

export default sendEmail;
