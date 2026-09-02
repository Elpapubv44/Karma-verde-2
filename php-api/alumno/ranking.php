<?php
/**
 * Karmaverde — Ranking de alumnos
 * GET
 */
require __DIR__ . '/../config/cors.php';
require __DIR__ . '/../config/session.php';
require __DIR__ . '/../config/rate-limit.php';
header('Content-Type: application/json');
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../queries/usuarios.php';
checkRateLimit('alumno/ranking');

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
