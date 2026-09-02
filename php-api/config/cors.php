<?php
/** Shared, credential-safe CORS policy for the PHP API. */

$configuredOrigin = getenv('FRONTEND_URL') ?: '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($configuredOrigin !== '' && $origin === $configuredOrigin) {
    header("Access-Control-Allow-Origin: $configuredOrigin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, Authorization');
header('Access-Control-Max-Age: 600');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
