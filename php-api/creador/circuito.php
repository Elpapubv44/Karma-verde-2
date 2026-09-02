<?php
/**
 * Karmaverde — CRUD de Circuito (Etapas del viaje)
 * GET, POST, DELETE
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/contenido.php';
checkRateLimit('creador/circuito');
requireRole(['creador', 'superior']);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $list = listarCircuito($pdo);
    $formatted = array_map(function($c) {
        return [
            'id' => (string)$c['id'],
            'orden' => (int)$c['orden'],
            'titulo' => $c['titulo'],
            'descripcion' => $c['descripcion'] ?? '',
            'estado' => $c['estado'] ?? 'pendiente',
            'imagen' => $c['imagen'] ?? null,
            'video' => $c['video'] ?? null,
        ];
    }, $list);
    echo json_encode($formatted);
    exit;
}

if ($method === 'POST') {
    $data = requireJsonRequest();
    $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

    if ($id) {
        actualizarEtapaCircuito($pdo, $id, $data);
        echo json_encode(['id' => (string)$id, ...$data]);
    } else {
        $newId = crearEtapaCircuito($pdo, $data);
        echo json_encode(['id' => (string)$newId, ...$data]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        eliminarEtapaCircuito($pdo, $id);
    }
    echo json_encode(['ok' => true]);
    exit;
}
