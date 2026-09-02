<?php
/**
 * Karmaverde — LOGIN de usuarios.
 * POST { email, password }
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';
checkRateLimit('auth/login', 5, 900);

$data = requireJsonRequest();
$email    = trim($data['email']    ?? '');
$password = (string)($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Email y contraseña requeridos']);
    exit;
}

$user = usuarioPorEmail($pdo, $email);
$pepper = getenv('PASSWORD_PEPPER') ?: '';
if (!$user || !$pepper || !password_verify(hash_hmac('sha256', $password, $pepper), $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Email o contraseña incorrectos']);
    exit;
}

session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['rol']     = $user['rol'];
$_SESSION['login_time'] = time();
$_SESSION['last_activity'] = time();
$_SESSION['rotated_at'] = time();

echo json_encode([
    'user' => [
        'id'      => (string)$user['id'],
        'nombre'  => $user['nombre'],
        'email'   => $user['email'],
        'rol'     => $user['rol'],
        'escuela' => $user['escuela'],
        'puntos'  => (int)$user['puntos'],
        'canjes'  => (int)$user['canjes'],
        'avatar'  => $user['avatar'] ?? null,
    ],
]);
