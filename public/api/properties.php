<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$apiKey = api_secret('TOKKO_API_KEY', TOKKO_API_KEY);
if ($apiKey === '') {
    json_response(['error' => 'Falta la API KEY de Tokko.'], 401);
}

$data = cached_json('properties', 300, function () use ($apiKey) {
    $url = 'https://www.tokkobroker.com/api/v1/property/?key=' . rawurlencode($apiKey) . '&limit=300&format=json&lang=es';
    $response = read_json_url($url, 15);

    if (!$response['ok']) {
        json_response([
            'error' => 'Tokko devolvió un error HTTP.',
            'status_code' => $response['status'],
            'tokko_details' => $response['data'],
        ], $response['status']);
    }

    return $response['data'];
});

json_response($data);
