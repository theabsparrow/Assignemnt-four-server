import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host as string,
    port: Number(config.smtp_port),
    secure: false,
    auth: {
      user: config.email_sent_from as string,
      pass: config.email_app_password as string,
    },
  });

  await transporter.sendMail({
    from: 'Lambo Car Showroom',
    to,
    subject: 'Your one time password(OTP)',
    text: 'This one time password is valid for only 5 minutes',
    html,
  });
};
