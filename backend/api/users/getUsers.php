<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../../config/database.php';

$stmt = $pdo->query("SELECT user_id as id, email, role FROM users");
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'data' => $data]);