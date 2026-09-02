<?php
/**
 * Karmaverde — Escaneo de material (sumar puntos)
 * POST { material, puntos }
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';
checkRateLimit('alumno/scan', 30, 60);
requireRole(['alumno', 'creador', 'superior']);

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$data = requireJsonRequest();
$material = trim($data['material'] ?? 'generico');
$puntos = (int)($data['puntos'] ?? 0);

if ($puntos <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Puntos inválidos']);
    exit;
}
$materialesValidos = ['PET', 'carton', 'papel', 'vidrio', 'metal', 'organico', 'plastico'];
if (!in_array(mb_strtolower($material), $materialesValidos, true)) {
    jsonError(400, 'Material no válido');
}

sumarPuntos($pdo, (int)$userId, $puntos, $material);

$user = usuarioPorId($pdo, (int)$userId);
echo json_encode([
    'ok' => true,
    'puntos' => (int)($user['puntos'] ?? 0),
]);
