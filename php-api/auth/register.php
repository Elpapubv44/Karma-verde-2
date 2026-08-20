<?php
/**
 * Karmaverde — REGISTRO de usuarios (todos los roles).
 * POST { nombre, email, password, rol, escuela, codigo? }
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$data = json_decode(file_get_contents('php://input'), true) ?? [];

$nombre   = trim($data['nombre']   ?? '');
$email    = trim($data['email']    ?? '');
$password = (string)($data['password'] ?? '');
$rol      = $data['rol']     ?? 'alumno';
$escuela  = trim($data['escuela']  ?? '');
$codigo   = trim($data['codigo']   ?? '');

if ($nombre === '' || $email === '' || strlen($password) < 4 || $escuela === '') {
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
if ($rol === 'creador' && $codigo !== KARMAVERDE_CREATOR_CODE) {
    http_response_code(403);
    echo json_encode(['error' => 'Código de organizador incorrecto']);
    exit;
}
if ($rol === 'superior' && $codigo !== KARMAVERDE_SUPERIOR_CODE) {
    http_response_code(403);
    echo json_encode(['error' => 'Código de acceso superior incorrecto']);
    exit;
}
if ($rol === 'asociado' && $codigo !== KARMAVERDE_ASOCIADO_CODE) {
    http_response_code(403);
    echo json_encode(['error' => 'Código de acceso asociado incorrecto']);
    exit;
}

if (usuarioPorEmail($pdo, $email)) {
    http_response_code(409);
    echo json_encode(['error' => 'Ya existe una cuenta con ese email']);
    exit;
}

$id = crearUsuario($pdo, compact('nombre', 'email', 'password', 'rol', 'escuela'));
$_SESSION['user_id'] = $id;
$_SESSION['rol']     = $rol;

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
