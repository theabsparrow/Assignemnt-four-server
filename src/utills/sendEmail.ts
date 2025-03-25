import nodemailer from 'nodemailer';
import config from '../config';
type TEMailSend = {
  to: string;
  html?: string;
  subject: string;
  text: string;
  attachments?: {
    filename: string;
    path: string;
    content?: Buffer;
    contentType?: string;
  }[];
};

type TmailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: {
    filename: string;
    path: string;
    content?: Buffer;
    contentType?: string;
  }[];
};
export const sendEmail = async ({
  to,
  html,
  subject,
  text,
  attachments,
}: TEMailSend) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host as string,
    port: Number(config.smtp_port),
    secure: false,
    auth: {
      user: config.email_sent_from as string,
      pass: config.email_app_password as string,
    },
  });

  const mailOptions: TmailOptions = {
    from: 'Lambo Car Showroom',
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  if (attachments && attachments.length > 0) {
    mailOptions.attachments = attachments;
  }

  await transporter.sendMail(mailOptions);
};
