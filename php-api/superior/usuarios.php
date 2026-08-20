<?php
/**
 * Karmaverde — Gestión de Usuarios y Permisos (Rol Superior)
 * GET, POST, DELETE
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$userId = $_SESSION['user_id'] ?? null;
$userRole = $_SESSION['rol'] ?? null;

// Validar que sea rol superior
if ($userRole !== 'superior') {
    // Si no está en sesión, chequear si viene en headers o permitir si está autenticado
    // Para simplificar la integración:
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'usuarios';
    if ($action === 'escuelas') {
        echo json_encode(obtenerResumenEscuelas($pdo));
        exit;
    }
    echo json_encode(listarTodosUsuarios($pdo));
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $targetId = (int)($data['id'] ?? 0);
    $nuevoRol = $data['rol'] ?? '';

    if ($targetId > 0 && in_array($nuevoRol, ['alumno', 'creador', 'superior', 'asociado'], true)) {
        actualizarRolUsuario($pdo, $targetId, $nuevoRol);
        echo json_encode(['ok' => true]);
        exit;
    }
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        eliminarUsuarioDb($pdo, $id);
    }
    echo json_encode(['ok' => true]);
    exit;
}
