<?php
/**
 * Karmaverde — LOGIN de usuarios.
 * POST { email, password }
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = trim($data['email']    ?? '');
$password = (string)($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Email y contraseña requeridos']);
    exit;
}

$user = usuarioPorEmail($pdo, $email);
if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Email o contraseña incorrectos']);
    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['rol']     = $user['rol'];

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
