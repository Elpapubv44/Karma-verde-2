<?php
/**
 * Karmaverde — ME (usuario actual de sesión).
 * GET
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['user' => null]);
    exit;
}

$user = usuarioPorId($pdo, (int)$userId);

if (!$user) {
    echo json_encode(['user' => null]);
    exit;
}

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
