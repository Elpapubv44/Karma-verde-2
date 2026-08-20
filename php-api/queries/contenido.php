<?php
/**
 * Karmaverde — Consultas SQL para Guías y Circuito.
 */

// --------- GUÍAS ---------
function listarGuias(PDO $pdo): array {
    return $pdo->query("SELECT * FROM guias ORDER BY id ASC")->fetchAll();
}

function crearGuia(PDO $pdo, array $g): int {
    $stmt = $pdo->prepare("INSERT INTO guias (titulo, categoria, contenido, icono) VALUES (:titulo, :categoria, :contenido, :icono)");
    $stmt->execute([
        ':titulo'    => $g['titulo'],
        ':categoria' => $g['categoria'] ?? '',
        ':contenido' => $g['contenido'] ?? '',
        ':icono'     => $g['icono'] ?? '🌿',
    ]);
    return (int)$pdo->lastInsertId();
}

function actualizarGuia(PDO $pdo, int $id, array $g): void {
    $stmt = $pdo->prepare("UPDATE guias SET titulo = :titulo, categoria = :categoria, contenido = :contenido, icono = :icono WHERE id = :id");
    $stmt->execute([
        ':id'        => $id,
        ':titulo'    => $g['titulo'],
        ':categoria' => $g['categoria'] ?? '',
        ':contenido' => $g['contenido'] ?? '',
        ':icono'     => $g['icono'] ?? '🌿',
    ]);
}

function eliminarGuia(PDO $pdo, int $id): void {
    $pdo->prepare("DELETE FROM guias WHERE id = ?")->execute([$id]);
}

// --------- CIRCUITO ---------
function listarCircuito(PDO $pdo): array {
    return $pdo->query("SELECT * FROM circuito ORDER BY orden ASC, id ASC")->fetchAll();
}

function crearEtapaCircuito(PDO $pdo, array $c): int {
    $stmt = $pdo->prepare("INSERT INTO circuito (orden, titulo, descripcion, estado, imagen, video) VALUES (:orden, :titulo, :descripcion, :estado, :imagen, :video)");
    $stmt->execute([
        ':orden'       => (int)($c['orden'] ?? 0),
        ':titulo'      => $c['titulo'],
        ':descripcion' => $c['descripcion'] ?? '',
        ':estado'      => $c['estado'] ?? 'pendiente',
        ':imagen'      => $c['imagen'] ?? null,
        ':video'       => $c['video'] ?? null,
    ]);
    return (int)$pdo->lastInsertId();
}

function actualizarEtapaCircuito(PDO $pdo, int $id, array $c): void {
    $stmt = $pdo->prepare("UPDATE circuito SET orden = :orden, titulo = :titulo, descripcion = :descripcion, estado = :estado, imagen = :imagen, video = :video WHERE id = :id");
    $stmt->execute([
        ':id'          => $id,
        ':orden'       => (int)($c['orden'] ?? 0),
        ':titulo'      => $c['titulo'],
        ':descripcion' => $c['descripcion'] ?? '',
        ':estado'      => $c['estado'] ?? 'pendiente',
        ':imagen'      => $c['imagen'] ?? null,
        ':video'       => $c['video'] ?? null,
    ]);
}

function eliminarEtapaCircuito(PDO $pdo, int $id): void {
    $pdo->prepare("DELETE FROM circuito WHERE id = ?")->execute([$id]);
}

// --------- TAREAS (Asociado) ---------
function listarTareas(PDO $pdo): array {
    return $pdo->query("SELECT * FROM tareas ORDER BY id DESC")->fetchAll();
}

function crearTarea(PDO $pdo, array $t): int {
    $stmt = $pdo->prepare("INSERT INTO tareas (titulo, escuela, material, meta, progreso, estado, responsable) VALUES (:titulo, :escuela, :material, :meta, :progreso, :estado, :responsable)");
    $stmt->execute([
        ':titulo'      => $t['titulo'],
        ':escuela'     => $t['escuela'] ?? '',
        ':material'    => $t['material'] ?? '',
        ':meta'        => (int)($t['meta'] ?? 0),
        ':progreso'    => (int)($t['progreso'] ?? 0),
        ':estado'      => $t['estado'] ?? 'pendiente',
        ':responsable' => $t['responsable'] ?? null,
    ]);
    return (int)$pdo->lastInsertId();
}

function actualizarTarea(PDO $pdo, int $id, array $t): void {
    $stmt = $pdo->prepare("UPDATE tareas SET titulo = :titulo, escuela = :escuela, material = :material, meta = :meta, progreso = :progreso, estado = :estado, responsable = :responsable WHERE id = :id");
    $stmt->execute([
        ':id'          => $id,
        ':titulo'      => $t['titulo'],
        ':escuela'     => $t['escuela'] ?? '',
        ':material'    => $t['material'] ?? '',
        ':meta'        => (int)($t['meta'] ?? 0),
        ':progreso'    => (int)($t['progreso'] ?? 0),
        ':estado'      => $t['estado'] ?? 'pendiente',
        ':responsable' => $t['responsable'] ?? null,
    ]);
}

function eliminarTarea(PDO $pdo, int $id): void {
    $pdo->prepare("DELETE FROM tareas WHERE id = ?")->execute([$id]);
}
