<?php
/** Authentication and authorization helpers used by protected endpoints. */

function jsonError(int $status, string $message): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

function requireRole(array $roles): void {
    $role = $_SESSION['rol'] ?? null;
    if (!$role || !in_array($role, $roles, true)) {
        jsonError(403, 'Acceso denegado');
    }
}

function requireJsonRequest(): array {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') !== 0) {
        jsonError(415, 'Content-Type debe ser application/json');
    }
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        jsonError(400, 'JSON inválido');
    }
    return $data;
}
