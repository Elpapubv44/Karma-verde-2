<?php
/**
 * Karmaverde — Canje de premios por parte del alumno
 * POST { premio_id }
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/premios.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$premioId = (int)($data['premio_id'] ?? 0);

if ($premioId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID de premio inválido']);
    exit;
}

try {
    $ok = canjearPremio($pdo, (int)$userId, $premioId);
    if (!$ok) {
        http_response_code(400);
        echo json_encode(['error' => 'No se pudo canjear el premio (puntos insuficientes o sin stock)']);
        exit;
    }
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
