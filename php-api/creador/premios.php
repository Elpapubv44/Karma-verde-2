<?php
/**
 * Karmaverde — CRUD de Premios
 * GET (listar), POST (crear/actualizar), DELETE (eliminar)
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/premios.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $list = listarPremios($pdo);
    $formatted = array_map(function($p) {
        return [
            'id' => (string)$p['id'],
            'nombre' => $p['nombre'],
            'descripcion' => $p['descripcion'] ?? '',
            'puntos' => (int)$p['puntos'],
            'stock' => (int)$p['stock'],
            'imagen' => $p['imagen'] ?? '🎁',
        ];
    }, $list);
    echo json_encode($formatted);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

    if ($id) {
        actualizarPremio($pdo, $id, $data);
        echo json_encode(['id' => (string)$id, ...$data]);
    } else {
        $newId = crearPremio($pdo, $data);
        echo json_encode(['id' => (string)$newId, ...$data]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        eliminarPremio($pdo, $id);
    }
    echo json_encode(['ok' => true]);
    exit;
}
