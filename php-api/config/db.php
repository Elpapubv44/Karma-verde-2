<?php
/**
 * Karmaverde — Conexión abierta a MySQL con PDO y soporte CORS / Session.
 */

// Headers CORS para permitir peticiones del frontend (SPA)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ————— Credenciales de la base de datos —————
$host     = getenv('DB_HOST') ?: 'localhost';
$dbname   = getenv('DB_NAME') ?: 'karmaverde';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';
$charset  = 'utf8mb4';

// ————— Códigos Especiales de Acceso —————
define('KARMAVERDE_CREATOR_CODE',  'KARMA-VERDE-2026');
define('KARMAVERDE_SUPERIOR_CODE', 'KARMA-SUPER-2026');
define('KARMAVERDE_ASOCIADO_CODE', 'KARMA-ESCUELA-2026');

// ————— Conexión PDO —————
$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'DB connection failed', 'detail' => $e->getMessage()]);
    exit;
}
