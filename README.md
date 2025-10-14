# **Car Store**

This is an advance backend application with rest apis built with the powerfull technology **Express.js**, **TypeScript**, and **MongoDB**. This is all about a car store and create car document where the details of a cr is included with the price and quantity. An order collection manage the order with the totalprice and also calculate the reveneu form the order.

---

## **Live Demo server site** : https://lambocar.vercel.app/

## **api common inception** : https://lambocar.vercel.app/api

## **client site live link** : https://lambo-car-frontend.vercel.app/

## **client site github repo** : https://github.com/theabsparrow/Assignment-four-client.git

---

## **Features**

### **Cars Management**

- Create, read, update, and delete cars.
- Search Cars by `brand`, `model`, or `category`.
- Tracking the car data when creating an order with the total price.

### **Car Order Management**

- Place orders for Cars with real-time stock updates.
- Automatically calculate total price for each order depending on the quantity of the car.
- Manage customer details by collection email and order quantities with the detail of car id and total price.

### **Revenue Tracking**

- Calculate total revenue from all orders using MongoDB aggregation.

### **Error Handling**

- Comprehensive error responses for validation, not found, and insufficient stock.
- Clear and structured error messages for debugging.
- all types of error are managed with the mongooose built in schema.

---

## **Technologies Used**

- **Language:** TypeScript
- **Backend technology:** Node.js,
- **Framework:** Express.js
- **Database:** MongoDB with the library Mongoose
- **Validation:** Zod Validation
- **API Testing:** Postman
- **Deployment:** vercel

### **Installation**

1. **Clone the Repository:**

**go to your terminal , access your demanded directory and command**

```bash
git clone https://github.com/theabsparrow/Assignemnt-four-server.git
```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**  
    Create a `.env` file in the root directory and add the following:

   ```env
   PORT
   DATABASE_URL
   NODE_ENV
   CLIENT_URL
   BCRYPT_SALT_ROUND
   JWT_ACCESS_SECRET
   JWT_REFRESH_SECRET
   JWT_ACCESS_EXPIRES_IN
   JWT_REFRESH_EXPIRES_IN
   SUPER_ADMIN_EMAIL
   SUPER_ADMIN_PASS
   SUPER_ADMIN_PHONE
   SUPER_ADMIN_BIRTH(it will be year/month/date formated)
   SUPER_ADMIN_FIRST_NAME
   SUPER_ADMIN_MIDDLE_NAME
   SUPER_ADMIN_LAST_NAME
   EMAIL_APP_PASSWORD
   EMAIL_SENT_FROM
   SMTP_HOST
   SMTP_PORT
   SP_ENDPOINT
   SP_USERNAME
   SP_PASSWORD
   SP_PREFIX
   SP_RETURN_URL=http://localhost:3000/order/verify (this is custom component)
   <!-- # SP_RETURN_URL=https://sandbox.shurjopayment.com/response -->
   DB_FILE
   ```

4. **Run the Server:**

   ```bash
   npm run dev
   ```

5. **build the Server after completing:**
   ```bash
   npm run build
   ```
