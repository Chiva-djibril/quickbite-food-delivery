CREATE DATABASE IF NOT EXISTS example;
USE example;

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','preparing','delivered','cancelled') DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Seed Admin
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@food.com');

-- Seed Menu Items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
('Jollof Rice', 'Delicious Nigerian jollof rice with chicken', 15.00, 'Main Course', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'),
('Fried Rice', 'Classic fried rice with vegetables and shrimp', 13.00, 'Main Course', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400'),
('Egusi Soup', 'Traditional egusi soup with assorted meat', 18.00, 'Soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400'),
('Puff Puff', 'Sweet deep-fried dough balls', 5.00, 'Snacks', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
('Grilled Chicken', 'Juicy grilled chicken with special spices', 20.00, 'Protein', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=400'),
('Chapman Drink', 'Classic Nigerian chapman cocktail', 7.00, 'Drinks', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'),
('Peppered Fish', 'Hot and spicy peppered fish', 16.00, 'Protein', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'),
('Moi Moi', 'Steamed bean pudding with eggs', 8.00, 'Snacks', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400');