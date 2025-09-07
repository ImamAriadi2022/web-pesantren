<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    // Check if kkm column exists in nilai table
    $stmt = $pdo->prepare("SHOW COLUMNS FROM nilai LIKE 'kkm'");
    $stmt->execute();
    $column_exists = $stmt->fetch();
    
    if (!$column_exists) {
        // Add kkm column to nilai table
        $stmt = $pdo->prepare("ALTER TABLE nilai ADD COLUMN kkm INT DEFAULT 75 AFTER nilai");
        $stmt->execute();
        echo "Column 'kkm' added to nilai table successfully.\n";
    } else {
        echo "Column 'kkm' already exists in nilai table.\n";
    }
    
    // Update existing records to set kkm from mata_pelajaran if kkm is null
    $stmt = $pdo->prepare("
        UPDATE nilai n 
        JOIN mata_pelajaran mp ON n.mapel_id = mp.id 
        SET n.kkm = mp.kkm 
        WHERE n.kkm IS NULL OR n.kkm = 0
    ");
    $stmt->execute();
    $affected_rows = $stmt->rowCount();
    echo "Updated {$affected_rows} records with KKM from mata_pelajaran.\n";
    
    echo "Schema update completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error updating schema: " . $e->getMessage() . "\n";
}
?>