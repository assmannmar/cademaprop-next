<?php
declare(strict_types=1);

require __DIR__ . '/api/_config.php';

const SITE_URL = 'https://cademaprop.com.ar';
const BRAND_NAME = 'Cadema Bienes Raices';
const DEFAULT_PROPERTY_TITLE = 'Propiedad en venta o alquiler | Cadema Bienes Raices';
const DEFAULT_PROPERTY_DESCRIPTION = 'Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.';
const DEFAULT_PROPERTY_IMAGE = '/carousel/2.jpg';

function seo_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function seo_absolute_url(string $path): string
{
    if (preg_match('#^https?://#i', $path)) {
        return $path;
    }

    return SITE_URL . '/' . ltrim($path, '/');
}

function seo_strip_html(?string $value): string
{
    if ($value === null || $value === '') {
        return '';
    }

    return trim(preg_replace('/\s+/', ' ', strip_tags($value)) ?? '');
}

function seo_truncate(string $value, int $maxLength): string
{
    if (function_exists('mb_strlen') && function_exists('mb_substr')) {
        if (mb_strlen($value, 'UTF-8') <= $maxLength) {
            return $value;
        }

        return rtrim(mb_substr($value, 0, $maxLength - 1, 'UTF-8')) . '...';
    }

    if (strlen($value) <= $maxLength) {
        return $value;
    }

    return rtrim(substr($value, 0, $maxLength - 1)) . '...';
}

function seo_translate_operation(?string $type): string
{
    $translations = [
        'Sale' => 'venta',
        'Rent' => 'alquiler',
        'Temporary Rent' => 'alquiler temporal',
    ];

    return $translations[$type ?? ''] ?? ($type ?? '');
}

function seo_translate_property_type(?string $type): string
{
    $translations = [
        'House' => 'Casa',
        'Weekend House' => 'Casa de fin de semana',
        'Apartment' => 'Departamento',
        'Land' => 'Terreno',
        'Office' => 'Oficina',
        'Commercial' => 'Local comercial',
        'Industrial Ship' => 'Nave industrial',
        'Storage' => 'Deposito',
    ];

    return $translations[$type ?? ''] ?? ($type ?: 'Propiedad');
}

function seo_property_type(array $property): string
{
    $developmentType = $property['development']['type']['name'] ?? null;
    $type = $property['type']['name'] ?? null;
    return seo_translate_property_type(is_string($developmentType) && $developmentType !== '' ? $developmentType : (is_string($type) ? $type : null));
}

function seo_property_title(array $property): string
{
    $publicationTitle = $property['publication_title'] ?? '';
    if (is_string($publicationTitle) && trim($publicationTitle) !== '') {
        return trim($publicationTitle);
    }

    $operationType = seo_translate_operation($property['operations'][0]['operation_type'] ?? null);
    $propertyType = seo_property_type($property);
    $location = $property['location']['name'] ?? '';

    return $propertyType
        . ($operationType !== '' ? ' en ' . $operationType : '')
        . (is_string($location) && $location !== '' ? ' en ' . $location : '');
}

function seo_property_description(array $property): string
{
    $rawDescription = seo_strip_html($property['rich_description'] ?? $property['description'] ?? null);
    if ($rawDescription !== '') {
        return seo_truncate($rawDescription, 155);
    }

    $operationType = seo_translate_operation($property['operations'][0]['operation_type'] ?? null);
    $propertyType = seo_property_type($property);
    $location = $property['location']['name'] ?? ($property['location']['short_location'] ?? '');
    $specs = [];

    if (!empty($property['room_amount'])) {
        $specs[] = (string) $property['room_amount'] . ' ambientes';
    }
    if (!empty($property['suite_amount'])) {
        $specs[] = (string) $property['suite_amount'] . ' dormitorios';
    }
    if (!empty($property['bathroom_amount'])) {
        $specs[] = (string) $property['bathroom_amount'] . ' banos';
    }
    if (!empty($property['surface'])) {
        $specs[] = (string) $property['surface'] . ' m2 de terreno';
    }

    return seo_truncate(
        $propertyType
            . ($operationType !== '' ? ' en ' . $operationType : '')
            . (is_string($location) && $location !== '' ? ' en ' . $location : '')
            . '. '
            . implode(', ', $specs)
            . '. Consulta precio y coordina una visita con Cadema.',
        155
    );
}

function seo_main_image(array $property): string
{
    $photos = $property['photos'] ?? [];
    if (!is_array($photos)) {
        return seo_absolute_url(DEFAULT_PROPERTY_IMAGE);
    }

    foreach ($photos as $photo) {
        if (is_array($photo) && !empty($photo['is_front_cover'])) {
            return seo_absolute_url((string) ($photo['original'] ?? $photo['image'] ?? DEFAULT_PROPERTY_IMAGE));
        }
    }

    $firstPhoto = $photos[0] ?? [];
    if (is_array($firstPhoto)) {
        return seo_absolute_url((string) ($firstPhoto['original'] ?? $firstPhoto['image'] ?? DEFAULT_PROPERTY_IMAGE));
    }

    return seo_absolute_url(DEFAULT_PROPERTY_IMAGE);
}

function seo_price(array $property): ?array
{
    $prices = $property['operations'][0]['prices'] ?? [];
    if (!is_array($prices) || count($prices) === 0) {
        return null;
    }

    foreach ($prices as $price) {
        if (is_array($price) && !empty($price['web_price'])) {
            return $price;
        }
    }

    return is_array($prices[0]) ? $prices[0] : null;
}

