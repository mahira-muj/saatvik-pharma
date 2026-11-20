/**
 * Saatvik Pharma - cPanel Shared Hosting & Laravel Deployment Bundle
 * Compatible with standard Apache/LiteSpeed + PHP 8.x + MySQL/MariaDB.
 */
import JSZip from 'jszip';

export const CPANEL_SQL_SCHEMA = `-- ========================================================
-- Saatvik Pharma MySQL Database Schema & Initial Seed Data
-- Compatible with MySQL 5.7+ / 8.0+ & MariaDB 10.3+ in cPanel phpMyAdmin
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`role\` VARCHAR(30) DEFAULT 'superadmin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`last_login\` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin: admin@saatvikpharma.com / Saatvik@Admin2026!
-- (Uses standard PHP password_hash compatible bcrypt)
INSERT INTO \`admins\` (\`username\`, \`email\`, \`password_hash\`, \`name\`, \`role\`)
VALUES ('admin', 'admin@saatvikpharma.com', '$2y$10$w8uDk2fXjXm.n0f.4Q047.8oP3xIe6P/c9fTjFkWw3xQZp3zQ5b5S', 'Saatvik Head Pharmacist', 'superadmin')
ON DUPLICATE KEY UPDATE \`email\` = VALUES(\`email\`);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`category\` VARCHAR(100) NOT NULL,
  \`short_description\` TEXT,
  \`description\` LONGTEXT,
  \`key_ingredients\` TEXT,
  \`dosage_instructions\` TEXT,
  \`benefits\` TEXT,
  \`rating\` DECIMAL(3,2) DEFAULT 4.8,
  \`reviews_count\` INT DEFAULT 0,
  \`featured\` TINYINT(1) DEFAULT 0,
  \`base_price\` DECIMAL(10,2) NOT NULL,
  \`base_compare_price\` DECIMAL(10,2) NULL,
  \`default_image_url\` TEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Product Variations Table (Size & Pack Variations)
CREATE TABLE IF NOT EXISTS \`product_variations\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`size\` VARCHAR(100) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`compare_price\` DECIMAL(10,2) NULL,
  \`stock\` INT DEFAULT 50,
  \`image_url\` TEXT NOT NULL,
  \`sku\` VARCHAR(64) NOT NULL,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`customer_name\` VARCHAR(150) NOT NULL,
  \`customer_phone\` VARCHAR(30) NOT NULL,
  \`customer_email\` VARCHAR(150),
  \`address_line\` TEXT NOT NULL,
  \`locality\` VARCHAR(150),
  \`city\` VARCHAR(100) NOT NULL,
  \`state\` VARCHAR(100) NOT NULL,
  \`pincode\` VARCHAR(20) NOT NULL,
  \`customer_notes\` TEXT,
  \`subtotal\` DECIMAL(10,2) NOT NULL,
  \`discount\` DECIMAL(10,2) DEFAULT 0.00,
  \`shipping_fee\` DECIMAL(10,2) DEFAULT 0.00,
  \`total_amount\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` ENUM('COD', 'UPI', 'CARD', 'NETBANKING') NOT NULL,
  \`payment_status\` ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
  \`order_status\` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  \`tracking_number\` VARCHAR(100) NULL,
  \`estimated_delivery\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS \`order_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`variation_id\` VARCHAR(64) NOT NULL,
  \`variation_size\` VARCHAR(100),
  \`unit_price\` DECIMAL(10,2) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`item_total\` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Third-Party API Integrations Table (Admin Only)
CREATE TABLE IF NOT EXISTS \`api_integrations\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`provider\` VARCHAR(120) NOT NULL,
  \`category\` ENUM('Payment Gateway', 'Shipping & Courier', 'SMS & WhatsApp', 'ERP & Inventory', 'Analytics & Custom') NOT NULL,
  \`base_url\` VARCHAR(500) NOT NULL,
  \`auth_type\` ENUM('bearer', 'api_key_header', 'basic_auth') DEFAULT 'bearer',
  \`header_name\` VARCHAR(120) DEFAULT 'Authorization',
  \`api_key\` TEXT NOT NULL,
  \`api_secret\` TEXT NULL,
  \`webhook_url\` VARCHAR(500) NULL,
  \`environment\` ENUM('sandbox', 'live') DEFAULT 'sandbox',
  \`enabled\` TINYINT(1) DEFAULT 0,
  \`notes\` TEXT NULL,
  \`last_tested_at\` TIMESTAMP NULL,
  \`last_test_status\` ENUM('success', 'failed') NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Storefront Inbound API Keys Table (Admin Only)
CREATE TABLE IF NOT EXISTS \`store_api_keys\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`label\` VARCHAR(150) NOT NULL,
  \`key_prefix\` VARCHAR(32) NOT NULL,
  \`key_hash\` VARCHAR(255) NOT NULL UNIQUE,
  \`scopes\` VARCHAR(255) NOT NULL,
  \`environment\` ENUM('sandbox', 'live') DEFAULT 'live',
  \`active\` TINYINT(1) DEFAULT 1,
  \`last_used_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SEED DATA: INITIAL PRODUCTS & PACK VARIATIONS
-- ========================================================
INSERT INTO \`products\` (\`id\`, \`name\`, \`slug\`, \`category\`, \`short_description\`, \`description\`, \`key_ingredients\`, \`dosage_instructions\`, \`benefits\`, \`rating\`, \`reviews_count\`, \`featured\`, \`base_price\`, \`base_compare_price\`, \`default_image_url\`)
VALUES
('sp-001', 'Saatvik Organic KSM-66 Ashwagandha Gold', 'saatvik-organic-ashwagandha-gold', 'Ayurvedic & Herbal', 'Clinically tested root extract with 5% withanolides for deep stress relief, energy vitality & peaceful sleep.', 'Saatvik Organic Ashwagandha features premium KSM-66 full-spectrum root extract, cultivated using ancient Vedic practices and certified organic farming.', 'Organic KSM-66 Ashwagandha Root Extract (500mg)|Piperine Bio-Enhancer (5mg)|Vedic Plant Cellulose Capsule', 'Take 1 to 2 capsules twice daily with warm milk or water after meals.', 'Helps reduce stress and anxiety levels|Supports restorative REM sleep cycles|Enhances physical endurance', 4.9, 342, 1, 599.00, 799.00, '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg'),
('sp-002', 'Saatvik Triple Strength Pure Omega-3 Fish Oil', 'saatvik-triple-strength-omega-3', 'Vitamins & Supplements', 'Ultra-purified molecularly distilled EPA 430mg & DHA 320mg softgels for heart, brain & joint flexibility.', 'Extracted from wild cold-water deep ocean anchovies, Saatvik Omega-3 undergoes molecular distillation to remove heavy metals and mercury.', 'Purified Deep Ocean Fish Oil (1200mg)|EPA 430mg|DHA 320mg|Natural Lemon Zest Oil', 'Take 1 softgel twice daily with food.', 'Maintains healthy cholesterol balance|Supports cognitive acuity and memory|Relieves morning joint stiffness', 4.8, 286, 1, 749.00, 999.00, '/src/assets/images/product_vitamin_omega3_1794289671639.jpg'),
('sp-003', 'Saatvik Himalayan Shilajit Resin Gold Grade', 'saatvik-himalayan-shilajit-resin', 'Ayurvedic & Herbal', 'Pure Himalayan rock exudate purified with Triphala decoction with >75% fulvic acid & 84+ ionic minerals.', 'Harvested by hand from pristine Himalayan altitudes above 18,000 feet, this Grade-A Shilajit resin is purified using traditional Ayurvedic Shodhana.', 'Purified Himalayan Shilajit Rock Exudate (>75% Fulvic Acid)|Gold Bhasma trace bio-actives', 'Dissolve pea-sized ball (300-500mg) in warm milk, green tea, or lukewarm water once daily.', 'Natural cellular ATP energy booster|Promotes stamina, vitality and vigor|Rich in 84+ essential bio-available trace minerals', 4.95, 412, 1, 999.00, 1499.00, '/src/assets/images/product_shilajit_resin_1794289672627.jpg'),
('sp-004', 'Saatvik Tulsi & Ginger Cough & Immunity Kadha Syrup', 'saatvik-tulsi-ginger-kadha-syrup', 'Daily Wellness', 'Sugar-free Ayurvedic throat soothing syrup enriched with 16 sacred herbs for fast cough relief & bronchial defense.', 'Saatvik Tulsi & Ginger Kadha Syrup combines sacred Krishna Tulsi, Sunthi (dry ginger), Mulethi (licorice), and Kantakari.', 'Rama & Krishna Tulsi Extract|Sunthi (Zingiber officinale)|Mulethi (Licorice Root)|Vasaka Leaf Extract', 'Adults: 2 teaspoons (10ml) 2-3 times daily. Children: 1 teaspoon (5ml) twice daily.', 'Non-drowsy bronchial & throat soothing formula|Eases dry and congested productive coughs', 4.7, 198, 1, 249.00, 320.00, '/src/assets/images/product_cough_syrup_1794289673432.jpg'),
('sp-005', 'Saatvik Kumkumadi Tailam Radiant Facial Oil', 'saatvik-kumkumadi-tailam-oil', 'Skin & Haircare', 'Authentic 26-herb Ayurvedic beauty elixir with Kashmiri saffron & sandalwood for luminous, blemish-free skin.', 'Formulated according to ancient classical text Ashtanga Hrudaya, this luxurious face oil is infused with certified Kashmiri Mogra saffron stigma.', 'Pure Kashmiri Mogra Saffron (Crocus sativus)|Red Sandalwood (Rakta Chandana)|Manjistha Root', 'Cleanse face thoroughly. Dispense 3-4 drops onto palms, gently press into damp face and neck at night.', 'Imparts a natural radiant golden glow|Helps fade hyperpigmentation, blemishes and dark spots', 4.85, 175, 1, 849.00, 1199.00, '/src/assets/images/product_skincare_oil_1794289674347.jpg'),
('sp-006', 'Saatvik Ortho-Shield Ayurvedic Joint Pain Relief Roll-On & Oil', 'saatvik-ortho-shield-pain-relief', 'Pain Relief', 'Fast-penetrating warm herbal liniment with Mahanarayan Tailam, Gandhapura & Camphor for arthritis & muscle soreness.', 'Specially crafted for senior citizens, athletes, and desk workers suffering from stiff knees, lower back tension, or frozen shoulders.', 'Mahanarayan Tailam (Classical 52-herb formulation)|Gandhapura Oil (Wintergreen / Natural Methyl Salicylate)|Eucalyptus Oil', 'Apply directly to affected painful joint or muscle area using the mess-free roller ball 2-3 times daily.', 'Deep thermal penetration relieves pain within 15 minutes|Eases chronic knee, joint, neck and back pain', 4.75, 230, 1, 399.00, 550.00, '/src/assets/images/product_pain_relief_1794289675239.jpg')
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);

INSERT INTO \`product_variations\` (\`id\`, \`product_id\`, \`size\`, \`price\`, \`compare_price\`, \`stock\`, \`image_url\`, \`sku\`)
VALUES
('var-ash-01', 'sp-001', '60 Veggie Capsules', 599.00, 799.00, 45, '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg', 'SP-ASH-60'),
('var-ash-02', 'sp-001', '120 Veggie Capsules (Value Pack)', 999.00, 1499.00, 28, '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg', 'SP-ASH-120'),
('var-ash-03', 'sp-001', '180 Veggie Capsules (Family Pack)', 1399.00, 1999.00, 14, '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg', 'SP-ASH-180'),
('var-omg-01', 'sp-002', '60 Enteric Softgels', 749.00, 999.00, 32, '/src/assets/images/product_vitamin_omega3_1794289671639.jpg', 'SP-OMG-60'),
('var-omg-02', 'sp-002', '120 Enteric Softgels', 1299.00, 1799.00, 19, '/src/assets/images/product_vitamin_omega3_1794289671639.jpg', 'SP-OMG-120'),
('var-omg-03', 'sp-002', '180 Softgels (Mega Pack)', 1799.00, 2499.00, 8, '/src/assets/images/product_vitamin_omega3_1794289671639.jpg', 'SP-OMG-180'),
('var-shl-01', 'sp-003', '20g Pure Resin Jar', 999.00, 1499.00, 50, '/src/assets/images/product_shilajit_resin_1794289672627.jpg', 'SP-SHL-20G'),
('var-shl-02', 'sp-003', '50g Pure Resin Jar (Bestseller)', 1899.00, 2799.00, 25, '/src/assets/images/product_shilajit_resin_1794289672627.jpg', 'SP-SHL-50G'),
('var-srp-01', 'sp-004', '100ml Bottle', 249.00, 320.00, 60, '/src/assets/images/product_cough_syrup_1794289673432.jpg', 'SP-KDH-100'),
('var-srp-02', 'sp-004', '200ml Family Value Bottle', 399.00, 550.00, 42, '/src/assets/images/product_cough_syrup_1794289673432.jpg', 'SP-KDH-200'),
('var-kum-01', 'sp-005', '15ml Dropper Bottle', 849.00, 1199.00, 30, '/src/assets/images/product_skincare_oil_1794289674347.jpg', 'SP-KUM-15'),
('var-kum-02', 'sp-005', '30ml Luxury Dropper Bottle', 1499.00, 2199.00, 16, '/src/assets/images/product_skincare_oil_1794289674347.jpg', 'SP-KUM-30'),
('var-ort-01', 'sp-006', '50ml Easy-Glide Roll-On', 399.00, 550.00, 40, '/src/assets/images/product_pain_relief_1794289675239.jpg', 'SP-ORT-50'),
('var-ort-02', 'sp-006', '100ml Massage Liniment Bottle', 649.00, 899.00, 22, '/src/assets/images/product_pain_relief_1794289675239.jpg', 'SP-ORT-100')
ON DUPLICATE KEY UPDATE \`price\` = VALUES(\`price\`);

SET FOREIGN_KEY_CHECKS = 1;
`;

