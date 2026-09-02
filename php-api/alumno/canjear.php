<?php
/**
 * Karmaverde — Canje de premios por parte del alumno
 * POST { premio_id }
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/premios.php';
checkRateLimit('alumno/canjear', 20, 60);
requireRole(['alumno', 'creador', 'superior']);

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$data = requireJsonRequest();
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
    echo json_encode(['error' => 'No se pudo completar el canje']);
}
