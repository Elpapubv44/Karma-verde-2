<?php
/** Centralized session hardening and expiry checks. */

ini_set('session.gc_maxlifetime', '3600');
ini_set('session.cookie_lifetime', '0');
ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (isset($_SESSION['last_activity']) && time() - (int) $_SESSION['last_activity'] > 3600) {
    $_SESSION = [];
    session_destroy();
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'La sesión expiró. Iniciá sesión nuevamente.']);
    exit;
}

if (isset($_SESSION['user_id'])) {
    $_SESSION['last_activity'] = time();
    if (time() - (int) ($_SESSION['rotated_at'] ?? 0) > 900) {
        session_regenerate_id(true);
        $_SESSION['rotated_at'] = time();
    }
}
