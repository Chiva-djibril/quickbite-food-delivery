# 🍔 QuickBite Food Delivery

A full-stack food delivery web application built with **React**, **Vite**, **Tailwind CSS**, and a **Node.js/Express** backend with **SQL database**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Use Case Diagram](#-use-case-diagram)
- [Class Diagram](#-class-diagram)
- [Application Flow](#-application-flow)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🔐 **User Authentication** — Register, Login, and Logout
- 🍕 **Browse Restaurants & Menus** — Search and filter food items
- 🛒 **Shopping Cart** — Add, remove, and update quantities
- 📦 **Order Management** — Place orders and track status
- 💳 **Payment Integration** — Secure checkout process
- 📍 **Delivery Tracking** — Real-time order status updates
- 👨‍💼 **Admin Dashboard** — Manage restaurants, menus, and orders
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| **Frontend** | React 18, Vite, Tailwind CSS        |
| **Backend**  | Node.js, Express.js                 |
| **Database** | MySQL / PostgreSQL                  |
| **Styling**  | Tailwind CSS, PostCSS               |
| **Linting**  | ESLint                              |
| **Tools**    | Git, npm, VS Code                   |

---

## 🏗 System Architecture

\`\`\`mermaid
graph TB
    subgraph Client["🖥️ CLIENT (Browser)"]
        UI["React + Vite Frontend"]
        UI --> Pages["Pages: Home, Menu, Order"]
        UI --> Comp["Components: Navbar, Cart, Footer"]
        UI --> State["State Management (Context API)"]
    end
    
    subgraph Server["⚙️ SERVER (Node.js)"]
        API["Express.js Backend"]
        API --> Routes["Routes: /api/users, /api/foods, /api/orders"]
        API --> Ctrl["Controllers: auth, food, order, cart"]
        API --> MW["Middleware: JWT, CORS, Validation"]
    end
    
    subgraph DB["🗄️ DATABASE (SQL)"]
        Users[(Users)]
        Foods[(Foods)]
        Orders[(Orders)]
        Cart[(Cart)]
    end
    
    Client -->|HTTP/REST API| Server
    Server -->|SQL Queries| DB
\`\`\`

---

## 📊 Use Case Diagram

\`\`\`mermaid
graph LR
    Customer((👤 Customer))
    Admin((👨‍💼 Admin))
    Driver((🚴 Driver))
    
    subgraph System["QuickBite System"]
        UC1[Register/Login]
        UC2[Browse Restaurants]
        UC3[Search Food Items]
        UC4[Add to Cart]
        UC5[Place Order]
        UC6[Track Order]
        UC7[Make Payment]
        UC8[Rate & Review]
        UC9[Manage Menu]
        UC10[Manage Orders]
        UC11[Manage Users]
        UC12[View Assigned Orders]
        UC13[Update Delivery Status]
    end
    
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    
    Driver --> UC12
    Driver --> UC13
\`\`\`

---

## 🏛 Class Diagram

\`\`\`mermaid
classDiagram
    class User {
        -int id
        -string name
        -string email
        -string password
        -enum role
        -string phone
        -string address
        +register()
        +login()
        +updateProfile()
        +getOrders()
    }
    
    class Restaurant {
        -int id
        -string name
        -string address
        -string phone
        -float rating
        -string image
        -boolean isActive
        +getMenu()
        +updateInfo()
        +toggleStatus()
    }
    
    class FoodItem {
        -int id
        -string name
        -string description
        -float price
        -string category
        -string image
        -boolean isAvailable
        -int restaurantId
        +updatePrice()
        +toggleAvailability()
    }
    
    class Order {
        -int id
        -int userId
        -float totalAmount
        -enum status
        -string deliveryAddress
        -string paymentMethod
        -datetime createdAt
        +create()
        +updateStatus()
        +cancel()
        +getDetails()
    }
    
    class OrderItem {
        -int id
        -int orderId
        -int foodItemId
        -int quantity
        -float price
        +updateQuantity()
        +calculateSubtotal()
    }
    
    class Cart {
        -int id
        -int userId
        -int foodItemId
        -int quantity
        -datetime createdAt
        +addItem()
        +removeItem()
        +updateQuantity()
        +clearCart()
    }
    
    class Payment {
        -int id
        -int orderId
        -float amount
        -string method
        -enum status
        -string transactionId
        -datetime createdAt
        +processPayment()
        +refund()
        +getReceipt()
    }
    
    User "1" --> "*" Order : places
    Restaurant "1" --> "*" FoodItem : has
    Order "1" --> "*" OrderItem : contains
    OrderItem "*" --> "1" FoodItem : references
    User "1" --> "*" Cart : owns
    Cart "*" --> "1" FoodItem : contains
    Order "1" --> "1" Payment : has
\`\`\`

---

## 🔄 Application Flow

### User Order Flow

\`\`\`mermaid
flowchart LR
    A[Visit Website] --> B[Login/Register]
    B --> C[Browse Menu]
    C --> D[Select Items]
    D --> E[Add to Cart]
    E --> F[Make Payment]
    F --> G[Order Confirmed]
    G --> H[Track Order]
    H --> I[Order Delivered]
    I --> J[Rate & Review]
\`\`\`

### Order Status Flow

\`\`\`mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Confirmed
    Pending --> Cancelled
    Confirmed --> Preparing
    Preparing --> OutForDelivery
    OutForDelivery --> Delivered
    Delivered --> [*]
    Cancelled --> [*]
    
    note right of Cancelled : Refund Initiated
\`\`\`

### Authentication Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>D: Query user
    D-->>B: Return user data
    B->>B: Validate password
    B->>B: Generate JWT token
    B-->>F: Return token + user data
    F->>F: Store token
    F-->>U: Redirect to dashboard
\`\`\`

---

## 🗄 Database Schema

\`\`\`sql
-- Users Table
CREATE TABLE users (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    address     TEXT,
    role        ENUM('customer', 'admin', 'driver') DEFAULT 'customer',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food Items Table
CREATE TABLE food_items (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL,
    category        VARCHAR(50),
    image           VARCHAR(255),
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    user_id             INT NOT NULL,
    total_amount        DECIMAL(10,2) NOT NULL,
    status              ENUM('pending','confirmed','preparing','delivering','delivered','cancelled'),
    delivery_address    TEXT NOT NULL,
    payment_method      VARCHAR(50),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE order_items (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    order_id        INT NOT NULL,
    food_item_id    INT NOT NULL,
    quantity        INT NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

-- Cart Table
CREATE TABLE cart (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT NOT NULL,
    food_item_id    INT NOT NULL,
    quantity        INT DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

-- Payments Table
CREATE TABLE payments (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    order_id        INT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    method          VARCHAR(50),
    status          ENUM('pending','completed','failed','refunded'),
    transaction_id  VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
\`\`\`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** or **PostgreSQL** database
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Chiva-djibril/quickbite-food-delivery.git
   cd quickbite-food-delivery
   \`\`\`

2. **Install frontend dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install backend dependencies**
   \`\`\`bash
   cd backend
   npm install
   cd ..
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   mysql -u root -p < database.sql
   mysql -u root -p < delivery.sql
   \`\`\`

5. **Configure environment variables**
   
   Create `backend/.env`:
   \`\`\`env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=food_delivery
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

6. **Start the backend server**
   \`\`\`bash
   cd backend
   npm start
   \`\`\`

7. **Start the frontend (in a new terminal)**
   \`\`\`bash
   npm run dev
   \`\`\`

8. **Open your browser**
   \`\`\`
   http://localhost:5173
   \`\`\`

---

## 📁 Project Structure

\`\`\`
quickbite-food-delivery/
├── 📂 backend/                 # Express.js Backend
│   ├── 📂 config/             # Database configuration
│   ├── 📂 controllers/        # Route controllers
│   ├── 📂 middleware/         # Auth, validation middleware
│   ├── 📂 models/             # Database models
│   ├── 📂 routes/             # API route definitions
│   ├── 📄 server.js           # Entry point
│   └── 📄 package.json
│
├── 📂 public/                  # Static assets
│   └── 📄 vite.svg
│
├── 📂 src/                     # React Frontend Source
│   ├── 📂 assets/             # Images, icons, fonts
│   ├── 📂 components/         # Reusable UI components
│   │   ├── 📄 Navbar.jsx
│   │   ├── 📄 Footer.jsx
│   │   ├── 📄 FoodCard.jsx
│   │   └── 📄 Cart.jsx
│   ├── 📂 pages/              # Page components
│   │   ├── 📄 Home.jsx
│   │   ├── 📄 Menu.jsx
│   │   ├── 📄 Login.jsx
│   │   ├── 📄 Register.jsx
│   │   ├── 📄 Checkout.jsx
│   │   └── 📄 OrderTracking.jsx
│   ├── 📂 context/            # React Context providers
│   ├── 📂 hooks/              # Custom React hooks
│   ├── 📂 utils/              # Utility functions
│   ├── 📄 App.jsx             # Root component
│   ├── 📄 main.jsx            # Entry point
│   └── 📄 index.css           # Global styles
│
├── 📄 .gitignore
├── 📄 database.sql             # Database schema
├── 📄 delivery.sql             # Delivery data/schema
├── 📄 eslint.config.js         # ESLint configuration
├── 📄 index.html               # HTML entry point
├── 📄 package.json             # Frontend dependencies
├── 📄 package-lock.json
├── 📄 postcss.config.js        # PostCSS configuration
├── 📄 README.md                # This file
├── 📄 tailwind.config.js       # Tailwind CSS configuration
└── 📄 vite.config.js           # Vite configuration
\`\`\`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint             | Description          |
|--------|---------------------|----------------------|
| POST   | `/api/auth/register` | Register new user    |
| POST   | `/api/auth/login`    | Login user           |
| POST   | `/api/auth/logout`   | Logout user          |

### Food Items
| Method | Endpoint              | Description          |
|--------|----------------------|----------------------|
| GET    | `/api/foods`          | Get all food items   |
| GET    | `/api/foods/:id`      | Get food item by ID  |
| POST   | `/api/foods`          | Add new food item    |
| PUT    | `/api/foods/:id`      | Update food item     |
| DELETE | `/api/foods/:id`      | Delete food item     |

### Cart
| Method | Endpoint              | Description          |
|--------|----------------------|----------------------|
| GET    | `/api/cart`           | Get user's cart      |
| POST   | `/api/cart`           | Add item to cart     |
| PUT    | `/api/cart/:id`       | Update cart item     |
| DELETE | `/api/cart/:id`       | Remove cart item     |

### Orders
| Method | Endpoint              | Description          |
|--------|----------------------|----------------------|
| GET    | `/api/orders`         | Get user's orders    |
| GET    | `/api/orders/:id`     | Get order details    |
| POST   | `/api/orders`         | Place new order      |
| PUT    | `/api/orders/:id`     | Update order status  |
| DELETE | `/api/orders/:id`     | Cancel order         |

---

## 📸 Screenshots

> Add your screenshots here

| Home Page | Menu Page |
|-----------|-----------|
| ![Home](screenshots/home.png) | ![Menu](screenshots/menu.png) |

| Cart | Order Tracking |
|------|----------------|
| ![Cart](screenshots/cart.png) | ![Tracking](screenshots/tracking.png) |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Commit** your changes
   \`\`\`bash
   git commit -m "Add amazing feature"
   \`\`\`
4. **Push** to the branch
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Djibril Chiva**
- GitHub: [@Chiva-djibril](https://github.com/Chiva-djibril)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

---

<p align="center">
  Developed by Djibril Chiva
</p>
