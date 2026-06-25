<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$accessToken = api_secret('INSTAGRAM_ACCESS_TOKEN', INSTAGRAM_ACCESS_TOKEN);
if ($accessToken === '') {
    json_response(['posts' => []]);
}

$posts = cached_json('instagram', 3600, function () use ($accessToken) {
    $fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    $url = 'https://graph.instagram.com/me/media?fields=' . rawurlencode($fields) . '&limit=6&access_token=' . rawurlencode($accessToken);
    $response = read_json_url($url, 10);

    if (!$response['ok'] || !is_array($response['data']['data'] ?? null)) {
        return [];
    }

    return $response['data']['data'];
});

json_response(['posts' => $posts]);