function seo_property_json_ld(array $property, string $slug, string $title, string $description, string $image, string $canonical): array
{
    $price = seo_price($property);
    $additional = [];

    if (!empty($property['surface'])) {
        $additional[] = ['@type' => 'PropertyValue', 'name' => 'Superficie terreno', 'value' => $property['surface']];
    }
    if (!empty($property['roofed_surface'])) {
        $additional[] = ['@type' => 'PropertyValue', 'name' => 'Superficie cubierta', 'value' => $property['roofed_surface']];
    }
    if (!empty($property['room_amount'])) {
        $additional[] = ['@type' => 'PropertyValue', 'name' => 'Ambientes', 'value' => $property['room_amount']];
    }
    if (!empty($property['suite_amount'])) {
        $additional[] = ['@type' => 'PropertyValue', 'name' => 'Dormitorios', 'value' => $property['suite_amount']];
    }

    return [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $title,
        'description' => $description,
        'image' => $image,
        'url' => $canonical,
        'brand' => [
            '@type' => 'RealEstateAgent',
            'name' => BRAND_NAME,
        ],
        'category' => seo_property_type($property),
        'offers' => [
            '@type' => 'Offer',
            'availability' => 'https://schema.org/InStock',
            'url' => $canonical,
            'price' => $price['price'] ?? null,
            'priceCurrency' => $price['currency'] ?? 'USD',
            'seller' => [
                '@type' => 'RealEstateAgent',
                'name' => BRAND_NAME,
            ],
        ],
        'additionalProperty' => $additional,
        'areaServed' => $property['location']['full_location'] ?? ($property['location']['name'] ?? null),
    ];
}

function seo_extract_slug(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (!is_string($path)) {
        return '';
    }

    if (preg_match('#^/propiedades/([^/]+)/?$#', $path, $match)) {
        return $match[1];
    }

    return '';
}

function seo_read_property(string $propertyId): ?array
{
    $apiKey = api_secret('TOKKO_API_KEY', TOKKO_API_KEY);
    if ($apiKey === '') {
        return null;
    }

    $data = cached_json('property_' . $propertyId, 300, function () use ($apiKey, $propertyId) {
        $url = 'https://www.tokkobroker.com/api/v1/property/' . rawurlencode($propertyId) . '/?'
            . http_build_query([
                'key' => $apiKey,
                'format' => 'json',
                'lang' => 'es',
            ]);

        $response = read_json_url($url, 15);
        return $response['ok'] && is_array($response['data']) ? $response['data'] : null;
    });

    return is_array($data) ? $data : null;
}

function seo_replace_tag(string $html, string $pattern, string $replacement): string
{
    $next = preg_replace($pattern, $replacement, $html, 1);
    return is_string($next) ? $next : $html;
}

function seo_render_meta(array $property, string $slug, string $html): string
{
    $title = seo_property_title($property);
    $browserTitle = $title . ' | Cadema Bienes Raices';
    $description = seo_property_description($property);
    $image = seo_main_image($property);
    $canonical = seo_absolute_url('/propiedades/' . $slug);
    $jsonLd = seo_property_json_ld($property, $slug, $title, $description, $image, $canonical);

    $html = seo_replace_tag($html, '#<title>.*?</title>#s', '<title>' . seo_html($browserTitle) . '</title>');
    $html = seo_replace_tag($html, '#<meta name="description" content="[^"]*"\s*/?>#', '<meta name="description" content="' . seo_html($description) . '"/>');
    $html = seo_replace_tag($html, '#<meta property="og:title" content="[^"]*"\s*/?>#', '<meta property="og:title" content="' . seo_html($title) . '"/>');
    $html = seo_replace_tag($html, '#<meta property="og:description" content="[^"]*"\s*/?>#', '<meta property="og:description" content="' . seo_html($description) . '"/>');
    $html = seo_replace_tag($html, '#<meta property="og:image" content="[^"]*"\s*/?>#', '<meta property="og:image" content="' . seo_html($image) . '"/>');
    $html = seo_replace_tag($html, '#<meta name="twitter:title" content="[^"]*"\s*/?>#', '<meta name="twitter:title" content="' . seo_html($browserTitle) . '"/>');
    $html = seo_replace_tag($html, '#<meta name="twitter:description" content="[^"]*"\s*/?>#', '<meta name="twitter:description" content="' . seo_html($description) . '"/>');
    $html = seo_replace_tag($html, '#<meta name="twitter:image" content="[^"]*"\s*/?>#', '<meta name="twitter:image" content="' . seo_html($image) . '"/>');

    $extra = '<link rel="canonical" href="' . seo_html($canonical) . '"/>'
        . '<meta property="og:url" content="' . seo_html($canonical) . '"/>'
        . '<script type="application/ld+json">'
        . json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        . '</script>';

    return seo_replace_tag($html, '#</head>#', $extra . '</head>');
}

$templatePath = __DIR__ . '/propiedades/placeholder/index.html';
if (!is_file($templatePath)) {
    http_response_code(500);
    echo 'No se encontro la plantilla estatica de propiedades.';
    exit;
}

$html = (string) file_get_contents($templatePath);
$slug = seo_extract_slug();
$propertyId = preg_match('/^(\d+)/', $slug, $match) ? $match[1] : '';
$property = $propertyId !== '' ? seo_read_property($propertyId) : null;

header('Content-Type: text/html; charset=utf-8');

if ($property !== null) {
    echo seo_render_meta($property, $slug, $html);
    exit;
}

echo $html;
