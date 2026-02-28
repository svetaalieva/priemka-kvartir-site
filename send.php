<?php
/**
 * Приём заявки с формы и отправка на email i@snegoda.ru
 * POST: JSON { fio, phone, address, area, datetime, comment } или form-data
 */

header('Content-Type: application/json; charset=utf-8');

// Разрешить запросы с сайта (подставьте свой домен или * для любого)
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed = ['https://kontrolkachestva.online', 'http://kontrolkachestva.online', 'http://localhost:3000'];
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

// Получить данные: JSON или form
$raw = file_get_contents('php://input');
$data = [];

if (!empty($raw)) {
    $json = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
        $data = $json;
    }
}

if (empty($data)) {
    $data = [
        'fio'      => $_POST['fio'] ?? '',
        'phone'    => $_POST['phone'] ?? '',
        'address'  => $_POST['address'] ?? '',
        'area'     => $_POST['area'] ?? '',
        'datetime' => $_POST['datetime'] ?? '',
        'comment'  => $_POST['comment'] ?? '',
    ];
}

// Нормализация полей
$fio      = trim((string)($data['fio'] ?? $data['name'] ?? ''));
$phone    = trim((string)($data['phone'] ?? ''));
$address  = trim((string)($data['address'] ?? $data['city'] ?? ''));
$area     = trim((string)($data['area'] ?? ''));
$datetime = trim((string)($data['datetime'] ?? ''));
$comment  = trim((string)($data['comment'] ?? ''));
$summary  = trim((string)($data['summary'] ?? ''));

// Минимальная валидация
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

// Тема письма
$subject = 'Заявка с сайта: ' . mb_substr($fio, 0, 50);

// Тело письма
if ($summary !== '') {
    $body = $summary;
} else {
    $body = "ФИО: {$fio}\n";
    $body .= "Телефон: {$phone}\n";
    $body .= "Адрес/ЖК: {$address}\n";
    $body .= "Площадь: {$area} м²\n";
    $body .= "Дата и время осмотра: {$datetime}\n";
    if ($comment !== '') {
        $body .= "Комментарий: {$comment}\n";
    }
}

$to = 'i@snegoda.ru';
$subjectMime = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'kontrolkachestva.online') . "\r\n"
         . "Reply-To: {$to}\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subjectMime, $body, $headers);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Не удалось отправить письмо']);
    exit;
}

echo json_encode(['ok' => true]);
