<?php
// Test API getNilai untuk santri
require_once 'config/database.php';

echo "<h2>Test API getNilai untuk Santri</h2>";

// Test 1: Cek apakah tabel dan data ada
echo "<h3>1. Cek Tabel dan Data:</h3>";
try {
    // Cek tabel santri
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM santri");
    $santriCount = $stmt->fetch()['count'];
    echo "Jumlah santri: $santriCount<br>";
    
    // Cek tabel nilai
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM nilai");
    $nilaiCount = $stmt->fetch()['count'];
    echo "Jumlah nilai: $nilaiCount<br>";
    
    // Cek tabel mata_pelajaran
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM mata_pelajaran");
    $mapelCount = $stmt->fetch()['count'];
    echo "Jumlah mata pelajaran: $mapelCount<br>";
    
    // Ambil sample santri pertama
    $stmt = $pdo->query("SELECT id, nama, nis FROM santri LIMIT 5");
    $santriList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<br><strong>Sample Santri:</strong><br>";
    foreach($santriList as $santri) {
        echo "ID: {$santri['id']}, Nama: {$santri['nama']}, NIS: {$santri['nis']}<br>";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}

// Test 2: Test query yang sama dengan API
echo "<h3>2. Test Query API:</h3>";
try {
    $test_santri_id = 1; // Gunakan ID santri pertama
    
    // Query santri info
    $santri_query = "
        SELECT 
            s.nama,
            s.nis,
            k.nama_kelas as kelas,
            'Belum ditetapkan' as wali_kelas
        FROM santri s
        LEFT JOIN kelas k ON s.kelas_id = k.id
        WHERE s.id = ?
        LIMIT 1
    ";
    
    $stmt = $pdo->prepare($santri_query);
    $stmt->execute([$test_santri_id]);
    $santri_info = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<strong>Info Santri ID $test_santri_id:</strong><br>";
    if ($santri_info) {
        echo "Nama: " . $santri_info['nama'] . "<br>";
        echo "NIS: " . $santri_info['nis'] . "<br>";
        echo "Kelas: " . ($santri_info['kelas'] ?: 'Tidak ada') . "<br>";
    } else {
        echo "Santri tidak ditemukan<br>";
    }
    
    // Query nilai
    $query = "
        SELECT 
            mp.nama_mapel,
            n.jenis_nilai,
            n.nilai,
            n.semester
        FROM nilai n
        LEFT JOIN mata_pelajaran mp ON n.mapel_id = mp.id
        WHERE n.santri_id = ?
        ORDER BY mp.nama_mapel, n.jenis_nilai
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$test_santri_id]);
    $nilai_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<br><strong>Nilai Raw untuk Santri ID $test_santri_id:</strong><br>";
    if (count($nilai_raw) > 0) {
        foreach($nilai_raw as $n) {
            echo "Mapel: {$n['nama_mapel']}, Jenis: {$n['jenis_nilai']}, Nilai: {$n['nilai']}, Semester: {$n['semester']}<br>";
        }
    } else {
        echo "Tidak ada nilai ditemukan<br>";
    }
    
    // Organize nilai by mapel (sama seperti di API)
    $nilai_by_mapel = [];
    foreach ($nilai_raw as $n) {
        $mapel = $n['nama_mapel'];
        if (!isset($nilai_by_mapel[$mapel])) {
            $nilai_by_mapel[$mapel] = [
                'nama_mapel' => $mapel,
                'uts' => null,
                'uas' => null
            ];
        }
        
        if ($n['jenis_nilai'] === 'UTS') {
            $nilai_by_mapel[$mapel]['uts'] = $n['nilai'];
        } elseif ($n['jenis_nilai'] === 'UAS') {
            $nilai_by_mapel[$mapel]['uas'] = $n['nilai'];
        }
    }
    
    $nilai_final = array_values($nilai_by_mapel);
    
    echo "<br><strong>Nilai Final (diorganisir):</strong><br>";
    echo "<pre>" . print_r($nilai_final, true) . "</pre>";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}

// Test 3: Test API endpoint langsung
echo "<h3>3. Test API Endpoint:</h3>";
$api_url = "http://localhost/web-pesantren/backend/api/santri/getNilai.php?santri_id=1";
echo "URL API: <a href='$api_url' target='_blank'>$api_url</a><br>";

?>
