# **Car Store**

This is an advance backend application with rest apis built with the powerfull technology **Express.js**, **TypeScript**, and **MongoDB**. This is all about a car store and create car document where the details of a cr is included with the price and quantity. An order collection manage the order with the totalprice and also calculate the reveneu form the order.

---

## **Live Demo** : https://car-store-psi-wheat.vercel.app

- **API Base URL:** : /api/cars

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
- **Validation:** Mongoose Schema Validation
- **API Testing:** Postman
- **Deployment:** vercel

## **Project Structure**

```
📦 Car-store
├── 📂 src
│   ├── 📂 config                 # Configuration files
│   │   ├── index.ts                # env file connection setup
│   │
│   │
│   ├── 📂 module                # All modules
│   │   ├── 📂 car               # cars-related functionalities
│   │   │   ├── car.controller.ts
│   │   │   ├── car.interface.ts
│   │   │   ├── car.route.ts
│   │   │   ├── car.service.ts
│   │   │   ├── car.model.ts
│   │   │
│   │   ├── 📂 order          # Order-related functionalities
│   │       ├── order.controller.ts
│   │       ├── order.interface.ts
│   │       ├── order.route.ts
│   │       ├── order.service.ts
│   │       ├── order.model.ts
│   │
│   ├── app.ts     # Application setup (middleware, routes, etc.)
│   ├── server.ts    # Server startup file
│
├── 📂 dist                       # Compiled output (TypeScript -> JavaScript)
│
├── 📂 node_modules               # Installed dependencies
│
├── .env                          # Environment variables file
├── .gitignore                    # Ignored files for Git
├── .prettierignore                    # Ignored files for Git
├── .prettierrc.json                  # Ignored files for Git
├── eslint.config.mjs                 # Ignored files for Git
├── package-lock.json                # Ignored files for Git
├── package.json                  # Project dependencies and scripts
├── README.md                      # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration

```

---

### **Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/theabsparrow/Assignment-two
   cd Assignment-two
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**  
   Create a `.env` file in the root directory and add the following:

   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your_mongodb_connection_string
   ```

4. **Run the Server:**
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5000`.

to compile the files in java script in dist folder

```bash
npm run build
```

### got to package.json file to know more command located in the script object

---

### **Product Endpoints**

1. **Create a Car document:**

   - **POST** `/api/Cars`
   - **Request Body:**
     ```json
     {
       "brand": "Toyota",
       "model": "Camry",
       "year": 2024,
       "price": 25000,
       "category": "Sedan",
       "description": "A reliable family sedan with modern features.",
       "quantity": 50,
       "inStock": true
     }
     ```
   - **Response:** Details of the car post operation.

2. **Get All Cars:**

   - **GET** `/api/cars`
   - **Query Parameters:**
     - `searchTerm` (optional): Search by `brand`, `model`, or `category`.
   - **Response:** List of cars.

3. **Get a Specific Car:**

   - **GET** `/api/cars/:carId`
   - **Response:** Details of a specific car.

4. **Update a Car Data:**

   - **PUT** `/api/cars/:carId`
   - **Request Body:** Partial updates (e.g., `price`, `quantity`, `description`).
   - **Response:** Updated a car`s details.

5. **Delete a Car data:**

   - **DELETE** `/api/cars/:carId`
   - **Response:** Confirmation message for a deletion.

   ### **Order Endpoints**

6. **create an Order:**

   - **POST** `/api/orders`
   - **Request Body:**
     ```json
     {
       "email": "customer@example.com",
       "car": "648a45e5f0123c45678d9012",
       "quantity": 1,
       "totalPrice": 27000
     }
     ```
   - **Response:** Details of the created order.

7. **Calculate the Revenue:**
   - **GET** `/api/orders/revenue`
   - **Response:**
     ```json
     {
       "totalRevenue": 600
     }
     ```

---

## **Error Handling**

- **Validation Errors:**  
  Returns a clear and meaningfull error message when input validation fails.  
  Example:

  ```json
  {
    "message": "Validation failed",
    "success": false,
    "error": "Price must be a positive number"
  }
  ```

- **Not Found:**  
  Returns `404` if a product or order is not found.

- **Insufficient Stock:**  
  Returns an error if the requested quantity exceeds available stock.

---
