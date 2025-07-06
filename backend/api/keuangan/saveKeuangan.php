<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    if (isset($input['id']) && $input['id']) {
        // Update existing keuangan
        $stmt = $db->prepare("UPDATE keuangan SET santri_id = ?, kode_transaksi = ?, jenis_transaksi = ?, kategori = ?, jumlah = ?, tanggal_transaksi = ?, metode_pembayaran = ?, keterangan = ?, bukti_pembayaran = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $input['santri_id'] ?? null,
            $input['kode_transaksi'],
            $input['jenis_transaksi'],
            $input['kategori'],
            $input['jumlah'],
            $input['tanggal_transaksi'],
            $input['metode_pembayaran'] ?? 'Tunai',
            $input['keterangan'] ?? '',
            $input['bukti_pembayaran'] ?? '',
            $input['status'] ?? 'Berhasil',
            $input['id']
        ]);
        $message = 'Data keuangan berhasil diupdate';
    } else {
        // Create new keuangan
        $stmt = $db->prepare("INSERT INTO keuangan (santri_id, kode_transaksi, jenis_transaksi, kategori, jumlah, tanggal_transaksi, metode_pembayaran, keterangan, bukti_pembayaran, status, diproses_oleh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['santri_id'] ?? null,
            $input['kode_transaksi'],
            $input['jenis_transaksi'],
            $input['kategori'],
            $input['jumlah'],
            $input['tanggal_transaksi'],
            $input['metode_pembayaran'] ?? 'Tunai',
            $input['keterangan'] ?? '',
            $input['bukti_pembayaran'] ?? '',
            $input['status'] ?? 'Berhasil',
            1 // diproses_oleh default user id 1
        ]);
        $message = 'Data keuangan berhasil ditambahkan';
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
