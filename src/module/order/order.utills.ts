/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';
import Order from './order.model';

const shurjopay = new Shurjopay();
shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

const makePayment = async (paymentPayload: any): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

const verifyPayment = async (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};
export const orderUtills = {
  makePayment,
  verifyPayment,
};

// export const calculateRemainingTime = (estimatedTime: string) => {
//   const now = new Date();
//   let deliveryTime: Date;

//   if (estimatedTime.includes('days')) {
//     const days = parseInt(estimatedTime.split(' ')[0]);
//     deliveryTime = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
//   } else if (estimatedTime.includes('hours')) {
//     const hours = parseInt(estimatedTime.split(' ')[0]);
//     deliveryTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
//   } else {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid estimatedTime format');
//   }

//   const remainingTimeMs = deliveryTime.getTime() - now.getTime();
//   const remainingDays = Math.floor(remainingTimeMs / (24 * 60 * 60 * 1000));
//   const remainingHours = Math.floor(
//     (remainingTimeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
//   );
//   if (remainingDays > 0) {
//     return `${remainingDays} days and ${remainingHours} hours`;
//   } else {
//     return `${remainingHours} hours`;
//   }
// };

const findLastTrackingID = async () => {
  const lastTracking = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(1)
    .select('tracking.trackingID');
  const lastTrackingID = lastTracking[0];
  return lastTrackingID?.tracking?.trackingID
    ? lastTrackingID?.tracking?.trackingID
    : undefined;
};

export const createTrackingID = async () => {
  let currentID = (0).toString();
  const lastTrackingID = await findLastTrackingID();
  if (lastTrackingID) {
    currentID = lastTrackingID;
  }
  const increment = (Number(currentID) + 1).toString().padStart(4, '0');
  return increment;
};