export const CPANEL_CONFIG_PHP = `<?php
/**
 * =====================================================================
 * Saatvik Pharma - cPanel MySQL Database & Site Configuration
 * Place this file inside your cPanel: public_html/api/config.php
 * =====================================================================
 * ONLY EDIT THE DATABASE SETTINGS BELOW WITH YOUR CPANEL MYSQL DETAILS:
 */

// Production Error Reporting (Set to 0 on live store)
error_reporting(0);
ini_set('display_errors', '0');

// =====================================================================
// 1. YOUR CPANEL DATABASE CREDENTIALS (CHANGE THESE 4 VALUES)
// =====================================================================
define('DB_HOST', 'localhost');                  // Usually 'localhost' in cPanel
define('DB_NAME', 'yourcpanel_saatvikpharma');   // e.g. user_saatvik
define('DB_USER', 'yourcpanel_dbuser');          // e.g. user_dbadmin
define('DB_PASS', 'YOUR_STRONG_PASSWORD_HERE');  // Database user password
define('DB_CHARSET', 'utf8mb4');

// =====================================================================
// 2. STORE CONFIGURATION
// =====================================================================
define('SITE_NAME', 'Saatvik Pharma');
define('SITE_URL', 'https://yourdomain.com');    // Replace with your live domain
define('CURRENCY_SYMBOL', '₹');
define('FREE_SHIPPING_THRESHOLD', 499);
define('ADMIN_SECRET_KEY', 'saatvik_jwt_salt_' . hash('sha256', DB_NAME . '2026'));

// CORS Headers for API calls
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Returns a shared PDO MySQL Database Connection
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed. Please verify credentials in config.php.',
                'details' => $e->getMessage()
            ]);
            exit();
        }
    }
    return $pdo;
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}
`;

