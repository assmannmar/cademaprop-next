<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$apiKey = api_secret('TOKKO_API_KEY', TOKKO_API_KEY);
if ($apiKey === '') {
    json_response(['error' => 'Falta la API KEY de Tokko.'], 401);
}

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 50;
const TOKKO_PAGE_SIZE = 50;
const MAX_TOKKO_PAGES = 200;

function clamp_number($value, int $fallback, int $min, int $max): int
{
    if ($value === null || $value === '' || !is_numeric($value)) {
        return $fallback;
    }

    return min(max((int) $value, $min), $max);
}

function normalize_text(string $value): string
{
    $normalized = strtolower(trim($value));
    $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $normalized);
    return $converted !== false ? $converted : $normalized;
}

function query_value(array $source, string $primary, string $fallback = ''): string
{
    if (isset($source[$primary]) && $source[$primary] !== '') {
        return (string) $source[$primary];
    }

    if ($fallback !== '' && isset($source[$fallback]) && $source[$fallback] !== '') {
        return (string) $source[$fallback];
    }

    return '';
}

function sort_config(array $query): array
{
    $sort = query_value($query, 'sort', 'orden');
    $sortMap = [
        'recent_desc' => ['order_by' => 'id', 'order' => 'desc'],
        'recent_asc' => ['order_by' => 'id', 'order' => 'asc'],
        'price_desc' => ['order_by' => 'price', 'order' => 'desc'],
        'price_asc' => ['order_by' => 'price', 'order' => 'asc'],
        'surface_desc' => ['order_by' => 'surface', 'order' => 'desc'],
        'surface_asc' => ['order_by' => 'surface', 'order' => 'asc'],
        'roofed_desc' => ['order_by' => 'roofed_surface', 'order' => 'desc'],
        'roofed_asc' => ['order_by' => 'roofed_surface', 'order' => 'asc'],
    ];

    return $sortMap[$sort] ?? $sortMap['recent_desc'];
}

function sort_option(array $query): string
{
    $sort = query_value($query, 'sort', 'orden');
    $validSorts = [
        'recent_desc',
        'recent_asc',
        'price_desc',
        'price_asc',
        'surface_desc',
        'surface_asc',
        'roofed_desc',
        'roofed_asc',
    ];

    return in_array($sort, $validSorts, true) ? $sort : 'recent_desc';
}

function get_property_id(): string
{
    if (isset($_GET['id']) && preg_match('/^\d+$/', (string) $_GET['id'])) {
        return (string) $_GET['id'];
    }

    $pathInfo = isset($_SERVER['PATH_INFO']) ? trim((string) $_SERVER['PATH_INFO'], '/') : '';
    if ($pathInfo !== '' && preg_match('/^\d+$/', $pathInfo)) {
        return $pathInfo;
    }

    $requestUri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
    if (preg_match('#/properties\.php/(\d+)#', $requestUri, $match)) {
        return $match[1];
    }

    return '';
}

function read_tokko_property(string $apiKey, string $id): array
{
    $url = 'https://www.tokkobroker.com/api/v1/property/' . rawurlencode($id) . '/?'
        . http_build_query([
            'key' => $apiKey,
            'format' => 'json',
            'lang' => 'es',
        ]);

    $response = read_json_url($url, 15);

    if (!$response['ok']) {
        json_response([
            'error' => 'Tokko devolvio un error HTTP.',
            'status_code' => $response['status'],
            'tokko_details' => $response['data'],
        ], $response['status']);
    }

    return is_array($response['data']) ? $response['data'] : [];
}

function resolve_property_types(string $propertyType, string $division): array
{
    $industrialPropertyTypes = [14, 12, 27];
    $allPropertyTypes = range(1, 27);
    $cityPropertyTypes = array_values(array_filter(
        $allPropertyTypes,
        fn ($id) => !in_array($id, $industrialPropertyTypes, true)
    ));

    $propertyTypeMap = [
        'land' => [1],
        'terreno' => [1],
        'apartment' => [2],
        'appartment' => [2],
        'departamento' => [2],
        'house' => [3],
        'casa' => [3],
        'weekend house' => [4],
        'office' => [5],
        'oficina' => [5],
        'mooring' => [6],
        'commercial' => [7, 8],
        'comercial' => [7, 8],
        'countryside' => [9],
        'campo' => [9],
        'deposit' => [14],
        'deposito' => [14],
        'industrial ship' => [12],
        'nave industrial' => [12],
        'deposito/nave industrial' => [14, 12],
        'terreno industrial' => [27],
    ];

    $divisionTypes = match (normalize_text($division)) {
        'industria' => $industrialPropertyTypes,
        'ciudad' => $cityPropertyTypes,
        default => $allPropertyTypes,
    };

    if (!isset($propertyTypeMap[$propertyType])) {
        return $divisionTypes;
    }

    if ($division === '') {
        return $propertyTypeMap[$propertyType];
    }

    $intersection = array_values(array_intersect($propertyTypeMap[$propertyType], $divisionTypes));
    return count($intersection) > 0 ? $intersection : [0];
}

