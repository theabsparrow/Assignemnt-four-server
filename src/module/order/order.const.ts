export const orderStatus = ['Pending', 'Paid', 'Completed', 'Cancelled'];

type TPaymentStatus = {
  success: 'Success';
  failed: 'Failed';
  cancel: 'Cancel';
};
export const paymentStatus: TPaymentStatus = {
  success: 'Success',
  failed: 'Failed',
  cancel: 'Cancel',
};

export const deliveryMethod: string[] = [
  'Home Delivery',
  'Pickup',
  'Express Delivery',
];
export const trackingStatus: string[] = [
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Order Placed',
];

export const paymentMethod: string[] = ['Cash on Delivery', 'Online Payment'];
export const paymentOption: string[] = ['SSLCommerz', 'Stripe', 'SurjoPay'];
