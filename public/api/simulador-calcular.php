<?php
declare(strict_types=1);

require __DIR__ . '/_config.php';

$barrios = [
    [
        'nombre' => 'La Amelia',
        'spreadsheetId' => '1gaYsEH9MhRWlILxguwP7CAzN6ISAyee6qm86ue2NFys',
        'range' => 'Lotes!A2:H',
        'map' => function ($row) {
            return [
                'barrio' => 'La Amelia',
                'lote' => $row[0] ?? '',
                'anticipo' => (float) ($row[5] ?? 0),
                'cuota' => (float) ($row[7] ?? 0),
                'cuotas' => (float) ($row[6] ?? 0),
                'precioTotal' => (float) ($row[3] ?? 0),
                'disponible' => ($row[2] ?? '') === 'Disponible',
            ];
        },
    ],
    [
        'nombre' => 'Campo Alto',
        'spreadsheetId' => '1qnhqiMYouJMeK16xzlTIkwJ8pfWo_NwA6jWRsBqyVho',
        'range' => 'Lotes!A2:H',
        'map' => function ($row) {
            return [
                'barrio' => 'Campo Alto',
                'lote' => $row[0] ?? '',
                'anticipo' => (float) ($row[5] ?? 0),
                'cuota' => (float) ($row[7] ?? 0),
                'cuotas' => (float) ($row[6] ?? 0),
                'precioTotal' => (float) ($row[4] ?? 0),
                'disponible' => ($row[2] ?? '') === 'Disponible',
            ];
        },
    ],
    [
        'nombre' => 'Islas Barrios Náuticos',
        'spreadsheetId' => '1Xc4pAyHtWe7hQSZ5pZOwE4YRJQiiyzM60QFPfZkYL2U',
        'range' => 'Lotes!A2:I',
        'map' => function ($row) {
            return [
                'barrio' => 'Islas Barrios Náuticos',
                'lote' => $row[0] ?? '',
                'anticipo' => (float) ($row[6] ?? 0),
                'cuota' => (float) ($row[8] ?? 0),
                'cuotas' => (float) ($row[7] ?? 0),
                'precioTotal' => (float) ($row[5] ?? 0),
                'disponible' => ($row[4] ?? '') === 'Disponible',
            ];
        },
    ],
    [
        'nombre' => 'Justina',
        'spreadsheetId' => '18g1iz4jS9bGbtjXFuQcfw4A7zhofoSTR_I5EOu_Ak2s',
        'range' => 'Lotes!A2:G',
        'map' => function ($row) {
            return [
                'barrio' => 'Justina',
                'lote' => $row[0] ?? '',
                'anticipo' => (float) ($row[4] ?? 0),
                'cuota' => (float) ($row[6] ?? 0),
                'cuotas' => (float) ($row[5] ?? 0),
                'precioTotal' => (float) ($row[3] ?? 0),
                'disponible' => ($row[2] ?? '') === 'Disponible',
            ];
        },
    ],
    [
        'nombre' => 'Puerta del Sol',
        'spreadsheetId' => '1bAJe3Y-ANtpnvLZFmcDLqeV2a1akpaA8n2ZuetGLoks',
        'range' => 'Lotes!A2:I',
        'map' => function ($row) {
            return [
                'barrio' => 'Puerta del Sol',
                'lote' => $row[0] ?? '',
                'anticipo' => (float) ($row[5] ?? 0),
                'cuota' => (float) ($row[7] ?? 0),
                'cuotas' => (float) ($row[6] ?? 0),
                'precioTotal' => (float) ($row[4] ?? 0),
                'disponible' => ($row[2] ?? '') === 'Disponible',
            ];
        },
    ],
];

function get_lotes(array $barrios, string $apiKey): array
{
    return cached_json('simulator-lotes', 300, function () use ($barrios, $apiKey) {
        $resultados = [];

        foreach ($barrios as $barrio) {
            $url = 'https://sheets.googleapis.com/v4/spreadsheets/' . rawurlencode($barrio['spreadsheetId']) . '/values/' . rawurlencode($barrio['range']) . '?key=' . rawurlencode($apiKey);
            $response = read_json_url($url, 10);

            if (!$response['ok']) {
                continue;
            }

            $values = $response['data']['values'] ?? [];
            if (!is_array($values)) {
                continue;
            }

            foreach ($values as $row) {
                $lote = $barrio['map']($row);
                if ($lote['disponible']) {
                    $resultados[] = $lote;
                }
            }
        }

        return $resultados;
    });
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => true, 'mensaje' => 'Usar POST con anticipo y cuota.']);
}

$apiKey = api_secret('GOOGLE_SHEETS_API_KEY', GOOGLE_SHEETS_API_KEY);
if ($apiKey === '') {
    json_response(['error' => 'API Key no configurada'], 500);
}

$payload = json_decode((string) file_get_contents('php://input'), true);
$anticipo = (float) ($payload['anticipo'] ?? 0);
$cuota = (float) ($payload['cuota'] ?? 0);

if ($anticipo <= 0 || $cuota <= 0) {
    json_response(['error' => 'Datos incompletos'], 400);
}

$opciones = array_values(array_filter(
    get_lotes($barrios, $apiKey),
    function ($lote) use ($anticipo, $cuota) {
        return $lote['disponible'] && $lote['anticipo'] <= $anticipo && $lote['cuota'] <= $cuota;
    }
));

usort($opciones, function ($a, $b) {
    if ($a['anticipo'] == $b['anticipo']) {
        return 0;
    }

    return $a['anticipo'] < $b['anticipo'] ? -1 : 1;
});

json_response([
    'totalOpciones' => count($opciones),
    'mejorOpcion' => $opciones[0] ?? null,
    'opciones' => $opciones,
]);