function build_search_data(array $query): array
{
    $operationTypeMap = [
        'sale' => 1,
        'rent' => 2,
        'rental' => 2,
        'temporary rent' => 3,
        'temporary rental' => 3,
    ];

    $allOperationTypes = [1, 2, 3];
    $operationType = normalize_text(query_value($query, 'operation_type', 'operacion'));
    $propertyType = normalize_text(query_value($query, 'property_type', 'tipo'));
    $bedrooms = query_value($query, 'bedrooms', 'dormitorios');
    $parking = query_value($query, 'has_parking', 'cochera');
    $pool = query_value($query, 'has_pool', 'pileta');
    $division = query_value($query, 'division');
    $maxPrice = query_value($query, 'max_price', 'precio-max');
    $credit = query_value($query, 'credit_eligible', 'credito');
    $featured = isset($query['featured']) && $query['featured'] === 'true';
    $filters = [];
    $withTags = [];
    $withoutTags = [];

    if ($bedrooms === 'studio') {
        $filters[] = ['room_amount', '=', 1];
    } elseif ($bedrooms !== '' && is_numeric($bedrooms)) {
        $filters[] = ['suite_amount', '=', (int) $bedrooms];
    }

    if ($parking === 'yes') {
        $filters[] = ['parking_lot_amount', '>', 0];
    }

    if ($parking === 'no') {
        $filters[] = ['parking_lot_amount', '=', 0];
    }

    if ($pool === 'yes') {
        $withTags[] = 51;
    }

    if ($pool === 'no') {
        $withoutTags[] = 51;
    }

    if ($credit === 'Eligible') {
        $filters[] = ['credit_eligible', 'op', '1'];
    }

    if ($credit === 'Not eligible') {
        $filters[] = ['credit_eligible', '!=', '1'];
    }

    if ($featured) {
        $filters[] = ['is_starred_on_web', 'op', 'Yes'];
    }

    return [
        'current_localization_id' => 0,
        'current_localization_type' => 'country',
        'division_filters' => [],
        'price_from' => 0,
        'price_to' => $maxPrice !== '' && is_numeric($maxPrice) ? (int) $maxPrice : 999999999,
        'operation_types' => isset($operationTypeMap[$operationType]) ? [$operationTypeMap[$operationType]] : $allOperationTypes,
        'property_types' => resolve_property_types($propertyType, $division),
        'currency' => 'ANY',
        'filters' => $filters,
        'with_tags' => $withTags,
        'without_tags' => $withoutTags,
        'only_available' => 'checked',
    ];
}

