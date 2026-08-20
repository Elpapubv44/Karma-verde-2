<?php
/**
 * Karmaverde — Gestión de Tareas de Logística (Rol Asociado)
 * GET, POST, DELETE
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/contenido.php';

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
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
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
