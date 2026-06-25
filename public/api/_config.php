<?php
declare(strict_types=1);

const TOKKO_API_KEY = '';
const GOOGLE_SHEETS_API_KEY = '';
const INSTAGRAM_ACCESS_TOKEN = '';
const INSTAGRAM_INDUSTRIAS_ACCESS_TOKEN = '';

const REVIEWS_SPREADSHEET_ID = '1nWEyaRGyfd4fxxu_-Is7pAVIrwmflSJj-AnZ74LlIwA';
const REVIEWS_RANGE = 'Reviews!A2:C10';

function api_secret(string $name, string $fallback = ''): string
{
    $value = getenv($name);
    if ($value !== false && $value !== '') {
        return $value;
    }

    return $fallback;
}

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_url(string $url, int $timeout = 10): array
{
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => $timeout,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\nUser-Agent: CademaStaticApi/1.0\r\n",
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $match)) {
        $status = (int) $match[1];
    }

    if ($body === false) {
        return ['ok' => false, 'status' => 500, 'data' => ['error' => 'No se pudo conectar con el servicio externo.']];
    }

    $data = json_decode($body, true);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        return ['ok' => false, 'status' => 500, 'data' => ['error' => 'Respuesta externa inválida.']];
    }

    return [
        'ok' => $status >= 200 && $status < 300,
        'status' => $status ?: 200,
        'data' => $data,
    ];
}

function cached_json(string $key, int $ttl, callable $loader)
{
    $cacheDir = __DIR__ . '/cache';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0755, true);
    }

    $file = $cacheDir . '/' . preg_replace('/[^a-z0-9_-]/i', '_', $key) . '.json';

    if (is_file($file) && (time() - filemtime($file)) < $ttl) {
        $cached = json_decode((string) file_get_contents($file), true);
        if ($cached !== null || json_last_error() === JSON_ERROR_NONE) {
            return $cached;
        }
    }

    $fresh = $loader();
    @file_put_contents($file, json_encode($fresh, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

    return $fresh;
}
