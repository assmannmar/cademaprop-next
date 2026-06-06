<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$apiKey = api_secret('TOKKO_API_KEY', TOKKO_API_KEY);
if ($apiKey === '') {
    json_response(['error' => 'Falta la API KEY de Tokko.'], 401);
}

$data = cached_json('developments', 300, function () use ($apiKey) {
    $url = 'https://api.tokkobroker.com/api/v1/development/?format=json&key=' . rawurlencode($apiKey) . '&limit=100&lang=es&order_by=id&order=desc';
    $response = read_json_url($url, 15);

    if (!$response['ok']) {
        json_response(['error' => 'Error en Tokko'], $response['status']);
    }

    $data = $response['data'];
    $objects = is_array($data['objects'] ?? null) ? $data['objects'] : [];

    $withPhotos = array_filter($objects, function ($dev) {
        return !empty($dev['photos']);
    });

    $data['objects'] = array_values(array_map(function (array $dev) {
        $tags = is_array($dev['custom_tags'] ?? null) ? $dev['custom_tags'] : [];
        $isIndustrial = false;
        $isResidential = false;

        foreach ($tags as $tag) {
            if (($tag['id'] ?? null) === 5050) {
                $isIndustrial = true;
            }
            if (($tag['id'] ?? null) === 5049) {
                $isResidential = true;
            }
        }

        $dev['is_industrial'] = $isIndustrial;
        $dev['is_residential'] = $isResidential;
        $dev['category'] = $isIndustrial ? 'industrial' : 'residential';

        return $dev;
    }, $withPhotos));

    return $data;
});

json_response($data);