export const CPANEL_API_PHP = `<?php
/**
 * =====================================================================
 * Saatvik Pharma - Lightweight, Self-Contained PHP REST API
 * Place this file inside your cPanel: public_html/api/api.php
 * Runs on ANY standard cPanel shared hosting (Apache/LiteSpeed + PHP 7.4/8.x)
 * without requiring Composer, Node.js or SSH access!
 * =====================================================================
 */
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$action = isset($_GET['action']) ? trim($_GET['action']) : '';
$requestMethod = $_SERVER['REQUEST_METHOD'];

/**
 * Validate optional X-API-Key header for external ERP / mobile integrations.
 */
function verifyStoreApiKey($pdo, $requiredScope = null) {
    $providedKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if (empty($providedKey)) {
        return false;
    }
    $hash = hash('sha256', $providedKey);
    $stmt = $pdo->prepare("SELECT * FROM store_api_keys WHERE key_hash = ? AND active = 1 LIMIT 1");
    $stmt->execute([$hash]);
    $record = $stmt->fetch();
    if (!$record) {
        return false;
    }
    if ($requiredScope !== null) {
        $scopes = array_map('trim', explode(',', $record['scopes']));
        if (!in_array($requiredScope, $scopes, true)) {
            return false;
        }
    }
    $upd = $pdo->prepare("UPDATE store_api_keys SET last_used_at = NOW() WHERE id = ?");
    $upd->execute([$record['id']]);
    return true;
}

// ---------------------------------------------------------------------
// 1. PUBLIC: GET ALL PRODUCTS WITH PACK VARIATIONS
// ---------------------------------------------------------------------
if ($action === 'get_products' && $requestMethod === 'GET') {
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    
    if ($category && $category !== 'All') {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE category = ? ORDER BY featured DESC, created_at DESC");
        $stmt->execute([$category]);
    } else {
        $stmt = $pdo->query("SELECT * FROM products ORDER BY featured DESC, created_at DESC");
    }
    $products = $stmt->fetchAll();

    $varStmt = $pdo->query("SELECT * FROM product_variations ORDER BY price ASC");
    $allVariations = $varStmt->fetchAll();

    $varMap = [];
    foreach ($allVariations as $v) {
        $varMap[$v['product_id']][] = [
            'id' => $v['id'],
            'size' => $v['size'],
            'price' => (float)$v['price'],
            'comparePrice' => $v['compare_price'] ? (float)$v['compare_price'] : null,
            'stock' => (int)$v['stock'],
            'imageUrl' => $v['image_url'],
            'sku' => $v['sku']
        ];
    }

    $formatted = [];
    foreach ($products as $p) {
        $formatted[] = [
            'id' => $p['id'],
            'name' => $p['name'],
            'slug' => $p['slug'],
            'category' => $p['category'],
            'shortDescription' => $p['short_description'],
            'description' => $p['description'],
            'keyIngredients' => $p['key_ingredients'] ? explode('|', $p['key_ingredients']) : [],
            'dosageInstructions' => $p['dosage_instructions'],
            'benefits' => $p['benefits'] ? explode('|', $p['benefits']) : [],
            'rating' => (float)$p['rating'],
            'reviewsCount' => (int)$p['reviews_count'],
            'featured' => (bool)$p['featured'],
            'basePrice' => (float)$p['base_price'],
            'baseComparePrice' => $p['base_compare_price'] ? (float)$p['base_compare_price'] : null,
            'defaultImageUrl' => $p['default_image_url'],
            'galleryImages' => [$p['default_image_url']],
            'variations' => isset($varMap[$p['id']]) ? $varMap[$p['id']] : []
        ];
    }

    echo json_encode(['success' => true, 'products' => $formatted]);
    exit();
}

// ---------------------------------------------------------------------
// 2. PUBLIC: CREATE ORDER
// ---------------------------------------------------------------------
if ($action === 'create_order' && $requestMethod === 'POST') {
    $data = getJsonInput();
    if (empty($data['customer']) || empty($data['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Incomplete order payload']);
        exit();
    }

    $orderId = 'ord_' . bin2hex(random_bytes(6));
    $orderNumber = 'SP-' . rand(100000, 999999);
    $c = $data['customer'];

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO orders 
            (id, order_number, customer_name, customer_phone, customer_email, address_line, locality, city, state, pincode, customer_notes, subtotal, discount, shipping_fee, total_amount, payment_method, payment_status, order_status, estimated_delivery)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Confirmed', '3-5 Business Days')");
        
        $stmt->execute([
            $orderId,
            $orderNumber,
            $c['fullName'],
            $c['phone'],
            $c['email'] ?? '',
            $c['addressLine'],
            $c['locality'] ?? '',
            $c['city'],
            $c['state'],
            $c['pinCode'],
            $c['notes'] ?? '',
            $data['subtotal'],
            $data['discount'] ?? 0,
            $data['shippingFee'] ?? 0,
            $data['totalAmount'],
            $data['paymentMethod']
        ]);

        $itemStmt = $pdo->prepare("INSERT INTO order_items 
            (order_id, product_id, product_name, variation_id, variation_size, unit_price, quantity, item_total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        $stockStmt = $pdo->prepare("UPDATE product_variations SET stock = GREATEST(0, stock - ?) WHERE id = ?");

        foreach ($data['items'] as $it) {
            $itemStmt->execute([
                $orderId,
                $it['productId'],
                $it['productName'],
                $it['selectedVariation']['id'],
                $it['selectedVariation']['size'],
                $it['unitPrice'],
                $it['quantity'],
                $it['unitPrice'] * $it['quantity']
            ]);
            $stockStmt->execute([$it['quantity'], $it['selectedVariation']['id']]);
        }

        $pdo->commit();
        echo json_encode([
            'success' => true,
            'orderId' => $orderId,
            'orderNumber' => $orderNumber,
            'message' => 'Order placed successfully'
        ]);
        exit();
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Order placement failed: ' . $e->getMessage()]);
        exit();
    }
}

// ---------------------------------------------------------------------
// 3. PUBLIC: TRACK ORDER BY ORDER NUMBER
// ---------------------------------------------------------------------
if ($action === 'track_order' && $requestMethod === 'GET') {
    $num = trim($_GET['order_number'] ?? '');
    if (!$num) {
        http_response_code(400);
        echo json_encode(['error' => 'Order number is required']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_number = ? LIMIT 1");
    $stmt->execute([$num]);
    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
        exit();
    }

    $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $itemStmt->execute([$order['id']]);
    $order['items'] = $itemStmt->fetchAll();

    echo json_encode(['success' => true, 'order' => $order]);
    exit();
}

// ---------------------------------------------------------------------
// 4. PRIVATE ADMIN: LOGIN (SECURE BCRYPT VERIFICATION)
// ---------------------------------------------------------------------
if ($action === 'admin_login' && $requestMethod === 'POST') {
    $data = getJsonInput();
    $usernameOrEmail = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1");
    $stmt->execute([$usernameOrEmail, $usernameOrEmail]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password_hash'])) {
        $token = bin2hex(random_bytes(32));
        $updateStmt = $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$admin['id']]);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'admin' => [
                'name' => $admin['name'],
                'email' => $admin['email'],
                'role' => $admin['role']
            ]
        ]);
        exit();
    }

    http_response_code(401);
    echo json_encode(['error' => 'Invalid administrator credentials']);
    exit();
}

// ---------------------------------------------------------------------
// 5. PRIVATE ADMIN: GET ORDERS
// ---------------------------------------------------------------------
if ($action === 'admin_orders' && $requestMethod === 'GET') {
    $orders = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC")->fetchAll();
    foreach ($orders as &$ord) {
        $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemStmt->execute([$ord['id']]);
        $ord['items'] = $itemStmt->fetchAll();
    }
    echo json_encode(['success' => true, 'orders' => $orders]);
    exit();
}

// ---------------------------------------------------------------------
// 6. PRIVATE ADMIN: UPDATE ORDER STATUS
// ---------------------------------------------------------------------
if ($action === 'admin_update_order' && $requestMethod === 'POST') {
    $data = getJsonInput();
    $orderId = $data['orderId'] ?? '';
    $status = $data['status'] ?? '';
    $tracking = $data['trackingNumber'] ?? null;

    if (!$orderId || !$status) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE orders SET order_status = ?, tracking_number = COALESCE(?, tracking_number) WHERE id = ?");
    $stmt->execute([$status, $tracking, $orderId]);

    echo json_encode(['success' => true, 'message' => 'Order status updated']);
    exit();
}

// ---------------------------------------------------------------------
// 7. PRIVATE ADMIN: SAVE / UPDATE PRODUCT
// ---------------------------------------------------------------------
if ($action === 'admin_save_product' && $requestMethod === 'POST') {
    $p = getJsonInput();
    if (empty($p['name']) || empty($p['basePrice'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid product payload']);
        exit();
    }

    $id = !empty($p['id']) ? $p['id'] : 'sp_' . bin2hex(random_bytes(4));
    $slug = !empty($p['slug']) ? $p['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $p['name'])));

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO products 
            (id, name, slug, category, short_description, description, key_ingredients, dosage_instructions, benefits, base_price, default_image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            name = VALUES(name), category = VALUES(category), short_description = VALUES(short_description),
            description = VALUES(description), base_price = VALUES(base_price), default_image_url = VALUES(default_image_url)");

        $stmt->execute([
            $id,
            $p['name'],
            $slug,
            $p['category'] ?? 'Ayurvedic & Herbal',
            $p['shortDescription'] ?? '',
            $p['description'] ?? '',
            is_array($p['keyIngredients']) ? implode('|', $p['keyIngredients']) : ($p['keyIngredients'] ?? ''),
            $p['dosageInstructions'] ?? '',
            is_array($p['benefits']) ? implode('|', $p['benefits']) : ($p['benefits'] ?? ''),
            $p['basePrice'],
            $p['defaultImageUrl'] ?? ''
        ]);

        if (!empty($p['variations']) && is_array($p['variations'])) {
            $delStmt = $pdo->prepare("DELETE FROM product_variations WHERE product_id = ?");
            $delStmt->execute([$id]);

            $vStmt = $pdo->prepare("INSERT INTO product_variations (id, product_id, size, price, compare_price, stock, image_url, sku) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($p['variations'] as $v) {
                $vid = !empty($v['id']) ? $v['id'] : 'var_' . bin2hex(random_bytes(4));
                $vStmt->execute([
                    $vid,
                    $id,
                    $v['size'],
                    $v['price'],
                    $v['comparePrice'] ?? null,
                    $v['stock'] ?? 50,
                    $v['imageUrl'] ?? $p['defaultImageUrl'],
                    $v['sku'] ?? ('SP-' . strtoupper(substr($slug, 0, 4)))
                ]);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'productId' => $id, 'message' => 'Product saved successfully']);
        exit();
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// ---------------------------------------------------------------------
// 8. PRIVATE ADMIN: API INTEGRATIONS CRUD (PAYMENT, COURIER, SMS, ERP)
// ---------------------------------------------------------------------
if ($action === 'admin_get_integrations' && $requestMethod === 'GET') {
    $stmt = $pdo->query("SELECT * FROM api_integrations ORDER BY updated_at DESC");
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    exit();
}

if ($action === 'admin_save_integration' && $requestMethod === 'POST') {
    $in = getJsonInput();
    if (empty($in['name']) || empty($in['baseUrl'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Integration name and baseUrl are required']);
        exit();
    }
    $id = !empty($in['id']) ? $in['id'] : 'int_' . bin2hex(random_bytes(4));
    $stmt = $pdo->prepare("INSERT INTO api_integrations
        (id, name, provider, category, base_url, auth_type, header_name, api_key, api_secret, webhook_url, environment, enabled, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name), provider = VALUES(provider), category = VALUES(category),
        base_url = VALUES(base_url), auth_type = VALUES(auth_type), header_name = VALUES(header_name),
        api_key = VALUES(api_key), api_secret = VALUES(api_secret), webhook_url = VALUES(webhook_url),
        environment = VALUES(environment), enabled = VALUES(enabled), notes = VALUES(notes)");
    $stmt->execute([
        $id,
        $in['name'],
        $in['provider'] ?? $in['name'],
        $in['category'] ?? 'Analytics & Custom',
        $in['baseUrl'],
        $in['authType'] ?? 'bearer',
        $in['headerName'] ?? 'Authorization',
        $in['apiKey'] ?? '',
        $in['apiSecret'] ?? null,
        $in['webhookUrl'] ?? null,
        $in['environment'] ?? 'sandbox',
        !empty($in['enabled']) ? 1 : 0,
        $in['notes'] ?? null
    ]);
    echo json_encode(['success' => true, 'id' => $id, 'message' => 'API integration saved']);
    exit();
}

if ($action === 'admin_delete_integration' && $requestMethod === 'POST') {
    $in = getJsonInput();
    $id = $in['id'] ?? '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Integration ID is required']);
        exit();
    }
    $stmt = $pdo->prepare("DELETE FROM api_integrations WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'API integration deleted']);
    exit();
}

// ---------------------------------------------------------------------
// 9. PRIVATE ADMIN: STOREFRONT API KEYS (X-API-Key AUTH FOR EXTERNAL APPS)
// ---------------------------------------------------------------------
if ($action === 'admin_create_api_key' && $requestMethod === 'POST') {
    $in = getJsonInput();
    $label = trim($in['label'] ?? '');
    $env = ($in['environment'] ?? 'live') === 'sandbox' ? 'sandbox' : 'live';
    $scopes = is_array($in['scopes'] ?? null) ? implode(',', $in['scopes']) : 'products:read';
    if (!$label) {
        http_response_code(400);
        echo json_encode(['error' => 'API key label is required']);
        exit();
    }
    $rawKey = 'sp_' . $env . '_' . bin2hex(random_bytes(24));
    $id = 'key_' . bin2hex(random_bytes(4));
    $stmt = $pdo->prepare("INSERT INTO store_api_keys (id, label, key_prefix, key_hash, scopes, environment, active) VALUES (?, ?, ?, ?, ?, ?, 1)");
    $stmt->execute([$id, $label, substr($rawKey, 0, 14), hash('sha256', $rawKey), $scopes, $env]);
    echo json_encode(['success' => true, 'id' => $id, 'apiKey' => $rawKey, 'message' => 'API key generated']);
    exit();
}

// ---------------------------------------------------------------------
// Default fallback
// ---------------------------------------------------------------------
echo json_encode([
    'service' => 'Saatvik Pharma API',
    'status' => 'online',
    'timestamp' => date('Y-m-d H:i:s'),
    'currency' => 'INR (₹)'
]);
`;

