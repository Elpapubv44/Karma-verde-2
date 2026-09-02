<?php
/**
 * Karmaverde — Gestión de Tareas de Logística (Rol Asociado)
 * GET, POST, DELETE
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/auth.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/contenido.php';
checkRateLimit('asociado/tareas');
requireRole(['asociado', 'superior']);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $list = listarTareas($pdo);
    $formatted = array_map(function($t) {
        return [
            'id' => (string)$t['id'],
            'titulo' => $t['titulo'],
            'escuela' => $t['escuela'],
            'material' => $t['material'],
            'meta' => (int)$t['meta'],
            'progreso' => (int)$t['progreso'],
            'estado' => $t['estado'],
            'responsable' => $t['responsable'] ?? '',
        ];
    }, $list);
    echo json_encode($formatted);
    exit;
}

if ($method === 'POST') {
    $data = requireJsonRequest();
    $id = isset($data['id']) && is_numeric($data['id']) ? (int)$data['id'] : null;

    if ($id) {
        actualizarTarea($pdo, $id, $data);
        echo json_encode(['id' => (string)$id, ...$data]);
    } else {
        $newId = crearTarea($pdo, $data);
        echo json_encode(['id' => (string)$newId, ...$data]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id > 0) {
        eliminarTarea($pdo, $id);
    }
    echo json_encode(['ok' => true]);
    exit;
}
