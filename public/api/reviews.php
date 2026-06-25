<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$apiKey = api_secret('GOOGLE_SHEETS_API_KEY', GOOGLE_SHEETS_API_KEY);
if ($apiKey === '') {
    json_response(['error' => 'API Key no configurada'], 500);
}

$reviews = cached_json('reviews', 300, function () use ($apiKey) {
    $url = 'https://sheets.googleapis.com/v4/spreadsheets/' . rawurlencode(REVIEWS_SPREADSHEET_ID) . '/values/' . rawurlencode(REVIEWS_RANGE) . '?key=' . rawurlencode($apiKey);
    $response = read_json_url($url, 10);

    if (!$response['ok'] || isset($response['data']['error'])) {
        json_response(['error' => $response['data']['error']['message'] ?? 'Error al obtener reseñas'], $response['status']);
    }

    $values = $response['data']['values'] ?? [];
    if (!is_array($values) || count($values) === 0) {
        return [];
    }

    return array_map(function ($row) {
        return [
            'author_name' => $row[0] ?? 'Cliente',
            'rating' => (int) ($row[1] ?? 5),
            'text' => $row[2] ?? '',
        ];
    }, $values);
});

json_response($reviews);
