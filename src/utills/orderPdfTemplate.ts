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
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f9fafb;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #ff4d4d;
              padding: 16px;
              text-align: center;
              color: #fff;
              border-top-left-radius: 12px;
              border-top-right-radius: 12px;
            }
            h1 {
              margin: 0;
              font-size: 24px;
            }
            .section {
              margin-bottom: 24px;
              padding: 16px;
              background-color: #fafafa;
              border-left: 6px solid #ff4d4d;
              border-radius: 8px;
            }
            h2 {
              color: #ff4d4d;
              font-size: 20px;
              margin-bottom: 12px;
              border-bottom: 2px solid #ff4d4d;
              padding-bottom: 4px;
            }
            p {
              margin: 4px 0;
              font-size: 16px;
              color: #555;
            }
            .highlight {
              color: #ff4d4d;
              font-weight: bold;
            }
            .footer {
              margin-top: 24px;
              text-align: center;
              font-size: 14px;
              color: #777;
              padding-top: 12px;
              border-top: 1px solid #eee;
            }
            .status {
              padding: 8px;
              border-radius: 4px;
              color: #fff;
              font-weight: bold;
              display: inline-block;
              background-color: ${orderInfo.status === 'Paid' ? '#4caf50' : '#ff9800'};
            }
            .badge {
              display: inline-block;
              padding: 4px 8px;
              font-size: 12px;
              background-color: #f4f4f4;
              color: #555;
              border-radius: 12px;
              border: 1px solid #ddd;
              margin-right: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation - Lambo Car</h1>
            </div>

            <!-- User Information -->
            <div class="section">
              <h2>User Information</h2>
              <p><strong>Name:</strong> ${userInfo.name}</p>
              <p><strong>Email:</strong> ${userInfo.email}</p>
              <p><strong>Gender:</strong> ${userInfo.gender}</p>
            </div>

            <!-- Car Information -->
            <div class="section">
              <h2>Car Information</h2>
              <p><strong>Brand:</strong> ${carInfo.brand}</p>
              <p><strong>Model:</strong> ${carInfo.model}</p>
              <p><strong>Category:</strong> ${carInfo.category}</p>
              <p><strong>Price:</strong> $${carInfo.price}</p>
              <p><strong>Color:</strong> ${carInfo.color}</p>
              <p><strong>Seating Capacity:</strong> ${carInfo.seatingCapacity}</p>
              <p><strong>Year:</strong> ${carInfo.year}</p>
              <p><strong>Condition:</strong> ${carInfo.condition}</p>
              <p><strong>Made In:</strong> ${carInfo.madeIn}</p>
            </div>

            <!-- Order Information -->
            <div class="section">
              <h2>Order Information</h2>
              <p><strong>Order ID:</strong> ${orderInfo.orderID}</p>
              <p><strong>Quantity:</strong> ${orderInfo.quantity}</p>
              <p><strong>Total Price:</strong> $${orderInfo.totalPrice}</p>
              <p><strong>Status:</strong> <span class="status">${orderInfo.status}</span></p>
              <p><strong>Date & Time:</strong> ${orderInfo.date_time}</p>
              <p><strong>Delivery Method:</strong> ${orderInfo.deliveryMethod}</p>
              <p><strong>Estimated Delivery:</strong> ${orderInfo.estimatedDeliveryTime}</p>
            </div>

            <!-- Payment Information -->
            <div class="section">
              <h2>Payment Information</h2>
              <p><strong>Transaction Status:</strong> ${orderInfo.transactionStatus}</p>
              <p><strong>Bank Status:</strong> ${orderInfo.bank_status}</p>
              <p><strong>SP Code:</strong> ${orderInfo.sp_code}</p>
              <p><strong>SP Message:</strong> ${orderInfo.sp_message}</p>
              <p><strong>Payment Method:</strong> ${orderInfo.method}</p>
              <p><strong>Payment Option:</strong> ${orderInfo.paymentOption}</p>
              <p><strong>Delivery Cost:</strong> $${orderInfo.deliveryCost}</p>
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
