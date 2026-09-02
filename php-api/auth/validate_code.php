<?php
/** Validate privileged registration codes without exposing their values to the client. */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
checkRateLimit('auth/validate_code', 10, 900);

$data = requireJsonRequest();
$role = $data['rol'] ?? '';
$code = trim((string) ($data['code'] ?? ''));
$envNames = [
    'creador' => 'KARMAVERDE_CREATOR_CODE',
    'superior' => 'KARMAVERDE_SUPERIOR_CODE',
    'asociado' => 'KARMAVERDE_ASOCIADO_CODE',
];
if (!isset($envNames[$role])) {
    jsonError(400, 'Este rol no requiere código de acceso.');
}
$expected = getenv($envNames[$role]) ?: '';
echo json_encode(['valid' => $expected !== '' && hash_equals($expected, $code)]);
