-- ============================================
-- Sui Dhaga – MySQL Schema (Database: suidhagha)
-- Full production schema with indexes & FKs
-- ============================================

CREATE DATABASE IF NOT EXISTS `suidhagha` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `suidhagha`;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `image` VARCHAR(500) DEFAULT '',
    `role` ENUM('user', 'tailor', 'admin') NOT NULL DEFAULT 'user',
    `bio` TEXT DEFAULT NULL,
    `location` VARCHAR(255) DEFAULT '',
    `phone` VARCHAR(20) DEFAULT '',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `email_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_created` (`created_at`)
) ENGINE=InnoDB;

-- ============================================
-- 2. PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `tailor_id` INT DEFAULT NULL,
    `rating` DECIMAL(3, 2) DEFAULT 4.50,
    `reviews` INT DEFAULT 0,
    `stock` INT DEFAULT 10,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_products_category` (`category`),
    INDEX `idx_products_tailor` (`tailor_id`),
    INDEX `idx_products_price` (`price`),
    FOREIGN KEY (`tailor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- 3. ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT NOT NULL,
    `tailor_id` INT DEFAULT NULL,
    `service_type` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'STITCHING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL DEFAULT 'PENDING',
    `price` DECIMAL(10, 2) DEFAULT 0.00,
    `payment_status` ENUM('UNPAID', 'PENDING', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
    `stripe_session_id` VARCHAR(255) DEFAULT NULL,
    `stripe_payment_intent` VARCHAR(255) DEFAULT NULL,
    `delivery_address` VARCHAR(100) NOT NULL DEFAULT 'Address Pending',
    `customer_name` VARCHAR(255) DEFAULT NULL,
    `customer_phone` VARCHAR(20) DEFAULT NULL,
    `tracking_number` VARCHAR(100) DEFAULT NULL,
    `measurement_height` DECIMAL(5,2) DEFAULT NULL,
    `measurement_chest` DECIMAL(5,2) DEFAULT NULL,
    `measurement_waist` DECIMAL(5,2) DEFAULT NULL,
    `measurement_hip` DECIMAL(5,2) DEFAULT NULL,
    `measurement_notes` TEXT DEFAULT NULL,
    `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Stripe',
    `order_total` FLOAT NOT NULL DEFAULT 0.00,
    `order_date` DATE NOT NULL DEFAULT (CURRENT_DATE),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_orders_client` (`client_id`),
    INDEX `idx_orders_tailor` (`tailor_id`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_payment` (`payment_status`),
    INDEX `idx_orders_stripe` (`stripe_session_id`),
    FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tailor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- 4. ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT DEFAULT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_image` VARCHAR(500) DEFAULT '',
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_order_items_order` (`order_id`),
    INDEX `idx_order_items_product` (`product_id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- 4.5 PAYMENTS (Per SRS Requirement)
-- ============================================
CREATE TABLE IF NOT EXISTS `payments` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `payment_date` DATE NOT NULL,
    `payment_method` INT NOT NULL,
    `payment_amount` FLOAT NOT NULL,
    `order_id` INT,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 5. POSTS (Tailor Portfolio / Creative Ideas)
-- ============================================
CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `tailor_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_posts_tailor` (`tailor_id`),
    FOREIGN KEY (`tailor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 6. POST IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS `post_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `sort_order` INT DEFAULT 0,
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 7. POST TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS `post_tags` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `tag` VARCHAR(100) NOT NULL,
    INDEX `idx_post_tags_tag` (`tag`),
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 8. POST LIKES
-- ============================================
CREATE TABLE IF NOT EXISTS `post_likes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_post_likes` (`post_id`, `user_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 9. SESSIONS (Login tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS `sessions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `session_token` VARCHAR(255) NOT NULL UNIQUE,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT DEFAULT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_sessions_user` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 10. AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) DEFAULT NULL,
    `entity_id` INT DEFAULT NULL,
    `details` JSON DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_user` (`user_id`),
    INDEX `idx_audit_action` (`action`),
    INDEX `idx_audit_created` (`created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- 11. API KEYS (Future use)
-- ============================================
CREATE TABLE IF NOT EXISTS `api_keys` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `key_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `last_used_at` DATETIME DEFAULT NULL,
    `expires_at` DATETIME DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 12. SUBSCRIPTIONS (Future use)
-- ============================================
CREATE TABLE IF NOT EXISTS `subscriptions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `plan` ENUM('free', 'basic', 'premium', 'enterprise') NOT NULL DEFAULT 'free',
    `stripe_subscription_id` VARCHAR(255) DEFAULT NULL,
    `starts_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ends_at` DATETIME DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- SEED DATA: Default Admin + Sample Products
-- ============================================

-- Default Admin (password: admin123 - bcrypt hash)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'admin@suidhagha.com', '$2a$12$LJ3m4ys3GZvGxKMJwFv9xuZJGqNReYz1jXqKhMFHMVZKxwPzXnHGy', 'admin')
ON DUPLICATE KEY UPDATE `name` = `name`;

-- Sample Tailors
INSERT INTO `users` (`name`, `email`, `password`, `role`, `bio`, `location`, `phone`, `image`) VALUES
('Arjun Verma', 'arjun@suidhagha.com', '$2a$12$LJ3m4ys3GZvGxKMJwFv9xuZJGqNReYz1jXqKhMFHMVZKxwPzXnHGy', 'tailor', 'Expert in ethnic wear and bridal costumes. 15 years of experience in the heart of Delhi.', 'New Delhi, India', '+91 98765 43210', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Saira Khan', 'saira@suidhagha.com', '$2a$12$LJ3m4ys3GZvGxKMJwFv9xuZJGqNReYz1jXqKhMFHMVZKxwPzXnHGy', 'tailor', 'Contemporary silhouettes and modern formal wear expert. Bringing Mumbai style to everyone.', 'Mumbai, India', '+91 98765 43211', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Anwar Qureshi', 'anwar@suidhagha.com', '$2a$12$LJ3m4ys3GZvGxKMJwFv9xuZJGqNReYz1jXqKhMFHMVZKxwPzXnHGy', 'tailor', 'Traditional artisan specializing in sherwanis and heritage coats. Legacy of three generations.', 'Lucknow, India', '+91 98765 43212', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Sample Products
INSERT INTO `products` (`name`, `description`, `price`, `image`, `category`, `tailor_id`, `rating`, `reviews`, `stock`) VALUES
('Signature Navy Suit', 'Bespoke navy blue suit tailored to perfection using premium Italian wool.', 499.00, '/images/suit_design_1.png', 'Suits', 2, 4.80, 124, 5),
('Royal Golden Sherwani', 'Exquisite wedding wear with intricate handcrafted gold embroidery.', 899.00, '/images/ethnic_wear_1.png', 'Ethnic', 4, 4.90, 86, 3),
('Summer Floral Dress', 'Lightweight linen floral dress, custom measured for a perfect summer silhouette.', 129.00, '/images/summer_dress_1.png', 'Dresses', 3, 4.70, 52, 12),
('Egyptian Cotton Formal', 'Crisp white formal shirt made from high-grade long-staple Egyptian cotton.', 79.00, '/images/formal_shirt_1.png', 'Shirts', 2, 4.60, 210, 25),
('Heritage Bandhgala Coat', 'A masterpiece created with traditional heritage techniques for weddings.', 1250.00, '/images/ethnic_wear_1.png', 'Ethnic', 4, 4.95, 45, 4),
('Classic Linen Trouser', 'Perfectly tailored summer linen trousers with a relaxed fit.', 149.00, '/images/formal_shirt_1.png', 'Trousers', 3, 4.50, 78, 15)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Sample Posts
INSERT INTO `posts` (`tailor_id`, `title`, `content`) VALUES
(2, 'Handcrafted Chikankari Saree', 'Exquisite handcrafted chikankari saree with intricate floral motifs and royal aesthetics. Perfect for every occasion.'),
(3, 'Modern Minimalist Suit', 'Custom tailored modern minimalist suit with clean lines and premium wool fabric. Designed for the contemporary professional.'),
(4, 'Heritage Bandhgala Coat', 'A masterpiece created with traditional heritage techniques. Royal bandhgala coat perfect for the wedding season.')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `post_images` (`post_id`, `image_url`, `sort_order`) VALUES
(1, 'https://images.unsplash.com/photo-1610030469983-ca885539c928?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 0),
(2, 'https://images.unsplash.com/photo-1594932224010-75f430537039?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 0),
(3, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 0)
ON DUPLICATE KEY UPDATE `image_url` = VALUES(`image_url`);

INSERT INTO `post_tags` (`post_id`, `tag`) VALUES
(1, 'Traditional'), (1, 'Saree'),
(2, 'Modern'), (2, 'Suit'),
(3, 'Heritage'), (3, 'Royal')
ON DUPLICATE KEY UPDATE `tag` = VALUES(`tag`);