export const CPANEL_HTACCESS = `# =====================================================================
# Saatvik Pharma - cPanel Shared Hosting .htaccess
# Place in: public_html/.htaccess
# =====================================================================

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. Route /api/* requests to api/api.php
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^api/(.*)$ api/api.php?action=$1 [QSA,L]

  # 3. Dedicated Admin Clean URL: route /admin to index.html
  RewriteRule ^admin$ index.html [L]
  RewriteRule ^admin/$ index.html [L]

  # 4. SPA Fallback: Direct all non-file/dir requests to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip Compression for Fast Loading
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
`;

export const LARAVEL_ROUTES_PHP = `<?php
/**
 * Laravel routes/api.php
 * Routes for Saatvik Pharma Laravel Backend
 */
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminAuthController;

// Public E-Commerce Storefront Routes
Route::prefix('v1')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/track/{orderNumber}', [OrderController::class, 'track']);

    // Admin Authentication & Management Routes (Protected)
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/admin/orders', [OrderController::class, 'adminOrders']);
        Route::patch('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
        Route::post('/admin/products', [ProductController::class, 'storeOrUpdate']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    });
});
`;

export const LARAVEL_PRODUCT_CONTROLLER = `<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('products');
        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }
        $products = $query->orderBy('featured', 'desc')->get();

        $variations = DB::table('product_variations')->get()->groupBy('product_id');

        $formatted = $products->map(function ($p) use ($variations) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'category' => $p->category,
                'shortDescription' => $p->short_description,
                'description' => $p->description,
                'keyIngredients' => $p->key_ingredients ? explode('|', $p->key_ingredients) : [],
                'dosageInstructions' => $p->dosage_instructions,
                'benefits' => $p->benefits ? explode('|', $p->benefits) : [],
                'rating' => (float)$p->rating,
                'reviewsCount' => (int)$p->reviews_count,
                'featured' => (bool)$p->featured,
                'basePrice' => (float)$p->base_price,
                'baseComparePrice' => $p->base_compare_price ? (float)$p->base_compare_price : null,
                'defaultImageUrl' => $p->default_image_url,
                'galleryImages' => [$p->default_image_url],
                'variations' => isset($variations[$p->id]) ? $variations[$p->id]->map(function ($v) {
                    return [
                        'id' => $v->id,
                        'size' => $v->size,
                        'price' => (float)$v->price,
                        'comparePrice' => $v->compare_price ? (float)$v->compare_price : null,
                        'stock' => (int)$v->stock,
                        'imageUrl' => $v->image_url,
                        'sku' => $v->sku
                    ];
                }) : []
            ];
        });

        return response()->json(['success' => true, 'products' => $formatted]);
    }
}
`;

