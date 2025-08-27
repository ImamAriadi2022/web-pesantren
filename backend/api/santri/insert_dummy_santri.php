<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../../config/database.php';

try {
    $pdo->beginTransaction();
    
    // Data dummy santri
    $santriData = [
        [
            'nis' => '2024001',
            'nama' => 'Ahmad Fauzi',
            'kelas_id' => null,
            'tempat_lahir' => 'Bandung',
            'tanggal_lahir' => '2005-01-15',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Raya Bandung No. 123',
            'no_hp' => '081234567890',
            'nama_wali' => 'H. Muhammad Fauzi',
            'no_hp_wali' => '081234567891'
        ],
        [
            'nis' => '2024002',
            'nama' => 'Fatimah Zahra',
            'kelas_id' => null,
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2005-05-20',
            'jenis_kelamin' => 'Perempuan',
            'alamat' => 'Jl. Merdeka Jakarta No. 456',
            'no_hp' => '081234567892',
            'nama_wali' => 'Hj. Khadijah',
            'no_hp_wali' => '081234567893'
        ],
        [
            'nis' => '2024003',
            'nama' => 'Muhammad Rizki',
            'kelas_id' => null,
            'tempat_lahir' => 'Surabaya',
            'tanggal_lahir' => '2005-08-10',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Pahlawan Surabaya No. 789',
            'no_hp' => '081234567894',
            'nama_wali' => 'Abdullah Rizki',
            'no_hp_wali' => '081234567895'
        ],
        [
            'nis' => '2024004',
            'nama' => 'Aisyah Putri',
            'kelas_id' => null,
            'tempat_lahir' => 'Yogyakarta',
            'tanggal_lahir' => '2005-03-25',
            'jenis_kelamin' => 'Perempuan',
            'alamat' => 'Jl. Malioboro Yogyakarta No. 321',
            'no_hp' => '081234567896',
            'nama_wali' => 'Usman Putri',
            'no_hp_wali' => '081234567897'
        ],
        [
            'nis' => '2024005',
            'nama' => 'Yusuf Ibrahim',
            'kelas_id' => null,
            'tempat_lahir' => 'Medan',
            'tanggal_lahir' => '2005-11-08',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Gajah Mada Medan No. 654',
            'no_hp' => '081234567898',
            'nama_wali' => 'Ibrahim Yusuf',
            'no_hp_wali' => '081234567899'
        ]
    ];
    
    // Insert santri data
    foreach ($santriData as $santri) {
        $stmt = $pdo->prepare("
            INSERT INTO santri (
                nis, nama, kelas_id, tempat_lahir, tanggal_lahir, 
                jenis_kelamin, alamat, no_hp, nama_wali, no_hp_wali, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aktif')
        ");
        
        $stmt->execute([
            $santri['nis'],
            $santri['nama'],
            $santri['kelas_id'],
            $santri['tempat_lahir'],
            $santri['tanggal_lahir'],
            $santri['jenis_kelamin'],
            $santri['alamat'],
            $santri['no_hp'],
            $santri['nama_wali'],
            $santri['no_hp_wali']
        ]);
        
        // Buat user account untuk santri
        $userStmt = $pdo->prepare("
            INSERT INTO users (username, password, nama, role, status) 
            VALUES (?, ?, ?, 'Santri', 'Aktif')
        ");
        
        $userStmt->execute([
            $santri['nis'], // username menggunakan NIS
            password_hash('123456', PASSWORD_BCRYPT), // default password
            $santri['nama']
        ]);
    }
    
    $pdo->commit();
    echo json_encode([
        'success' => true, 
        'message' => 'Data dummy santri berhasil ditambahkan',
        'count' => count($santriData)
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false, 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
