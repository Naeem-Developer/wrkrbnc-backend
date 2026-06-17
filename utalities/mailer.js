import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'mailer@example.com',
    pass: process.env.SMTP_PASS || 'examplepassword',
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

const sendMail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'workerbnc@example.com',
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
};

export default sendMail;