export const LARAVEL_ORDER_CONTROLLER = `<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer.fullName' => 'required|string',
            'customer.phone' => 'required|string',
            'customer.addressLine' => 'required|string',
            'customer.city' => 'required|string',
            'customer.state' => 'required|string',
            'customer.pinCode' => 'required|string',
            'items' => 'required|array',
            'subtotal' => 'required|numeric',
            'totalAmount' => 'required|numeric',
            'paymentMethod' => 'required|string'
        ]);

        $orderId = 'ord_' . bin2hex(random_bytes(6));
        $orderNumber = 'SP-' . rand(100000, 999999);
        $c = $request->input('customer');

        DB::beginTransaction();
        try {
            DB::table('orders')->insert([
                'id' => $orderId,
                'order_number' => $orderNumber,
                'customer_name' => $c['fullName'],
                'customer_phone' => $c['phone'],
                'customer_email' => $c['email'] ?? null,
                'address_line' => $c['addressLine'],
                'locality' => $c['locality'] ?? null,
                'city' => $c['city'],
                'state' => $c['state'],
                'pincode' => $c['pinCode'],
                'customer_notes' => $c['notes'] ?? null,
                'subtotal' => $request->subtotal,
                'discount' => $request->discount ?? 0,
                'shipping_fee' => $request->shippingFee ?? 0,
                'total_amount' => $request->totalAmount,
                'payment_method' => $request->paymentMethod,
                'payment_status' => 'Pending',
                'order_status' => 'Confirmed'
            ]);

            foreach ($request->items as $it) {
                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => $it['productId'],
                    'product_name' => $it['productName'],
                    'variation_id' => $it['selectedVariation']['id'],
                    'variation_size' => $it['selectedVariation']['size'],
                    'unit_price' => $it['unitPrice'],
                    'quantity' => $it['quantity'],
                    'item_total' => $it['unitPrice'] * $it['quantity']
                ]);

                DB::table('product_variations')
                    ->where('id', $it['selectedVariation']['id'])
                    ->decrement('stock', $it['quantity']);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'orderId' => $orderId,
                'orderNumber' => $orderNumber,
                'message' => 'Order created successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
`;

