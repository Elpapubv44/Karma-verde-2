<?php
/** Lightweight file-backed limiter. Replace with Redis/database storage when scaling horizontally. */

function checkRateLimit(string $endpoint, int $maxAttempts = 60, int $windowSeconds = 60): void {
    $directory = sys_get_temp_dir() . '/karmaverde-rate-limits';
    if (!is_dir($directory)) {
        mkdir($directory, 0700, true);
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = $directory . '/' . hash('sha256', "$endpoint|$ip") . '.json';
    $now = time();
    $entry = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
    if (!is_array($entry) || $now - (int) ($entry['window_start'] ?? 0) >= $windowSeconds) {
        $entry = ['window_start' => $now, 'attempts' => 0];
    }
    $entry['attempts']++;
    file_put_contents($file, json_encode($entry), LOCK_EX);
    if ($entry['attempts'] > $maxAttempts) {
        $retryAfter = $windowSeconds - ($now - (int) $entry['window_start']);
        header('Retry-After: ' . max(1, $retryAfter));
        jsonError(429, 'Demasiadas solicitudes. Intentá nuevamente más tarde.');
    }
}
