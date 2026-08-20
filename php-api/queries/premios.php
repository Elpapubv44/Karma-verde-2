<?php
/**
 * Karmaverde — Consultas SQL de PREMIOS (creadores gestionan, alumnos canjean).
 */

function listarPremios(PDO $pdo): array {
    return $pdo->query("SELECT * FROM premios ORDER BY puntos ASC")->fetchAll();
}

function crearPremio(PDO $pdo, array $p): int {
    $sql = "INSERT INTO premios (nombre, descripcion, puntos, stock, imagen)
            VALUES (:nombre, :descripcion, :puntos, :stock, :imagen)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre'      => $p['nombre'],
        ':descripcion' => $p['descripcion'],
        ':puntos'      => (int)$p['puntos'],
        ':stock'       => (int)$p['stock'],
        ':imagen'      => $p['imagen'] ?? null,
    ]);
    return (int)$pdo->lastInsertId();
}

function actualizarPremio(PDO $pdo, int $id, array $p): void {
    $sql = "UPDATE premios
            SET nombre = :nombre, descripcion = :descripcion,
                puntos = :puntos, stock = :stock, imagen = :imagen
            WHERE id = :id";
    $pdo->prepare($sql)->execute([
        ':id'          => $id,
        ':nombre'      => $p['nombre'],
        ':descripcion' => $p['descripcion'],
        ':puntos'      => (int)$p['puntos'],
        ':stock'       => (int)$p['stock'],
        ':imagen'      => $p['imagen'] ?? null,
    ]);
}

function eliminarPremio(PDO $pdo, int $id): void {
    $pdo->prepare("DELETE FROM premios WHERE id = ?")->execute([$id]);
}

/** Canje de premio por parte de un alumno. Devuelve true si fue exitoso. */
function canjearPremio(PDO $pdo, int $userId, int $premioId): bool {
    $pdo->beginTransaction();
    try {
        $premio = $pdo->prepare("SELECT * FROM premios WHERE id = ? FOR UPDATE");
        $premio->execute([$premioId]);
        $p = $premio->fetch();
        if (!$p || $p['stock'] <= 0) { $pdo->rollBack(); return false; }

        $user = $pdo->prepare("SELECT puntos FROM usuarios WHERE id = ? FOR UPDATE");
        $user->execute([$userId]);
        $u = $user->fetch();
        if (!$u || $u['puntos'] < $p['puntos']) { $pdo->rollBack(); return false; }

        $pdo->prepare("UPDATE usuarios SET puntos = puntos - ?, canjes = canjes + 1 WHERE id = ?")
            ->execute([$p['puntos'], $userId]);
        $pdo->prepare("UPDATE premios SET stock = stock - 1 WHERE id = ?")
            ->execute([$premioId]);
        $pdo->prepare("INSERT INTO canjes (usuario_id, premio_id) VALUES (?, ?)")
            ->execute([$userId, $premioId]);
        $pdo->commit();
        return true;
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}