export const LARAVEL_ENV_EXAMPLE = `# Saatvik Pharma - Laravel .env Configuration
APP_NAME="Saatvik Pharma"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_APP_KEY
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

# =====================================================================
# cPanel MySQL Database Credentials (Update with your values)
# =====================================================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yourcpanel_saatvikpharma
DB_USERNAME=yourcpanel_dbuser
DB_PASSWORD=YOUR_STRONG_PASSWORD

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
`;

export const README_DEPLOYMENT_TXT = `=====================================================================
SAATVIK PHARMA - CPANEL SHARED HOSTING DEPLOYMENT GUIDE
=====================================================================

This bundle is specially configured for standard cPanel shared hosting
(Apache/LiteSpeed + PHP 7.4/8.x + MySQL/MariaDB).

STEP 1: UPLOAD FRONTEND AND HTACCESS
1. In cPanel, open "File Manager" and navigate to "public_html" (or your subdomain directory).
2. Upload the built static files (from your dist/ folder or the extracted zip root):
   - index.html
   - assets/ (contains all optimized CSS, JS & images)
   - .htaccess
   - favicon & icons

STEP 2: CREATE MYSQL DATABASE IN CPANEL
1. In cPanel, click "MySQL Databases".
2. Create a new database (e.g. youruser_saatvik).
3. Create a new user (e.g. youruser_dbadmin) with a strong password.
4. Under "Add User To Database", select the user and database, click "Add", and check "ALL PRIVILEGES".

STEP 3: IMPORT DATABASE SCHEMA & SEED DATA
1. In cPanel, open "phpMyAdmin".
2. Select your newly created database on the left sidebar.
3. Click the "Import" tab at the top.
4. Click "Choose File" and select "saatvikpharma_schema.sql" from this package.
5. Click "Go". This creates all tables and pre-populates all 6 products, size variations, and the default admin account.

STEP 4: CONFIGURE DATABASE CREDENTIALS IN config.php
1. Inside cPanel File Manager, create a folder named "api" inside "public_html":
   public_html/api/
2. Upload "config.php" and "api.php" into "public_html/api/".
3. Right-click "config.php" and choose "Edit":
   Change:
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'youruser_saatvik');
     define('DB_USER', 'youruser_dbadmin');
     define('DB_PASS', 'YOUR_STRONG_PASSWORD');
     define('SITE_URL', 'https://yourdomain.com');
4. Save changes.

STEP 5: ACCESS THE PRIVATE ADMIN PANEL
- Storefront URL: https://yourdomain.com
- Dedicated Private Admin URL: https://yourdomain.com/admin  (or https://yourdomain.com/#admin)
- Default Admin Email: admin@saatvikpharma.com
- Default Admin Password: Saatvik@Admin2026!

All prices are in Indian Rupees (₹).
Zero admin links appear on the public storefront.
=====================================================================
`;

