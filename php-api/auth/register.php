<?php
/**
 * Karmaverde — REGISTRO de usuarios (todos los roles).
 * POST { nombre, email, password, rol, escuela, codigo? }
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';
checkRateLimit('auth/register', 5, 900);

$data = requireJsonRequest();

$nombre   = trim($data['nombre']   ?? '');
$email    = trim($data['email']    ?? '');
$password = (string)($data['password'] ?? '');
$rol      = $data['rol']     ?? 'alumno';
$escuela  = trim($data['escuela']  ?? '');
$codigo   = trim($data['codigo']   ?? '');

if ($nombre === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 10 || $escuela === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$validRoles = ['alumno', 'creador', 'superior', 'asociado'];
if (!in_array($rol, $validRoles, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Rol inválido']);
    exit;
}

// 🔒 Validación de códigos de acceso según rol
if ($rol !== 'alumno') {
    $envNames = [
        'creador' => 'KARMAVERDE_CREATOR_CODE',
        'superior' => 'KARMAVERDE_SUPERIOR_CODE',
        'asociado' => 'KARMAVERDE_ASOCIADO_CODE',
    ];
    $expected = getenv($envNames[$rol]) ?: '';
    if ($expected === '' || !hash_equals($expected, $codigo)) {
        jsonError(403, 'Código de acceso incorrecto');
    }
}

if (usuarioPorEmail($pdo, $email)) {
    http_response_code(409);
    echo json_encode(['error' => 'Ya existe una cuenta con ese email']);
    exit;
}

$id = crearUsuario($pdo, compact('nombre', 'email', 'password', 'rol', 'escuela'));
session_regenerate_id(true);
$_SESSION['user_id'] = $id;
$_SESSION['rol']     = $rol;
$_SESSION['login_time'] = time();
$_SESSION['last_activity'] = time();
$_SESSION['rotated_at'] = time();

echo json_encode([
    'user' => [
        'id'      => (string)$id,
        'nombre'  => $nombre,
        'email'   => strtolower($email),
        'rol'     => $rol,
        'escuela' => $escuela,
        'puntos'  => 0,
        'canjes'  => 0,
        'avatar'  => null,
    ],
]);
