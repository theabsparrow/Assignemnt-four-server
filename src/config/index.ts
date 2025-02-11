import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  // bcrypt
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  // jwt
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  // super admin
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_pass: process.env.SUPER_ADMIN_PASS,
  super_admin_phone: process.env.SUPER_ADMIN_PHONE,
  super_admin_birth: process.env.SUPER_ADMIN_BIRTH,
  super_admin_first_name: process.env.SUPER_ADMIN_FIRST_NAME,
  super_admin_middle_name: process.env.SUPER_ADMIN_MIDDLE_NAME,
  super_admin_last_name: process.env.SUPER_ADMIN_LAST_NAME,
  // email js
  email_app_password: process.env.EMAIL_APP_PASSWORD,
  email_sent_from: process.env.EMAIL_SENT_FROM,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  // surjo pay
  sp_endpoint: process.env.SP_ENDPOINT,
  sp_username: process.env.SP_USERNAME,
  sp_password: process.env.SP_PASSWORD,
  sp_prefix: process.env.SP_PREFIX,
  sp_return_url: process.env.SP_RETURN_URL,
};
