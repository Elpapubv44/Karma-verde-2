<?php
/**
 * Karmaverde — CRUD de Circuito (Etapas del viaje)
 * GET, POST, DELETE
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/contenido.php';

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
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
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
