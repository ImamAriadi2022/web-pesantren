<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetSantriAsrama();
            break;
        case 'POST':
            handleAddSantriToAsrama();
            break;
        case 'DELETE':
            handleRemoveSantriFromAsrama();
            break;
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function handleGetSantriAsrama() {
    global $pdo;
    
    $asrama_id = $_GET['asrama_id'] ?? null;
    
    if ($asrama_id) {
        // Get santri dalam asrama tertentu
        $stmt = $pdo->prepare("
            SELECT 
                sa.id as santri_asrama_id,
                sa.tanggal_masuk,
                sa.status,
                s.id as santri_id,
                s.nama as nama_santri,
                s.nis,
                s.jenis_kelamin,
                k.nama_kelas
            FROM santri_asrama sa
            JOIN santri s ON sa.santri_id = s.id
            LEFT JOIN kelas k ON s.kelas_id = k.id
            WHERE sa.asrama_id = ? AND sa.status = 'aktif'
            ORDER BY s.nama
        ");
        $stmt->execute([$asrama_id]);
        $santri = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $santri
        ]);
    } else {
        // Get semua santri yang belum memiliki asrama
        $stmt = $pdo->prepare("
            SELECT 
                s.id,
                s.nama,
                s.nis,
                s.jenis_kelamin,
                k.nama_kelas
            FROM santri s
            LEFT JOIN kelas k ON s.kelas_id = k.id
            LEFT JOIN santri_asrama sa ON s.id = sa.santri_id AND sa.status = 'aktif'
            WHERE sa.id IS NULL
            ORDER BY s.nama
        ");
        $stmt->execute();
        $santri = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $santri
        ]);
    }
}

function handleAddSantriToAsrama() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['santri_id']) || empty($input['asrama_id'])) {
        throw new Exception('Santri ID dan Asrama ID harus diisi');
    }
    
    // Cek apakah santri sudah memiliki asrama aktif
    $check_stmt = $pdo->prepare("
        SELECT id FROM santri_asrama 
        WHERE santri_id = ? AND status = 'aktif'
    ");
    $check_stmt->execute([$input['santri_id']]);
    
    if ($check_stmt->rowCount() > 0) {
        throw new Exception('Santri sudah memiliki asrama aktif');
    }
    
    // Cek kapasitas asrama
    $capacity_stmt = $pdo->prepare("
        SELECT 
            a.kapasitas,
            COUNT(sa.id) as jumlah_penghuni
        FROM asrama a
        LEFT JOIN santri_asrama sa ON a.id = sa.asrama_id AND sa.status = 'aktif'
        WHERE a.id = ?
        GROUP BY a.id, a.kapasitas
    ");
    $capacity_stmt->execute([$input['asrama_id']]);
    $capacity_data = $capacity_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$capacity_data) {
        throw new Exception('Asrama tidak ditemukan');
    }
    
    if ($capacity_data['jumlah_penghuni'] >= $capacity_data['kapasitas']) {
        throw new Exception('Kapasitas asrama sudah penuh');
    }
    
    // Tambahkan santri ke asrama
    $insert_stmt = $pdo->prepare("
        INSERT INTO santri_asrama (santri_id, asrama_id, tanggal_masuk, status, created_at)
        VALUES (?, ?, NOW(), 'aktif', NOW())
    ");
    $insert_stmt->execute([$input['santri_id'], $input['asrama_id']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Santri berhasil ditambahkan ke asrama'
    ]);
}

function handleRemoveSantriFromAsrama() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['santri_asrama_id'])) {
        throw new Exception('Santri Asrama ID harus diisi');
    }
    
    // Update status menjadi tidak aktif (soft delete)
    $stmt = $pdo->prepare("
        UPDATE santri_asrama 
        SET status = 'Keluar', tanggal_keluar = NOW(), updated_at = NOW()
        WHERE id = ?
    ");
    $result = $stmt->execute([$input['santri_asrama_id']]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Data tidak ditemukan');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Santri berhasil dikeluarkan dari asrama'
    ]);
}
?>
