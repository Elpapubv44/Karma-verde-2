<?php
/**
 * Karmaverde — Ranking de alumnos
 * GET
 */
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';

$ranking = obtenerRanking($pdo);

// Mapear campos para asegurar tipos correctos
$res = array_map(function($r) {
    return [
        'id' => (string)$r['id'],
        'nombre' => $r['nombre'],
        'escuela' => $r['escuela'],
        'puntos' => (int)$r['puntos'],
        'canjes' => (int)$r['canjes'],
    ];
}, $ranking);

echo json_encode($res);
