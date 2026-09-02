<?php
/**
 * Karmaverde — CRUD de Guías Educativas
 * GET, POST, DELETE
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/contenido.php';
checkRateLimit('creador/guias');
requireRole(['creador', 'superior']);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $list = listarGuias($pdo);
    $formatted = array_map(function($g) {
        return [
            'id' => (string)$g['id'],
            'titulo' => $g['titulo'],
            'categoria' => $g['categoria'] ?? '',
            'contenido' => $g['contenido'] ?? '',
            'icono' => $g['icono'] ?? '🌿',
        ];
    }, $list);
    echo json_encode($formatted);
    exit;
}

if ($method === 'POST') {
    $data = requireJsonRequest();
    $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

    if ($id) {
        actualizarGuia($pdo, $id, $data);
        echo json_encode(['id' => (string)$id, ...$data]);
    } else {
        $newId = crearGuia($pdo, $data);
        echo json_encode(['id' => (string)$newId, ...$data]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        eliminarGuia($pdo, $id);
    }
    echo json_encode(['ok' => true]);
    exit;
}
