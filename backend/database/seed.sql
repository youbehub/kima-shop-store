-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Robes', 'robes', 'Magnifiques robes'),
('Abayas', 'abayas', 'Abayas elegantes'),
('Tops', 'tops', 'Tops et blouses'),
('Ensembles', 'ensembles', 'Ensembles parfaits'),
('Chaussures', 'chaussures', 'Chaussures'),
('Sacs', 'sacs', 'Sacs a main'),
('Bijoux', 'bijoux', 'Bijoux et accessoires');

-- Insert products
INSERT INTO products (title, slug, description, price, category_id, featured, image_url) VALUES
('Robe Noir', 'robe-noir', 'Robe noire elegante', 199.99, 1, 1, '/assets/images/dress-1.jpg'),
('Abaya Blanc', 'abaya-blanc', 'Abaya blanche premium', 89.99, 2, 1, '/assets/images/abaya-1.jpg'),
('Blouse Rose', 'blouse-rose', 'Blouse rose en soie', 79.99, 3, 0, '/assets/images/blouse-1.jpg'),
('Ensemble Gris', 'ensemble-gris', 'Ensemble gris luxe', 159.99, 4, 1, '/assets/images/ensemble-1.jpg'),
('Escarpins Or', 'escarpins-or', 'Escarpins dores', 119.99, 5, 0, '/assets/images/shoes-1.jpg'),
('Sac Marron', 'sac-marron', 'Sac a main marron', 149.99, 6, 1, '/assets/images/bag-1.jpg'),
('Collier Or', 'collier-or', 'Collier or elegant', 89.99, 7, 0, '/assets/images/necklace-1.jpg'),
('Robe Fleurs', 'robe-fleurs', 'Robe legere fleuri', 129.99, 1, 1, '/assets/images/dress-2.jpg');

-- Insert product variants
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
(1, 'XS', 'Noir', 'DRESS-001-XS-BLK', 5),
(1, 'S', 'Noir', 'DRESS-001-S-BLK', 8),
(1, 'M', 'Noir', 'DRESS-001-M-BLK', 12),
(1, 'L', 'Noir', 'DRESS-001-L-BLK', 7),
(1, 'XL', 'Noir', 'DRESS-001-XL-BLK', 3),
(2, 'M', 'Blanc', 'ABAYA-001-M-WHT', 15),
(2, 'L', 'Blanc', 'ABAYA-001-L-WHT', 10),
(3, 'S', 'Rose', 'BLOUSE-001-S-RSE', 6),
(3, 'S', 'Bleu', 'BLOUSE-001-S-BLU', 5),
(3, 'M', 'Rose', 'BLOUSE-001-M-RSE', 8),
(3, 'M', 'Bleu', 'BLOUSE-001-M-BLU', 7),
(4, 'S', 'Gris', 'ENS-001-S-GRY', 4),
(4, 'M', 'Gris', 'ENS-001-M-GRY', 6),
(4, 'L', 'Gris', 'ENS-001-L-GRY', 3),
(5, '36', 'Or', 'SHOES-001-36-GLD', 4),
(5, '37', 'Or', 'SHOES-001-37-GLD', 6),
(5, '38', 'Or', 'SHOES-001-38-GLD', 5),
(5, '39', 'Or', 'SHOES-001-39-GLD', 3),
(6, NULL, 'Marron', 'BAG-001-BRWN', 5),
(7, NULL, 'Or', 'NECKLACE-001-GLD', 10),
(8, 'XS', 'Multicolore', 'DRESS-002-XS-MUL', 4),
(8, 'S', 'Multicolore', 'DRESS-002-S-MUL', 6),
(8, 'M', 'Multicolore', 'DRESS-002-M-MUL', 8);

-- Insert additional images for products
INSERT INTO product_images (product_id, url, sort_order) VALUES
(1, '/assets/images/dress-1.jpg', 1),
(1, '/assets/images/dress-1-detail.jpg', 2),
(2, '/assets/images/abaya-1.jpg', 1),
(2, '/assets/images/abaya-1-detail.jpg', 2),
(3, '/assets/images/blouse-1.jpg', 1),
(4, '/assets/images/ensemble-1.jpg', 1),
(5, '/assets/images/shoes-1.jpg', 1),
(6, '/assets/images/bag-1.jpg', 1),
(7, '/assets/images/necklace-1.jpg', 1),
(8, '/assets/images/dress-2.jpg', 1);

-- Create admin user
-- Password hash: "admin123" (generated with bcrypt)
INSERT INTO users (name, email, password_hash, role) VALUES
('Administrateur', 'admin@fashionstore.com', '$2a$10$YJmU0I9qNnWwHKpO3nw3TuBPg9s6FhJq6N9.K9m7L8J5K3J5K3J5K', 'admin');

-- Create customer user for tests
INSERT INTO users (name, email, password_hash, role) VALUES
('Marie Dupont', 'marie@example.com', '$2a$10$YJmU0I9qNnWwHKpO3nw3TuBPg9s6FhJq6N9.K9m7L8J5K3J5K3J5K', 'customer');
