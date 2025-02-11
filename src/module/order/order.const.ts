export const orderStatus = [
  'Pending',
  'Paid',
  'Shipped',
  'Completed',
  'Cancelled',
];

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
