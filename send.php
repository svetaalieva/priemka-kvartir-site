<?php
header('Content-Type: application/json; charset=utf-8');

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'https://kontrolkachestva.online',
    'http://kontrolkachestva.online',
    'http://localhost:3000'
];

if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ===== Получение данных =====
$raw = file_get_contents('php://input');
$data = [];

if (!empty($raw)) {
    $json = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
        $data = $json;
    }
}

if (empty($data)) {
    $data = $_POST;
}

// ===== Нормализация =====
$fio      = trim((string)($data['fio'] ?? $data['name'] ?? ''));
$phone    = trim((string)($data['phone'] ?? ''));
$address  = trim((string)($data['address'] ?? $data['city'] ?? ''));
$area     = trim((string)($data['area'] ?? ''));
$datetime = trim((string)($data['datetime'] ?? ''));
$comment  = trim((string)($data['comment'] ?? ''));
$page     = trim((string)($data['page'] ?? ''));

// ===== Форматирование даты =====
if ($datetime !== '') {
    try {
        $dt = new DateTime($datetime);
        $datetime = $dt->format('d.m.Y H:i');
    } catch (Exception $e) {}
}

// ===== Валидация =====
if ($fio === '' || mb_strlen($fio) < 2) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Укажите ФИО']);
    exit;
}

if ($phone === '' || preg_match('/\d{10,}/', preg_replace('/\D/', '', $phone)) !== 1) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Укажите корректный телефон']);
    exit;
}

// ===== Настройки письма =====
$to = 'i@snegoda.ru';
$siteName = 'Контроль качества';
$fromEmail = 'noreply@kontrolkachestva.online';
$fromName  = 'Контроль качества — заявки';
$logoUrl = 'https://kontrolkachestva.online/brand/logo-horizontal.png';

$subject = '🟡 Заявка с сайта — ' . mb_substr($fio, 0, 60);
$subjectMime = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// ===== Телефон-ссылка =====
$telDigits = preg_replace('/\D+/', '', $phone);
$telHref = $telDigits !== '' ? ('tel:+' . $telDigits) : '';

// ===== Безопасный вывод =====
function esc($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// ===== HTML письмо =====
$html = '
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f6f7f8;font-family:Arial,Helvetica,sans-serif;">
<div style="padding:24px 12px;">
<div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.08);box-shadow:0 16px 60px rgba(0,0,0,0.08);">

<div style="padding:18px 22px;background:linear-gradient(180deg, rgba(255,196,0,0.28), rgba(255,196,0,0.10));border-bottom:1px solid rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:space-between;">
<div>
<div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.55);font-weight:700;">Заявка с сайта</div>
<div style="margin-top:6px;font-size:20px;font-weight:800;">'.esc($siteName).'</div>
</div>
<img src="'.esc($logoUrl).'" style="height:44px;">
</div>

<div style="padding:20px;">
<p style="font-size:14px;color:#666;">Данные клиента:</p>

<div style="margin-top:12px;font-size:15px;font-weight:700;">ФИО:</div>
<div>'.esc($fio).'</div>

<div style="margin-top:10px;font-size:15px;font-weight:700;">Телефон:</div>
<div><a href="'.esc($telHref).'" style="color:#000;text-decoration:underline;">'.esc($phone).'</a></div>

<div style="margin-top:10px;font-size:15px;font-weight:700;">Адрес/ЖК:</div>
<div>'.esc($address).'</div>

<div style="margin-top:10px;font-size:15px;font-weight:700;">Площадь:</div>
<div>'.esc($area).' м²</div>

<div style="margin-top:10px;font-size:15px;font-weight:700;">Дата и время:</div>
<div>'.esc($datetime).'</div>';

if ($comment !== '') {
    $html .= '
<div style="margin-top:10px;font-size:15px;font-weight:700;">Комментарий:</div>
<div>'.nl2br(esc($comment)).'</div>';
}

if ($telHref !== '') {
    $html .= '
<div style="margin-top:24px;text-align:center;">
<a href="'.esc($telHref).'" 
style="display:inline-block;padding:14px 28px;border-radius:999px;background:#ffc400;color:#000;font-weight:800;text-decoration:none;box-shadow:0 12px 30px rgba(255,196,0,0.35);">
📞 Позвонить клиенту
</a>
</div>';
}

$html .= '
</div>

<div style="padding:16px;background:#fbfbfb;border-top:1px solid rgba(0,0,0,0.06);font-size:12px;color:#777;">
Автоматическое письмо с сайта '.esc($siteName).'.
</div>

</div>
</div>
</body>
</html>';

// ===== Заголовки =====
$headers =
"MIME-Version: 1.0\r\n" .
"Content-Type: text/html; charset=UTF-8\r\n" .
"From: " . mb_encode_mimeheader($fromName, 'UTF-8') . " <{$fromEmail}>\r\n" .
"Reply-To: {$to}\r\n";

// ===== Отправка =====
$sent = @mail($to, $subjectMime, $html, $headers);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Не удалось отправить письмо']);
    exit;
}

echo json_encode(['ok' => true]);