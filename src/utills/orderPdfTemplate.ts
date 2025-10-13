import { TCar } from '../module/car/car.interface';
import { Torder } from '../module/order/order.interface';
import { TUser } from '../module/users/user.interface';
type TOrderPdf = {
  userInfo: Partial<TUser>;
  carInfo: Partial<TCar>;
  orderInfo: Partial<Torder>;
};

export const generateOrderHTML = ({
  userInfo,
  carInfo,
  orderInfo,
}: TOrderPdf) => `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lambo Car - Order Confirmation</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f3f7f4;
        color: #333;
        margin: 0;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .container {
        max-width: 800px;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
      }

      .header {
        background-color: #2e7d32;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }

      h1 {
        font-size: 28px;
        margin: 0;
        font-weight: 600;
      }

      .section {
        margin-bottom: 24px;
        padding: 20px;
        background-color: #f9fdf9;
        border-left: 5px solid #4caf50;
        border-radius: 12px;
        transition: background-color 0.3s ease;
      }

      .section:hover {
        background-color: #eef9ee;
      }

      h2 {
        color: #2e7d32;
        font-size: 22px;
        margin-bottom: 12px;
        border-bottom: 2px solid #4caf50;
        padding-bottom: 6px;
        font-weight: 500;
      }

      p {
        margin: 6px 0;
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }

      .highlight {
        color: #2e7d32;
        font-weight: bold;
      }

      .status {
        padding: 8px 16px;
        border-radius: 8px;
        color: #fff;
        font-weight: bold;
        display: inline-block;
        background-color: ${orderInfo.status === 'Paid' ? '#4caf50' : '#f57c00'};
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .badge {
        display: inline-block;
        padding: 6px 12px;
        font-size: 14px;
        background-color: #f1f8f1;
        color: #2e7d32;
        border-radius: 16px;
        border: 1px solid #4caf50;
        margin-right: 8px;
        font-weight: 500;
      }

      .footer {
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        color: #777;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }

      /* Responsive Styling */
      @media (max-width: 768px) {
        body {
          padding: 12px;
        }
        .container {
          padding: 16px;
        }
        h1 {
          font-size: 24px;
        }
        h2 {
          font-size: 20px;
        }
        p {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Order Confirmation - Lambo Car</h1>
      </div>

      <!-- User Information -->
      <div class="section">
        <h2>User Information</h2>
        <p><strong>Name:</strong> ${userInfo?.name?.firstName} ${userInfo?.name?.lastName}</p>
        <p><strong>Email:</strong> ${userInfo?.email}</p>
        <p><strong>Gender:</strong> ${userInfo?.gender}</p>
      </div>

      <!-- Car Information -->
      <div class="section">
        <h2>Car Information</h2>
        <p><strong>Brand:</strong> ${carInfo?.brand}</p>
        <p><strong>Model:</strong> ${carInfo?.model}</p>
        <p><strong>Category:</strong> ${carInfo?.category}</p>
        <p><strong>Price:</strong> $${carInfo?.price}</p>
        <p><strong>Color:</strong> ${carInfo?.color}</p>
        <p><strong>Seating Capacity:</strong> ${carInfo?.seatingCapacity}</p>
        <p><strong>Year:</strong> ${carInfo?.year}</p>
        <p><strong>Condition:</strong> ${carInfo?.condition}</p>
        <p><strong>Made In:</strong> ${carInfo?.madeIn}</p>
      </div>

      <!-- Order Information -->
      <div class="section">
        <h2>Order Information</h2>
        <p><strong>Order ID:</strong> ${orderInfo?.orderID}</p>
        <p><strong>Quantity:</strong> ${orderInfo?.quantity}</p>
        <p><strong>Total Price:</strong> $${orderInfo?.totalPrice}</p>
        <p>
          <strong>Status:</strong>
          <span class="status">${orderInfo?.status}</span>
        </p>
        <p><strong>Date & Time:</strong> ${orderInfo?.date_time}</p>
        <p><strong>Delivery Method:</strong> ${orderInfo?.deliveryOption}</p>
        <p>
          <strong>Estimated Delivery:</strong> ${orderInfo?.estimatedDeliveryTime}
        </p>
      </div>

      <!-- Payment Information -->
      <div class="section">
        <h2>Payment Information</h2>
        <p><strong>Transaction Status:</strong> ${orderInfo?.transactionStatus}</p>
        <p><strong>Bank Status:</strong> ${orderInfo?.bank_status}</p>
        <p><strong>SP Code:</strong> ${orderInfo?.sp_code}</p>
        <p><strong>SP Message:</strong> ${orderInfo?.sp_message}</p>
        <p><strong>Payment Method:</strong> ${orderInfo?.method}</p>
        <p><strong>Payment Option:</strong> ${orderInfo?.paymentOption}</p>
        <p><strong>Delivery Cost:</strong> $${orderInfo?.deliveryCost}</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Thank you for choosing Lambo Car! 🚗</p>
        <p>&copy; 2025 Lambo Car. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>

    `;
