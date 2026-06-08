<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$apiKey = api_secret('TOKKO_API_KEY', TOKKO_API_KEY);
if ($apiKey === '') {
    json_response(['error' => 'Falta la API KEY de Tokko.'], 401);
}

$data = cached_json('properties', 300, function () use ($apiKey) {
    $pageSize = 300;
    $maxPages = 200;
    $offset = 0;
    $objects = [];
    $lastMeta = [];

    for ($page = 0; $page < $maxPages; $page++) {
        $url = 'https://www.tokkobroker.com/api/v1/property/?key=' . rawurlencode($apiKey)
            . '&limit=' . $pageSize
            . '&offset=' . $offset
            . '&format=json&lang=es';

        $response = read_json_url($url, 15);

        if (!$response['ok']) {
            json_response([
                'error' => 'Tokko devolvio un error HTTP.',
                'status_code' => $response['status'],
                'tokko_details' => $response['data'],
            ], $response['status']);
        }

        $responseData = is_array($response['data']) ? $response['data'] : [];
        $currentObjects = isset($responseData['objects']) && is_array($responseData['objects']) ? $responseData['objects'] : [];
        $lastMeta = isset($responseData['meta']) && is_array($responseData['meta']) ? $responseData['meta'] : [];
        $objects = array_merge($objects, $currentObjects);

        $totalCount = isset($lastMeta['total_count']) ? (int) $lastMeta['total_count'] : null;
        $nextOffset = $offset + count($currentObjects);

        if (count($currentObjects) === 0) {
            break;
        }

        if ($totalCount !== null && $nextOffset >= $totalCount) {
            break;
        }

        if ($totalCount === null && empty($lastMeta['next'])) {
            break;
        }

        $offset += $pageSize;
    }

    return [
        'meta' => array_merge($lastMeta, [
            'limit' => count($objects),
            'offset' => 0,
            'total_count' => isset($lastMeta['total_count']) ? $lastMeta['total_count'] : count($objects),
            'next' => null,
            'previous' => null,
        ]),
        'objects' => $objects,
    ];
});

json_response($data);
