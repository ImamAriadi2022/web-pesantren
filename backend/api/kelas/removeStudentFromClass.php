<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['santri_id']) || empty($input['santri_id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'ID santri tidak valid'
        ]);
        exit();
    }
    
    $santri_id = (int)$input['santri_id'];
    
    // Get santri info first
    $infoQuery = "SELECT s.nama, k.nama_kelas 
                  FROM santri s 
                  LEFT JOIN kelas k ON s.kelas_id = k.id 
                  WHERE s.id = :santri_id AND s.status = 'Aktif'";
    $infoStmt = $pdo->prepare($infoQuery);
    $infoStmt->bindParam(':santri_id', $santri_id, PDO::PARAM_INT);
    $infoStmt->execute();
    $santriInfo = $infoStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$santriInfo) {
        echo json_encode([
            'success' => false,
            'message' => 'Santri tidak ditemukan atau sudah tidak aktif'
        ]);
        exit();
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Set kelas_id to NULL untuk mengeluarkan santri dari kelas
    $query = "UPDATE santri SET kelas_id = NULL WHERE id = :santri_id AND status = 'Aktif'";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':santri_id', $santri_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        $affected = $stmt->rowCount();
        
        if ($affected > 0) {
            $pdo->commit();
            echo json_encode([
                'success' => true,
                'message' => "Santri {$santriInfo['nama']} berhasil dikeluarkan dari kelas {$santriInfo['nama_kelas']}"
            ]);
        } else {
            $pdo->rollback();
            echo json_encode([
                'success' => false,
                'message' => 'Gagal mengeluarkan santri dari kelas'
            ]);
        }
    } else {
        $pdo->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Gagal mengeluarkan santri dari kelas'
        ]);
    }
    
} catch(PDOException $e) {
    if (isset($pdo)) $pdo->rollback();
    error_log("Database Error in removeStudentFromClass.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan database: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    if (isset($pdo)) $pdo->rollback();
    error_log("General Error in removeStudentFromClass.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
?>
    ");
    $infoStmt->execute([$data['santri_kelas_id']]);
    $info = $infoStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$info) {
        echo json_encode(['success' => false, 'message' => 'Data santri di kelas tidak ditemukan']);
        exit;
    }
    
    // Remove student from class (soft delete by updating status)
    $updateStmt = $pdo->prepare("
        UPDATE santri_kelas 
        SET status = 'Pindah', tanggal_keluar = CURDATE() 
        WHERE id = ?
    ");
    
    $success = $updateStmt->execute([$data['santri_kelas_id']]);
    
    if ($success) {
        echo json_encode([
            'success' => true, 
            'message' => "Santri {$info['santri_nama']} berhasil dipindahkan dari kelas {$info['nama_kelas']}"
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal memindahkan santri dari kelas']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}