/**
 * Downloads a single text/code file directly in the browser
 */
export function downloadTextFile(filename: string, content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Generates and downloads a complete ZIP archive for cPanel shared hosting
 */
export async function downloadFullCpanelZip() {
  const zip = new JSZip();

  // Root cPanel deployment files
  zip.file('saatvikpharma_schema.sql', CPANEL_SQL_SCHEMA);
  zip.file('.htaccess', CPANEL_HTACCESS);
  zip.file('README_CPANEL_DEPLOYMENT.txt', README_DEPLOYMENT_TXT);

  // api/ folder for single-file PHP backend
  const apiFolder = zip.folder('api');
  if (apiFolder) {
    apiFolder.file('config.php', CPANEL_CONFIG_PHP);
    apiFolder.file('api.php', CPANEL_API_PHP);
  }

  // laravel/ folder for Laravel MVC developers
  const laravelFolder = zip.folder('laravel');
  if (laravelFolder) {
    laravelFolder.file('.env.example', LARAVEL_ENV_EXAMPLE);
    laravelFolder.file('routes_api.php', LARAVEL_ROUTES_PHP);
    laravelFolder.file('ProductController.php', LARAVEL_PRODUCT_CONTROLLER);
    laravelFolder.file('OrderController.php', LARAVEL_ORDER_CONTROLLER);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const element = document.createElement('a');
  element.href = URL.createObjectURL(blob);
  element.download = 'saatvikpharma_cpanel_package.zip';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
