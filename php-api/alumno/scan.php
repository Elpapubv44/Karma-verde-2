<?php
/**
 * Karmaverde — Escaneo de material (sumar puntos)
 * POST { material, puntos }
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$material = trim($data['material'] ?? 'generico');
$puntos = (int)($data['puntos'] ?? 0);

if ($puntos <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Puntos inválidos']);
    exit;
}

sumarPuntos($pdo, (int)$userId, $puntos, $material);

$user = usuarioPorId($pdo, (int)$userId);
echo json_encode([
    'ok' => true,
    'puntos' => (int)($user['puntos'] ?? 0),
]);
