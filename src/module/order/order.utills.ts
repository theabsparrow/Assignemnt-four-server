import Shurjopay from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();
shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

shurjopay.makePayment();
