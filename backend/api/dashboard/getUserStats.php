<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

try {
    // Count users by role
    $queryUserStats = "
        SELECT 
            role,
            COUNT(*) as total
        FROM users 
        WHERE status = 'active'
        GROUP BY role
    ";
    $stmtUserStats = $pdo->prepare($queryUserStats);
    $stmtUserStats->execute();
    $userStats = $stmtUserStats->fetchAll(PDO::FETCH_ASSOC);
    
    // Initialize role counts
    $roleStats = [
        'admin' => 0,
        'pengajar' => 0,
        'santri' => 0
    ];
    
    // Process user stats
    foreach ($userStats as $stat) {
        if (isset($roleStats[$stat['role']])) {
            $roleStats[$stat['role']] = (int)$stat['total'];
        }
    }

    // Count total santri (active students)
    $querySantri = "SELECT COUNT(*) as total FROM santri WHERE status = 'Aktif'";
    $stmtSantri = $pdo->prepare($querySantri);
    $stmtSantri->execute();
    $totalSantri = $stmtSantri->fetch(PDO::FETCH_ASSOC)['total'];

    // Count total pengajar/ustadz (active teachers)
    $queryUstadz = "SELECT COUNT(*) as total FROM ustadz WHERE status = 'Aktif'";
    $stmtUstadz = $pdo->prepare($queryUstadz);
    $stmtUstadz->execute();
    $totalPengajar = $stmtUstadz->fetch(PDO::FETCH_ASSOC)['total'];

    // Count total asrama (active dormitories)
    $queryAsrama = "SELECT COUNT(*) as total FROM asrama WHERE status = 'Aktif'";
    $stmtAsrama = $pdo->prepare($queryAsrama);
    $stmtAsrama->execute();
    $totalAsrama = $stmtAsrama->fetch(PDO::FETCH_ASSOC)['total'];

    // Count total kelas (active classes)
    $queryKelas = "SELECT COUNT(*) as total FROM kelas WHERE status = 'Aktif'";
    $stmtKelas = $pdo->prepare($queryKelas);
    $stmtKelas->execute();
    $totalKelas = $stmtKelas->fetch(PDO::FETCH_ASSOC)['total'];

    // Count recent activities (last 30 days)
    $queryRecentNilai = "SELECT COUNT(*) as total FROM nilai WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    $stmtRecentNilai = $pdo->prepare($queryRecentNilai);
    $stmtRecentNilai->execute();
    $recentNilai = $stmtRecentNilai->fetch(PDO::FETCH_ASSOC)['total'];

    $queryRecentAbsensi = "SELECT COUNT(*) as total FROM absensi WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    $stmtRecentAbsensi = $pdo->prepare($queryRecentAbsensi);
    $stmtRecentAbsensi->execute();
    $recentAbsensi = $stmtRecentAbsensi->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'success' => true,
        'data' => [
            'userRoles' => $roleStats,
            'totalSantri' => (int)$totalSantri,
            'totalPengajar' => (int)$totalPengajar,
            'totalAsrama' => (int)$totalAsrama,
            'totalKelas' => (int)$totalKelas,
            'recentActivities' => [
                'nilai' => (int)$recentNilai,
                'absensi' => (int)$recentAbsensi
            ]
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'data' => [
            'userRoles' => ['admin' => 0, 'pengajar' => 0, 'santri' => 0],
            'totalSantri' => 0,
            'totalPengajar' => 0,
            'totalAsrama' => 0,
            'totalKelas' => 0,
            'recentActivities' => ['nilai' => 0, 'absensi' => 0]
        ]
    ]);
}
?>
