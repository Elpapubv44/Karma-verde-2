<?php
/**
 * Karmaverde — Validación y consumo de código QR
 * POST { codigo }
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado. Iniciá sesión.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$raw = trim($data['codigo'] ?? '');

if ($raw === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Código QR vacío']);
    exit;
}

// 1. Intentar parsear formato KV-v1: JSON { "app": "karmaverde", "id": "...", "pts": 50, "mat": "plastico" }
$qrId = null;
$puntos = 0;
$material = 'generico';

$parsed = json_decode($raw, true);
if (is_array($parsed) && ($parsed['app'] ?? '') === 'karmaverde' && !empty($parsed['id'])) {
    $qrId = (string)$parsed['id'];
    $puntos = (int)($parsed['pts'] ?? 0);
    $material = (string)($parsed['mat'] ?? 'generico');
} elseif (str_starts_with($raw, 'KV-') || str_starts_with($raw, 'ECO-')) {
    $qrId = $raw;
} else {
    $qrId = hash('sha256', $raw);
}

// 2. Comprobar en base de datos si existe en tabla qr_codes
$stmt = $pdo->prepare("SELECT * FROM qr_codes WHERE id = ? LIMIT 1");
$stmt->execute([$qrId]);
$qrRow = $stmt->fetch();

if ($qrRow) {
    if (!empty($qrRow['usado_por'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Este código QR ya fue utilizado anteriormente']);
        exit;
    }
    if (!empty($qrRow['vence']) && strtotime($qrRow['vence']) < time()) {
        http_response_code(400);
        echo json_encode(['error' => 'Este código QR está vencido']);
        exit;
    }
    $puntos = (int)$qrRow['puntos'];
    $material = $qrRow['material'];
} else {
    // Si no está registrado en la tabla pero viene firmado con puntos
    if ($puntos <= 0) {
        $puntos = 50; // default eco-puntos
    }
    // Registrar el QR en la tabla
    $stmt = $pdo->prepare("INSERT INTO qr_codes (id, material, puntos) VALUES (?, ?, ?)");
    $stmt->execute([$qrId, $material, $puntos]);
}

// 3. Marcar como usado y acreditar puntos
$pdo->beginTransaction();
$pdo->prepare("UPDATE qr_codes SET usado_por = ?, usado_en = NOW() WHERE id = ?")
    ->execute([$userId, $qrId]);

$pdo->prepare("UPDATE usuarios SET puntos = puntos + ? WHERE id = ?")
    ->execute([$puntos, $userId]);

$pdo->prepare("INSERT INTO scans (usuario_id, material, puntos, fecha) VALUES (?, ?, ?, NOW())")
    ->execute([$userId, $material, $puntos]);

$pdo->commit();

$user = usuarioPorId($pdo, (int)$userId);

echo json_encode([
    'ok' => true,
    'puntos' => $puntos,
    'material' => $material,
    'total' => (int)($user['puntos'] ?? 0),
]);