function read_tokko_search(string $apiKey, int $limit, int $offset, array $searchData, array $sortConfig): array
{
    $url = 'https://www.tokkobroker.com/api/v1/property/search/?'
        . http_build_query([
            'key' => $apiKey,
            'limit' => $limit,
            'offset' => $offset,
            'format' => 'json',
            'lang' => 'es',
            'order_by' => $sortConfig['order_by'],
            'order' => $sortConfig['order'],
            'data' => json_encode($searchData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

    $response = read_json_url($url, 15);

    if (!$response['ok']) {
        json_response([
            'error' => 'Tokko devolvio un error HTTP.',
            'status_code' => $response['status'],
            'tokko_details' => $response['data'],
        ], $response['status']);
    }

    return is_array($response['data']) ? $response['data'] : [];
}

function property_price(array $property): float
{
    $prices = $property['operations'][0]['prices'] ?? [];
    if (!is_array($prices) || count($prices) === 0) {
        return 0;
    }

    foreach ($prices as $price) {
        if (is_array($price) && !empty($price['web_price'])) {
            return isset($price['price']) ? (float) $price['price'] : 0;
        }
    }

    return isset($prices[0]['price']) ? (float) $prices[0]['price'] : 0;
}

function sort_properties(array $properties, string $sort): array
{
    usort($properties, function ($a, $b) use ($sort) {
        $left = is_array($a) ? $a : [];
        $right = is_array($b) ? $b : [];
        $direction = str_ends_with($sort, '_desc') ? -1 : 1;

        if (str_starts_with($sort, 'recent')) {
            $leftValue = isset($left['created_at']) ? strtotime((string) $left['created_at']) : (int) ($left['id'] ?? 0);
            $rightValue = isset($right['created_at']) ? strtotime((string) $right['created_at']) : (int) ($right['id'] ?? 0);
            return ($leftValue <=> $rightValue) * $direction;
        }

        if (str_starts_with($sort, 'price')) {
            return (property_price($left) <=> property_price($right)) * $direction;
        }

        if (str_starts_with($sort, 'surface')) {
            return ((float) ($left['surface'] ?? 0) <=> (float) ($right['surface'] ?? 0)) * $direction;
        }

        if (str_starts_with($sort, 'roofed')) {
            return ((float) ($left['roofed_surface'] ?? 0) <=> (float) ($right['roofed_surface'] ?? 0)) * $direction;
        }

        return 0;
    });

    return $properties;
}

function property_matches_text($property, string $query): bool
{
    if (trim($query) === '' || !is_array($property)) {
        return true;
    }

    $values = [
        $property['publication_title'] ?? '',
        $property['real_address'] ?? '',
        $property['fake_address'] ?? '',
        $property['address'] ?? '',
    ];

    $haystack = normalize_text(implode(' ', array_filter($values, 'is_string')));
    return str_contains($haystack, normalize_text($query));
}

function property_matches_local_filters($property, array $query): bool
{
    if (!is_array($property)) {
        return false;
    }

    $bedrooms = query_value($query, 'bedrooms', 'dormitorios');
    if ($bedrooms === '4' && (int) ($property['suite_amount'] ?? 0) < 4) {
        return false;
    }

    return true;
}

function read_locally_filtered_search(
    string $apiKey,
    int $limit,
    int $page,
    array $searchData,
    string $textQuery,
    array $query,
    array $sortConfig,
    string $sort
): array
{
    $matches = [];
    $totalScanned = 0;
    $lastMeta = [];

    for ($tokkoPage = 0; $tokkoPage < MAX_TOKKO_PAGES; $tokkoPage++) {
        $offset = $tokkoPage * TOKKO_PAGE_SIZE;
        $responseData = read_tokko_search($apiKey, TOKKO_PAGE_SIZE, $offset, $searchData, $sortConfig);
        $meta = isset($responseData['meta']) && is_array($responseData['meta']) ? $responseData['meta'] : [];
        $objects = isset($responseData['objects']) && is_array($responseData['objects']) ? $responseData['objects'] : [];
        $lastMeta = $meta;
        $totalScanned += count($objects);

        foreach ($objects as $object) {
            if (property_matches_text($object, $textQuery) && property_matches_local_filters($object, $query)) {
                $matches[] = $object;
            }
        }

        $totalCount = isset($meta['total_count']) ? (int) $meta['total_count'] : null;
        if (count($objects) === 0 || ($totalCount !== null && $totalScanned >= $totalCount)) {
            break;
        }
    }

    $offset = ($page - 1) * $limit;
    $matches = sort_properties($matches, $sort);

    return [
        'meta' => array_merge($lastMeta, [
            'limit' => $limit,
            'offset' => $offset,
            'page' => $page,
            'total_count' => count($matches),
            'total_pages' => (int) ceil(count($matches) / $limit),
        ]),
        'objects' => array_slice($matches, $offset, $limit),
    ];
}

$propertyId = get_property_id();

if ($propertyId !== '') {
    $data = cached_json('property_' . $propertyId, 300, function () use ($apiKey, $propertyId) {
        return read_tokko_property($apiKey, $propertyId);
    });

    json_response($data);
}

$page = clamp_number($_GET['page'] ?? null, 1, 1, 10000);
$limit = clamp_number($_GET['limit'] ?? null, DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);
$offset = ($page - 1) * $limit;
$location = query_value($_GET, 'location', 'ubicacion');
$cacheKey = 'properties_search_' . md5($_SERVER['QUERY_STRING'] ?? '');

$data = cached_json($cacheKey, 300, function () use ($apiKey, $limit, $offset, $page, $location) {
    $searchData = build_search_data($_GET);
    $sortConfig = sort_config($_GET);
    $sort = sort_option($_GET);

    $bedrooms = query_value($_GET, 'bedrooms', 'dormitorios');
    if (trim($location) !== '' || $bedrooms === '4') {
        return read_locally_filtered_search($apiKey, $limit, $page, $searchData, $location, $_GET, $sortConfig, $sort);
    }

    $responseData = read_tokko_search($apiKey, $limit, $offset, $searchData, $sortConfig);
    $meta = isset($responseData['meta']) && is_array($responseData['meta']) ? $responseData['meta'] : [];
    $objects = isset($responseData['objects']) && is_array($responseData['objects']) ? $responseData['objects'] : [];
    $totalCount = isset($meta['total_count']) ? (int) $meta['total_count'] : 0;

    return [
        'meta' => array_merge($meta, [
            'limit' => $limit,
            'offset' => $offset,
            'page' => $page,
            'total_pages' => (int) ceil($totalCount / $limit),
        ]),
        'objects' => $objects,
    ];
});

json_response($data);
