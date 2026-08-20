<?php
/**
 * Karmaverde — CRUD de Guías Educativas
 * GET, POST, DELETE
 */
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/contenido.php';

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
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
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
