-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2026 at 01:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `delivery`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(5, 'admin1', '$2b$10$rXqVxN8KQ8BKrJZP5FO5/.k0yKHfP3JsM2fK0cFdV7H5eJcEQwVHa', 'admin@quickbite.com', '2026-05-05 15:01:49'),
(8, 'admin', '$2b$10$trLtyaqfRqjQfCHbwoFBS.bdNWZvONekp7j9XM0h8RE2BeSFVrEjO', 'admin@quickbite.com', '2026-05-05 15:09:19');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `fullname` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_picture` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `fullname`, `email`, `password`, `phone`, `address`, `created_at`, `profile_picture`) VALUES
(2, 'Chiva', 'chivadjibril@gmail.com', '$2b$10$4jvJk6oPFz2pKtIT5zSNau1olCMZyKpx.Ka4vG62h5vavQWuApBtK', '+250796409664', 'Kigali', '2026-05-05 14:13:48', 'http://localhost:5000/uploads/1778577892334-595176573.png'),
(3, 'pc__g.rose', 'pcgrose@gmail.com', '$2b$10$4fV8g22w/moLAbIy2gAx6eYGPRSyanh.ltTvbBhzGda9FloTjzHLi', '+250 790000000', 'Mombasa', '2026-05-05 16:27:11', NULL),
(4, 'Kalisa', 'cross@gmail.com', '$2b$10$lgM2HQhaZJMsaDgnY2nJKeA56xPt2FjIINj6pAM4RFF9Fg7jDkcaW', '+250 78888888', 'Kigali', '2026-05-08 12:09:35', NULL),
(6, 'Bava', 'bava@gmail.com', '$2b$10$FFm0WCCl5P2hGb6.//D9l.741f8FgF3.L8t4y8zwFajuJA6SzJ2Ba', '0789295405', 'Kamonyi', '2026-05-12 07:57:19', NULL),
(7, 'Agahozo', 'agahozo@gmail.com', '$2b$10$ZpFO2RhM.d8s9C43.4DjPOY5tbMmwSL7UMO3Je2mdfVCtPul8jy0G', '0791353310', 'Rubavu', '2026-05-17 16:23:34', 'http://localhost:5000/uploads/1779035830812-721081098.jpg'),
(8, 'Andreq', 'andrew@gmail.com', '$2b$10$FAZ7wY.kAkAO09twJJQgkuMqMJROOImAc5t/Cquk/Ifbr0tsNSTvC', '0791863458', 'Kimisagara,Ntaraga', '2026-05-18 13:27:24', 'http://localhost:5000/uploads/1779110928383-737052365.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `description`, `price`, `category`, `image_url`, `available`, `created_at`) VALUES
(1, 'Maize', 'Lural Grown maize', 1200.00, 'Protein', '', 1, '2026-05-05 14:12:17'),
(2, 'Jollof Rice', 'Delicious Nigerian jollof rice with chicken', 15.00, 'Main Course', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', 1, '2026-05-05 15:00:00'),
(3, 'Fried Rice', 'Classic fried rice with vegetables and shrimp', 13.00, 'Main Course', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 1, '2026-05-05 15:00:00'),
(4, 'Egusi Soup', 'Traditional egusi soup with assorted meat', 18.00, 'Soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', 1, '2026-05-05 15:00:00'),
(5, 'Puff Puff', 'Sweet deep-fried dough balls', 5.00, 'Snacks', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', 1, '2026-05-05 15:00:00'),
(6, 'Grilled Chicken', 'Juicy grilled chicken with special spices', 20.00, 'Protein', 'https://tse3.mm.bing.net/th/id/OIP.o1mVxhtKdM_C1-BzO1i3KwHaKO?rs=1&pid=ImgDetMain&o=7&rm=3', 1, '2026-05-05 15:00:00'),
(7, 'Chapman Drink', 'Classic Nigerian chapman cocktail', 7.00, 'Drinks', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', 1, '2026-05-05 15:00:00'),
(8, 'Peppered Fish', 'Hot and spicy peppered fish', 16.00, 'Protein', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 1, '2026-05-05 15:00:00'),
(9, 'Moi Moi', 'Steamed bean pudding with eggs', 8.00, 'Snacks', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', 1, '2026-05-05 15:00:00'),
(13, 'Pumpkins', 'Yummy', 21.00, 'Main Course', 'https://tse1.explicit.bing.net/th/id/OIP.RIKYRbqJvNEeGc3hb2EgOAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', 1, '2026-05-08 11:59:14'),
(14, 'Cassava', 'Lurar area grown cassava', 4.00, 'Energy', 'https://th.bing.com/th/id/OIP.pkPgg_HAvwGxLGL6IR8KKwHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 1, '2026-05-08 14:51:02'),
(17, 'Banana', 'Yellow delicious bananas', 1.00, 'Fruits', 'http://localhost:5000/uploads/1779182154745-677742588.jpg', 1, '2026-05-19 09:15:59');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','preparing','delivered','cancelled') DEFAULT 'pending',
  `delivery_address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_item_id` (`menu_item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
