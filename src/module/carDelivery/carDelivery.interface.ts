export type TPaymentMethod = 'Cash on Delivery' | 'Online Payment';
export type TPaymentOptions = 'SSLCommerz' | 'Stripe' | 'SurjoPay';

export type TDeliveryMethod = 'Home Delivery' | 'Pickup' | 'Express Delivery';

export type TEstimatedTime =
  | '24 hours'
  | '2 days'
  | '5 days'
  | '6 days'
  | '8 days'
  | '9 days'
  | '10 days';

export type TDeliveryAndPayment = {
  paymentMethod: TPaymentMethod[];
  paymentOption: TPaymentOptions[];
  deliveryMethod: TDeliveryMethod;
  estimatedTime: TEstimatedTime;
  deliveryCost: number;
  isDeleted: boolean;
};

export interface TExtendedDeliveryAndPayment extends TDeliveryAndPayment {
  addPaymentMethod: TPaymentMethod[];
  removePaymentMethod: TPaymentMethod[];
  addPaymentOption: TPaymentOptions[];
  removePaymentOption: TPaymentOptions[];
}
