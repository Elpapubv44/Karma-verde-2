<?php
/**
 * Karmaverde — CRUD de Premios
 * GET (listar), POST (crear/actualizar), DELETE (eliminar)
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/premios.php';
checkRateLimit('creador/premios');
requireRole(['creador', 'superior']);

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
    $data = requireJsonRequest();
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
