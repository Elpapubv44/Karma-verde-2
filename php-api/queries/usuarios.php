<?php
/**
 * Karmaverde — Funciones SQL completas para usuarios y permisos.
 */

function crearUsuario(PDO $pdo, array $u): int {
    $sql = "INSERT INTO usuarios (nombre, email, password_hash, rol, escuela, puntos, canjes)
            VALUES (:nombre, :email, :hash, :rol, :escuela, 0, 0)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre'  => $u['nombre'],
        ':email'   => strtolower(trim($u['email'])),
        ':hash'    => password_hash($u['password'], PASSWORD_BCRYPT),
        ':rol'     => $u['rol'],
        ':escuela' => $u['escuela'],
    ]);
    return (int)$pdo->lastInsertId();
}

function usuarioPorEmail(PDO $pdo, string $email): ?array {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->execute([strtolower(trim($email))]);
    $u = $stmt->fetch();
    return $u ?: null;
}

function usuarioPorId(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("SELECT id, nombre, email, rol, escuela, puntos, canjes, avatar, creado_en FROM usuarios WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $u = $stmt->fetch();
    return $u ?: null;
}

function sumarPuntos(PDO $pdo, int $userId, int $cantidad, string $material): void {
    $pdo->beginTransaction();
    $pdo->prepare("UPDATE usuarios SET puntos = puntos + ? WHERE id = ?")
        ->execute([$cantidad, $userId]);
    $pdo->prepare("INSERT INTO scans (usuario_id, material, puntos, fecha)
                   VALUES (?, ?, ?, NOW())")
        ->execute([$userId, $material, $cantidad]);
    $pdo->commit();
}

function obtenerRanking(PDO $pdo): array {
    $stmt = $pdo->query(
        "SELECT id, nombre, escuela, puntos, canjes
         FROM usuarios
         WHERE rol = 'alumno'
         ORDER BY puntos DESC, canjes DESC"
    );
    return $stmt->fetchAll();
}

function listarTodosUsuarios(PDO $pdo): array {
    $stmt = $pdo->query(
        "SELECT id, nombre, email, rol, escuela, puntos, canjes, avatar, creado_en
         FROM usuarios
         ORDER BY id DESC"
    );
    return $stmt->fetchAll();
}

function actualizarRolUsuario(PDO $pdo, int $id, string $nuevoRol): void {
    $stmt = $pdo->prepare("UPDATE usuarios SET rol = ? WHERE id = ?");
    $stmt->execute([$nuevoRol, $id]);
}

function eliminarUsuarioDb(PDO $pdo, int $id): void {
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->execute([$id]);
}

function obtenerResumenEscuelas(PDO $pdo): array {
    $stmt = $pdo->query(
        "SELECT escuela, COUNT(*) as alumnos, SUM(puntos) as puntos, SUM(canjes) as canjes
         FROM usuarios
         WHERE rol = 'alumno' AND escuela != ''
         GROUP BY escuela
         ORDER BY puntos DESC"
    );
    return $stmt->fetchAll();
}
