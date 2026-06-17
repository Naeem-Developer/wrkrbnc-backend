import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const smtpConfig = {
  service: process.env.SMTP_SERVICE || 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER || 'mailer@example.com',
    pass: process.env.SMTP_PASS || 'examplepassword',
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

transporter.verify().then(() => {
  console.log('SMTP transporter verified');
}).catch((err) => {
  console.error('SMTP transporter verification failed:', err);
});

const sendMail = async ({ to, subject, html, text }) => {
  const fromAddress = process.env.EMAIL_FROM || 'workerbnc@gmail.com';
  const fromLabel = process.env.EMAIL_NAME || 'WorkerBNC';
  const computedText = text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const mailOptions = {
    from: `${fromLabel} <${fromAddress}>`,
    replyTo: fromAddress,
    to,
    subject,
    html,
    text: computedText,
    envelope: {
      from: fromAddress,
      to,
    },
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId, 'accepted:', info.accepted, 'rejected:', info.rejected);
  return info;
};

export default sendMail;
