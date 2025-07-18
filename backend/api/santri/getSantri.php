<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../../config/database.php';

$stmt = $pdo->query("SELECT santri.*, users.email FROM santri JOIN users ON santri.user_id = users.id WHERE users.role = 'santri'");
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'data' => $data]);